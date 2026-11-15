import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Switch, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ApiError, errorMessage } from "@/api/client";
import SuccessMark from "@/components/SuccessMark";
import { Card, Picture, ScreenHeader } from "@/components/ui/Bits";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Txt } from "@/components/ui/Txt";
import { palette, shadow } from "@/constants/theme";
import { useCreateReservation, useRestaurant } from "@/hooks/queries";
import { useUser } from "@/lib/authStore";
import { scheduleReminder } from "@/lib/notifications";
import { businessMoment, formatDayTime, prettyClock } from "@/lib/time";
import { useToast } from "@/lib/ToastContext";
import { useBooking } from "@/store/useBooking";
import { useCart } from "@/store/useCart";
import { useInbox } from "@/store/useInbox";
import { usePrefs } from "@/store/usePrefs";
import type { ReservationCreated } from "@/types";

function Row({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10 }}>
      <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: palette.brandTint, alignItems: "center", justifyContent: "center" }}>
        <Ionicons name={icon} size={17} color={palette.pine} />
      </View>
      <Txt size={13.5} color={palette.muted} style={{ marginLeft: 12, flex: 1 }}>
        {label}
      </Txt>
      <Txt w="semibold" size={14} style={{ maxWidth: "58%", textAlign: "right" }} numberOfLines={2}>
        {value}
      </Txt>
    </View>
  );
}

export default function ConfirmScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const client = useQueryClient();
  const { showToast } = useToast();
  const user = useUser();
  const { data: restaurant } = useRestaurant(id);
  const booking = useBooking();
  const prefs = usePrefs();
  const create = useCreateReservation();
  const openCart = useCart((s) => s.open);

  const [notes, setNotes] = useState(booking.notes);
  const [remind, setRemind] = useState(prefs.autoReminder);
  const [done, setDone] = useState<ReservationCreated | null>(null);
  const [reminderSet, setReminderSet] = useState(false);

  const start = booking.date && booking.startTime ? businessMoment(booking.date, booking.startTime) : null;
  const end = start?.clone().add(booking.durationMinutes, "minutes");
  const restaurantName = restaurant?.restaurantName ?? "";

  const submit = () => {
    if (!user || !restaurant || !start || !end || !booking.tableName) {
      showToast("error", "Some booking details are missing. Go back and choose them again.");
      return;
    }
    create.mutate(
      {
        restaurantId: restaurant.id,
        info: {
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          bookingFor: start.toISOString(),
          endTime: end.toISOString(),
          guests: booking.guests,
          tableNumber: booking.tableName,
          diningArea: booking.floorName,
          restaurantName: restaurant.restaurantName,
          notes: notes.trim() || undefined,
        },
      },
      {
        onSuccess: async (created) => {
          const bookingFor = created.bookingFor || start.toISOString();
          useInbox.getState().add({
            id: `reservation-${created.reservationId}-confirmed`,
            title: "Table booked",
            body: `${restaurant.restaurantName} · ${formatDayTime(bookingFor)} · Table ${created.tableNumber}`,
            kind: "reservation",
            reservationId: created.reservationId,
          });
          if (remind) {
            const result = await scheduleReminder({
              reservationId: created.reservationId,
              restaurantName: restaurant.restaurantName,
              bookingFor,
              leadMinutes: prefs.reminderLeadMinutes,
            }).catch(() => "denied" as const);
            setReminderSet(result === "scheduled");
          }
          setDone(created);
        },
        onError: (error) => {
          const conflict = error instanceof ApiError && error.status === 409;
          showToast("error", errorMessage(error, "We could not complete your booking."));
          if (conflict) {
            // Someone else took the table: go back to the plan, which now shows it booked.
            booking.set({ tableName: null, floorId: null, floorName: "" });
            client.invalidateQueries({ queryKey: ["availability"] });
            router.back();
          }
        },
      },
    );
  };

  if (done && restaurant) {
    const bookingFor = done.bookingFor || start?.toISOString() || "";
    const finish = (go: () => void) => {
      booking.reset();
      go();
    };
    return (
      <View style={{ flex: 1, backgroundColor: palette.canvas, paddingTop: insets.top + 24, paddingBottom: Math.max(insets.bottom, 16) + 12, paddingHorizontal: 22 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: "center", flexGrow: 1, justifyContent: "center" }}>
          <SuccessMark />
          <Txt w="extrabold" size={26} center style={{ marginTop: 8, letterSpacing: -0.3 }} testID="booking-confirmed">
            Table booked!
          </Txt>
          <Txt size={14.5} color={palette.muted} center style={{ marginTop: 6, maxWidth: 300 }}>
            {restaurant.restaurantName} is expecting you. Show this booking when you arrive.
          </Txt>

          <Card style={{ alignSelf: "stretch", marginTop: 24 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, borderBottomWidth: 1, borderColor: palette.line, borderStyle: "dashed" }}>
              <Txt size={12.5} color={palette.muted}>
                Booking reference
              </Txt>
              <Txt w="bold" size={14} selectable>
                {done.reservationId}
              </Txt>
            </View>
            <Row icon="calendar-outline" label="When" value={formatDayTime(bookingFor)} />
            <Row icon="people-outline" label="Guests" value={`${done.guests}`} />
            <Row icon="grid-outline" label="Table" value={`${done.tableNumber}${done.floor ? ` · ${done.floor}` : ""}`} />
            {reminderSet && <Row icon="notifications-outline" label="Reminder" value={`${prefs.reminderLeadMinutes} min before`} />}
          </Card>
        </ScrollView>

        <View style={{ gap: 10, marginTop: 16 }}>
          <Button
            label="Order food ahead"
            icon="restaurant-outline"
            testID="order-ahead"
            onPress={() =>
              finish(() => {
                openCart({
                  restaurantId: restaurant.id,
                  restaurantName: restaurant.restaurantName,
                  reservationId: done.reservationId,
                  tableNumber: done.tableNumber,
                });
                router.dismissTo("/(tabs)/bookings");
                router.push({ pathname: "/modal", params: { restaurantId: restaurant.id } });
              })
            }
          />
          <Button label="View my bookings" variant="outline" testID="view-bookings" onPress={() => finish(() => router.dismissTo("/(tabs)/bookings"))} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: palette.canvas }}>
      <ScreenHeader title="Review booking" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: insets.bottom + 130, gap: 16 }}
        >
          <Card style={{ flexDirection: "row", alignItems: "center", padding: 12 }}>
            <Picture uri={restaurant?.image} style={{ width: 76, height: 76, borderRadius: 16 }} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Txt w="bold" size={16.5} numberOfLines={1}>
                {restaurantName}
              </Txt>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4 }}>
                <Ionicons name="location-outline" size={13} color={palette.muted} />
                <Txt size={12.5} color={palette.muted} numberOfLines={2} style={{ flex: 1 }}>
                  {restaurant?.location}
                </Txt>
              </View>
            </View>
          </Card>

          <Card style={{ paddingVertical: 8 }}>
            <Row icon="calendar-outline" label="Date" value={start ? start.format("ddd, D MMM YYYY") : "—"} />
            <Row
              icon="time-outline"
              label="Time"
              value={start && end ? `${prettyClock(booking.startTime)} – ${end.format("h:mm A")}` : "—"}
            />
            <Row icon="people-outline" label="Guests" value={`${booking.guests} ${booking.guests === 1 ? "person" : "people"}`} />
            <Row icon="grid-outline" label="Table" value={booking.tableName ? `${booking.tableName} · ${booking.floorName}` : "—"} />
          </Card>

          <Card style={{ paddingVertical: 8 }}>
            <Row icon="person-outline" label="Name" value={user?.name ?? "—"} />
            <Row icon="call-outline" label="Phone" value={user?.phoneNumber ?? "—"} />
            <Row icon="mail-outline" label="Email" value={user?.email ?? "—"} />
          </Card>

          <View>
            <Field
              label="Anything the restaurant should know? (optional)"
              placeholder="Birthday, allergies, high chair…"
              value={notes}
              onChangeText={(text) => setNotes(text.slice(0, 240))}
              multiline
              autoCapitalize="sentences"
              autoCorrect
              testID="booking-notes"
            />
          </View>

          {Platform.OS !== "web" && (
            <Card style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Txt w="semibold" size={14.5}>
                  Remind me
                </Txt>
                <Txt size={12.5} color={palette.muted}>
                  A notification {prefs.reminderLeadMinutes} minutes before your table is due.
                </Txt>
              </View>
              <Switch value={remind} onValueChange={setRemind} trackColor={{ false: palette.line, true: palette.brand }} thumbColor={palette.white} />
            </Card>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <View
        style={[
          shadow.raised,
          {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: palette.surface,
            borderTopLeftRadius: 26,
            borderTopRightRadius: 26,
            paddingHorizontal: 20,
            paddingTop: 14,
            paddingBottom: Math.max(insets.bottom, 16) + 6,
          },
        ]}
      >
        <Button label="Confirm booking" icon="checkmark-circle-outline" loading={create.isPending} onPress={submit} testID="confirm-booking" />
        <Txt size={11.5} color={palette.muted} center style={{ marginTop: 8 }}>
          Free to cancel any time before you are seated.
        </Txt>
      </View>
    </View>
  );
}
