import { pushOnce } from "@/lib/nav";
import { Icon } from "@/components/ui/Icon";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { errorMessage } from "@/api/client";
import TableStep from "@/components/Reserve/TableStep";
import WhenStep from "@/components/Reserve/WhenStep";
import { ErrorState, ScreenHeader, Skeleton } from "@/components/ui/Bits";
import { Button } from "@/components/ui/Button";
import { Txt } from "@/components/ui/Txt";
import { palette, shadow } from "@/constants/theme";
import { useRestaurant } from "@/hooks/queries";
import { businessMoment, prettyClock } from "@/lib/time";
import { useToast } from "@/lib/ToastContext";
import { useBooking } from "@/store/useBooking";

type Step = "when" | "table";

export default function ReserveScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { data: restaurant, isLoading, isError, error, refetch } = useRestaurant(id);
  const booking = useBooking();
  const [step, setStep] = useState<Step>("when");
  const scroller = useRef<ScrollView>(null);

  const { begin } = booking;
  useEffect(() => {
    if (id) begin(id);
  }, [id, begin]);

  useEffect(() => {
    scroller.current?.scrollTo({ y: 0, animated: false });
  }, [step]);

  if (isError && !restaurant) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.canvas }}>
        <ScreenHeader title="Book a table" />
        <ErrorState message={errorMessage(error)} onRetry={() => refetch()} />
      </View>
    );
  }
  if (isLoading || !restaurant) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.canvas }}>
        <ScreenHeader title="Book a table" />
        <View style={{ padding: 20, gap: 16 }}>
          <Skeleton height={320} round={20} />
          <Skeleton height={140} round={20} />
        </View>
      </View>
    );
  }

  const ready = Boolean(booking.date && booking.startTime);
  const start = ready ? businessMoment(booking.date, booking.startTime) : null;
  const bookingFor = start ? start.toISOString() : "";
  const endTime = start ? start.clone().add(booking.durationMinutes, "minutes").toISOString() : "";

  const next = () => {
    if (!ready) {
      showToast("error", booking.date ? "Pick a time to continue." : "Pick a day to continue.");
      return;
    }
    setStep("table");
  };

  const confirm = () => {
    if (!booking.tableName) {
      showToast("error", "Tap a table on the plan to choose it.");
      return;
    }
    pushOnce(router, { pathname: "/screens/confirm", params: { id: restaurant.id } });
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.canvas }}>
      <ScreenHeader
        title={step === "when" ? "Book a table" : "Choose table"}
        onBack={step === "table" ? () => setStep("when") : undefined}
      />

      {/* Progress */}
      <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 20, marginBottom: 6 }}>
        {(["when", "table"] as Step[]).map((s, i) => {
          const done = step === "table" || i === 0;
          return <View key={s} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: done ? palette.pine : palette.line }} />;
        })}
      </View>

      <ScrollView
        ref={scroller}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: insets.bottom + 150 }}
      >
        <Txt w="extrabold" size={22} style={{ letterSpacing: -0.3 }}>
          {restaurant.restaurantName}
        </Txt>
        <Txt size={13.5} color={palette.muted} style={{ marginBottom: 16 }}>
          {step === "when"
            ? "When would you like to come?"
            : start
              ? `${start.format("ddd, D MMM")} · ${prettyClock(booking.startTime)} · ${booking.guests} ${booking.guests === 1 ? "guest" : "guests"}`
              : ""}
        </Txt>

        {step === "when" ? <WhenStep restaurant={restaurant} /> : <TableStep restaurant={restaurant} bookingFor={bookingFor} endTime={endTime} />}
      </ScrollView>

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
        {step === "table" && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <Icon name={booking.tableName ? "checkmark-circle" : "hand-left-outline"} size={20} color={booking.tableName ? palette.success : palette.muted} />
            <Txt w={booking.tableName ? "semibold" : "regular"} size={13.5} color={booking.tableName ? palette.ink : palette.muted} style={{ flex: 1 }} testID="table-summary">
              {booking.tableName ? `Table ${booking.tableName} · ${booking.floorName}` : "Tap a table to choose where you will sit"}
            </Txt>
          </View>
        )}
        {step === "when" ? (
          <Button label="Proceed next" iconRight="arrow-forward" disabled={!ready} onPress={next} testID="reserve-next" />
        ) : (
          <Button label="Book table" disabled={!booking.tableName} onPress={confirm} testID="reserve-book" />
        )}
      </View>
    </View>
  );
}
