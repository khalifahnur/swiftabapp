import { pushOnce } from "@/lib/nav";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, Pressable, View } from "react-native";

import { errorMessage } from "@/api/client";
import { openRestaurant } from "@/components/RestaurantCard";
import { Picture, Pill } from "@/components/ui/Bits";
import { Button, tapFeedback } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Sheet";
import { Txt } from "@/components/ui/Txt";
import { palette, radius, shadow } from "@/constants/theme";
import { useCancelReservation } from "@/hooks/queries";
import { reservationTone } from "@/lib/format";
import { openDirections } from "@/lib/links";
import { cancelReminder, hasReminder, scheduleReminder } from "@/lib/notifications";
import { formatClock, fromApi, untilLabel } from "@/lib/time";
import { useToast } from "@/lib/ToastContext";
import { useCart } from "@/store/useCart";
import { usePrefs } from "@/store/usePrefs";
import type { Reservation } from "@/types";

function Meta({ icon, text }: { icon: IconName; text: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
      <Icon name={icon} size={14} color={palette.muted} />
      <Txt size={12.5} color={palette.body}>
        {text}
      </Txt>
    </View>
  );
}

function Quick({ icon, label, onPress, active, testID }: { icon: IconName; label: string; onPress: () => void; active?: boolean; testID?: string }) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: Boolean(active) }}
      onPress={() => {
        tapFeedback();
        onPress();
      }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        height: 38,
        paddingHorizontal: 12,
        borderRadius: radius.pill,
        backgroundColor: active ? palette.brandTint : palette.canvas,
        borderWidth: 1,
        borderColor: active ? palette.brand : palette.line,
      }}
    >
      <Icon name={icon} size={15} color={active ? palette.brandDark : palette.body} />
      <Txt w="semibold" size={12.5} color={active ? palette.brandDark : palette.body}>
        {label}
      </Txt>
    </Pressable>
  );
}

/** One booking, with the actions that make sense for where it stands. */
export default function BookingCard({ booking, kind }: { booking: Reservation; kind: "active" | "completed" | "cancelled" }) {
  const router = useRouter();
  const { showToast } = useToast();
  const cancel = useCancelReservation();
  const openCart = useCart((s) => s.open);
  const lead = usePrefs((s) => s.reminderLeadMinutes);
  const [reminder, setReminder] = useState(false);
  const [asking, setAsking] = useState(false);

  const upcoming = kind === "active";
  const seated = booking.status === "seated";
  const tone = reservationTone(booking.status);
  const when = fromApi(booking.bookingFor);

  useEffect(() => {
    let alive = true;
    if (upcoming) hasReminder(booking.reservationId).then((on) => alive && setReminder(on));
    return () => {
      alive = false;
    };
  }, [upcoming, booking.reservationId]);

  const toggleReminder = async () => {
    if (reminder) {
      await cancelReminder(booking.reservationId);
      setReminder(false);
      showToast("info", "Reminder turned off.");
      return;
    }
    const result = await scheduleReminder({
      reservationId: booking.reservationId,
      restaurantName: booking.restaurantName,
      bookingFor: booking.bookingFor,
      leadMinutes: lead,
    }).catch(() => "denied" as const);
    if (result === "scheduled") {
      setReminder(true);
      showToast("success", `We will remind you ${lead} minutes before.`);
    } else if (result === "too-late") {
      showToast("info", "This booking is about to start, so there is nothing to remind you of.");
    } else {
      showToast("error", "Allow notifications for Swiftab in your phone settings to get reminders.");
    }
  };

  const order = () => {
    openCart({
      restaurantId: booking.restaurantId,
      restaurantName: booking.restaurantName,
      reservationId: booking.reservationId,
      tableNumber: booking.table,
    });
    pushOnce(router, { pathname: "/modal", params: { restaurantId: booking.restaurantId } });
  };

  const confirmCancel = () => {
    cancel.mutate(booking.id, {
      onSuccess: async () => {
        setAsking(false);
        await cancelReminder(booking.reservationId);
        showToast("success", "Your booking was cancelled.");
      },
      onError: (error) => {
        setAsking(false);
        showToast("error", errorMessage(error, "We could not cancel this booking."));
      },
    });
  };

  return (
    <View testID={`booking-${booking.reservationId}`} style={[shadow.card, { backgroundColor: palette.surface, borderRadius: radius.xl, padding: 14 }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${booking.restaurantName}`}
        onPress={() => openRestaurant(router, booking.restaurantId)}
        style={{ flexDirection: "row" }}
      >
        <Picture uri={booking.image} style={{ width: 82, height: 82, borderRadius: 18 }} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
            <Txt w="bold" size={16} numberOfLines={1} style={{ flex: 1 }}>
              {booking.restaurantName}
            </Txt>
            <Pill label={tone.label} fg={tone.fg} bg={tone.bg} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3 }}>
            <Icon name="location-outline" size={13} color={palette.muted} />
            <Txt size={12.5} color={palette.muted} numberOfLines={1} style={{ flex: 1 }}>
              {booking.location}
            </Txt>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: 12, rowGap: 4, marginTop: 8 }}>
            <Meta icon="grid-outline" text={`Table ${booking.table}`} />
            <Meta icon="people-outline" text={`${booking.guests} ${booking.guests === 1 ? "guest" : "guests"}`} />
          </View>
        </View>
      </Pressable>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 12,
          padding: 12,
          borderRadius: radius.md,
          backgroundColor: upcoming ? palette.brandTint : palette.canvas,
        }}
      >
        <Icon name="calendar" size={18} color={upcoming ? palette.pine : palette.muted} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Txt w="bold" size={14} color={upcoming ? palette.pine : palette.ink}>
            {when.format("ddd, D MMM YYYY")}
          </Txt>
          <Txt size={12.5} color={palette.body}>
            {formatClock(booking.bookingFor)} – {formatClock(booking.endTime)}
          </Txt>
        </View>
        {upcoming && !seated && (
          <Txt w="semibold" size={12.5} color={palette.brandDark}>
            {untilLabel(booking.bookingFor)}
          </Txt>
        )}
      </View>

      {upcoming ? (
        <View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
            {Platform.OS !== "web" && !seated && (
              <Quick
                icon={reminder ? "notifications" : "notifications-outline"}
                label={reminder ? "Reminder on" : "Remind me"}
                active={reminder}
                onPress={toggleReminder}
                testID="toggle-reminder"
              />
            )}
            <Quick icon="navigate-outline" label="Directions" onPress={() => openDirections(booking)} />
            {booking.hasOrder && <Quick icon="receipt-outline" label="Track order" onPress={() => pushOnce(router, "/Order")} testID="track-order" />}
          </View>
          <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
            <Button
              label={booking.hasOrder ? "Order more" : seated ? "Order food" : "Order ahead"}
              size="md"
              icon="restaurant-outline"
              style={{ flex: 1.4 }}
              onPress={order}
              testID="booking-order"
            />
            {!seated && <Button label="Cancel" size="md" variant="danger" style={{ flex: 1 }} onPress={() => setAsking(true)} testID="booking-cancel" />}
          </View>
        </View>
      ) : (
        <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
          <Button label="Book again" size="md" variant="soft" style={{ flex: 1 }} onPress={() => openRestaurant(router, booking.restaurantId)} />
          {kind === "completed" && (
            <Button
              label="Rate visit"
              size="md"
              variant="outline"
              icon="star-outline"
              style={{ flex: 1 }}
              onPress={() =>
                pushOnce(router, {
                  pathname: "/screens/ratescreen",
                  params: { restaurantId: booking.restaurantId, restaurantName: booking.restaurantName },
                })
              }
            />
          )}
        </View>
      )}

      <ConfirmDialog
        visible={asking}
        title="Cancel this booking?"
        message={`Your table at ${booking.restaurantName} on ${when.format("ddd, D MMM")} at ${formatClock(booking.bookingFor)} will be released.`}
        confirmLabel="Cancel booking"
        destructive
        busy={cancel.isPending}
        onConfirm={confirmCancel}
        onCancel={() => setAsking(false)}
      />
    </View>
  );
}
