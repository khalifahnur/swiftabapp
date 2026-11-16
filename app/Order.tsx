import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { errorMessage } from "@/api/client";
import OrderCard from "@/components/Orders/OrderCard";
import PaymentSheet from "@/components/Orders/PaymentSheet";
import { EmptyState, ErrorState, ScreenHeader, Segmented, Skeleton } from "@/components/ui/Bits";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Sheet";
import { palette } from "@/constants/theme";
import { useCancelOrder, useOrders } from "@/hooks/queries";
import { isOpenOrder } from "@/lib/format";
import { useToast } from "@/lib/ToastContext";
import type { Order } from "@/types";

type Tab = "active" | "history";

export default function OrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { data: orders, isLoading, isError, error, refetch } = useOrders();
  const cancel = useCancelOrder();

  const [tab, setTab] = useState<Tab>("active");
  const [refreshing, setRefreshing] = useState(false);
  const [paying, setPaying] = useState<Order | null>(null);
  const [cancelling, setCancelling] = useState<Order | null>(null);

  const active = (orders ?? []).filter((o) => isOpenOrder(o.status));
  const history = (orders ?? []).filter((o) => !isOpenOrder(o.status));
  const shown = tab === "active" ? active : history;

  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const confirmCancel = () => {
    if (!cancelling) return;
    cancel.mutate(cancelling._id, {
      onSuccess: () => {
        setCancelling(null);
        showToast("success", "Order cancelled.");
      },
      onError: (err) => {
        setCancelling(null);
        showToast("error", errorMessage(err, "This order can no longer be cancelled."));
      },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.canvas }}>
      <ScreenHeader title="My orders" />
      <View style={{ paddingHorizontal: 20, paddingBottom: 14 }}>
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { key: "active", label: "In progress", count: active.length || undefined },
            { key: "history", label: "History" },
          ]}
        />
      </View>

      <FlatList
        testID="orders-list"
        data={isLoading || isError ? [] : shown}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <OrderCard order={item} onPay={setPaying} onCancel={setCancelling} />}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 2, paddingBottom: insets.bottom + 32, flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={palette.brand} colors={[palette.brand]} />}
        ListEmptyComponent={
          isLoading ? (
            <View style={{ gap: 14 }}>
              <Skeleton height={230} round={28} />
              <Skeleton height={230} round={28} />
            </View>
          ) : isError ? (
            <ErrorState message={errorMessage(error)} onRetry={() => refetch()} />
          ) : tab === "active" ? (
            <EmptyState
              icon="receipt-outline"
              title="Nothing cooking right now"
              message="Order from one of your bookings and follow it here from kitchen to table."
              action={<Button label="Go to my bookings" onPress={() => router.navigate("/(tabs)/bookings")} />}
            />
          ) : (
            <EmptyState icon="time-outline" title="No past orders" message="Orders you have paid for or cancelled are kept here." />
          )
        }
      />

      <PaymentSheet order={paying} onClose={() => setPaying(null)} />
      <ConfirmDialog
        visible={Boolean(cancelling)}
        title="Cancel this order?"
        message="The kitchen will be told to stop. You can only cancel before the food is served."
        confirmLabel="Cancel order"
        destructive
        busy={cancel.isPending}
        onConfirm={confirmCancel}
        onCancel={() => setCancelling(null)}
      />
    </View>
  );
}
