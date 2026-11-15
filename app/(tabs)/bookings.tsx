import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { errorMessage } from "@/api/client";
import type { ReservationList } from "@/api/api";
import BookingCard from "@/components/Reserve/BookingCard";
import { EmptyState, ErrorState, Segmented, Skeleton } from "@/components/ui/Bits";
import { Button } from "@/components/ui/Button";
import { Txt } from "@/components/ui/Txt";
import { palette, TAB_BAR_SPACE } from "@/constants/theme";
import { useReservations } from "@/hooks/queries";

const EMPTY: Record<ReservationList, { title: string; message: string }> = {
  active: { title: "No upcoming bookings", message: "When you book a table it shows up here, ready to order ahead." },
  completed: { title: "No past visits yet", message: "Places you have dined at will be listed here." },
  cancelled: { title: "Nothing cancelled", message: "Bookings you cancel are kept here for reference." },
};

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [list, setList] = useState<ReservationList>("active");
  const [refreshing, setRefreshing] = useState(false);

  const active = useReservations("active");
  const completed = useReservations("completed");
  const cancelled = useReservations("cancelled");
  const query = list === "active" ? active : list === "completed" ? completed : cancelled;

  const items = [...(query.data ?? [])].sort((a, b) =>
    list === "active" ? a.bookingFor.localeCompare(b.bookingFor) : b.bookingFor.localeCompare(a.bookingFor),
  );

  const refresh = async () => {
    setRefreshing(true);
    await Promise.allSettled([active.refetch(), completed.refetch(), cancelled.refetch()]);
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.canvas }}>
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 14 }}>
        <Txt w="extrabold" size={26} style={{ letterSpacing: -0.4, marginBottom: 14 }}>
          My bookings
        </Txt>
        <Segmented
          value={list}
          onChange={setList}
          options={[
            { key: "active", label: "Upcoming", count: active.data?.length || undefined },
            { key: "completed", label: "Past" },
            { key: "cancelled", label: "Cancelled" },
          ]}
        />
      </View>

      <FlatList
        data={query.isLoading || query.isError ? [] : items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BookingCard booking={item} kind={list} />}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: insets.bottom + TAB_BAR_SPACE, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={palette.brand} colors={[palette.brand]} />}
        ListEmptyComponent={
          query.isLoading ? (
            <View style={{ gap: 14 }}>
              <Skeleton height={210} round={28} />
              <Skeleton height={210} round={28} />
            </View>
          ) : query.isError ? (
            <ErrorState message={errorMessage(query.error)} onRetry={() => query.refetch()} />
          ) : (
            <EmptyState
              icon="calendar-outline"
              title={EMPTY[list].title}
              message={EMPTY[list].message}
              action={list === "active" ? <Button label="Find a restaurant" onPress={() => router.navigate("/(tabs)")} /> : undefined}
            />
          )
        }
      />
    </View>
  );
}
