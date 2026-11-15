import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { errorMessage } from "@/api/client";
import { orderNumber } from "@/components/Orders/OrderCard";
import PaymentSheet from "@/components/Orders/PaymentSheet";
import { TimelineDetail } from "@/components/Orders/Timeline";
import { Card, EmptyState, ErrorState, Picture, Pill, ScreenHeader, Skeleton } from "@/components/ui/Bits";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Sheet";
import { Txt } from "@/components/ui/Txt";
import { palette } from "@/constants/theme";
import { useCancelOrder, useOrders } from "@/hooks/queries";
import { formatKes, isOpenOrder, orderTone, paymentLabel } from "@/lib/format";
import { fromApi } from "@/lib/time";
import { useToast } from "@/lib/ToastContext";
import { useCart } from "@/store/useCart";

/** One order in full: live progress, what was ordered, and the receipt. */
export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const { data: orders, isLoading, isError, error, refetch, isRefetching } = useOrders();
  const cancel = useCancelOrder();
  const openCart = useCart((s) => s.open);
  const [paying, setPaying] = useState(false);
  const [asking, setAsking] = useState(false);

  const order = orders?.find((o) => o._id === id);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.canvas }}>
        <ScreenHeader title="Order" />
        <View style={{ padding: 20, gap: 14 }}>
          <Skeleton height={90} round={20} />
          <Skeleton height={230} round={20} />
          <Skeleton height={160} round={20} />
        </View>
      </View>
    );
  }
  if (isError && !orders) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.canvas }}>
        <ScreenHeader title="Order" />
        <ErrorState message={errorMessage(error)} onRetry={() => refetch()} />
      </View>
    );
  }
  if (!order) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.canvas }}>
        <ScreenHeader title="Order" />
        <EmptyState
          icon="receipt-outline"
          title="Order not found"
          message="It may belong to another account, or has been removed."
          action={<Button label="See my orders" onPress={() => router.replace("/Order")} />}
        />
      </View>
    );
  }

  const tone = orderTone(order.status);
  const open = isOpenOrder(order.status);
  const lines = order.menu ?? [];

  const orderMore = () => {
    if (!order.reservationId) return;
    openCart({
      restaurantId: order.restaurantId,
      restaurantName: order.restaurantName,
      reservationId: order.reservationId,
      tableNumber: order.tableNumber,
    });
    router.push({ pathname: "/modal", params: { restaurantId: order.restaurantId } });
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.canvas }}>
      <ScreenHeader title={`Order ${orderNumber(order)}`} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: insets.bottom + 32, gap: 14 }}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} tintColor={palette.brand} colors={[palette.brand]} />}
      >
        <Card style={{ flexDirection: "row", alignItems: "center" }}>
          <Picture uri={order.restaurantImage} style={{ width: 56, height: 56, borderRadius: 16 }} />
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Txt w="bold" size={16} numberOfLines={1}>
              {order.restaurantName}
            </Txt>
            <Txt size={12.5} color={palette.muted} numberOfLines={1}>
              Table {order.tableNumber} · {fromApi(order.createdAt).format("ddd, D MMM · h:mm A")}
            </Txt>
          </View>
          <Pill label={tone.label} fg={tone.fg} bg={tone.bg} />
        </Card>

        <Card>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
            <Txt w="bold" size={16} style={{ flex: 1 }}>
              Order progress
            </Txt>
            {open && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: palette.success }} />
                <Txt w="semibold" size={12} color={palette.success}>
                  Live
                </Txt>
              </View>
            )}
          </View>
          <TimelineDetail order={order} />
          {order.takenBy ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderColor: palette.line }}>
              <Ionicons name="person-circle-outline" size={18} color={palette.muted} />
              <Txt size={13} color={palette.body}>
                Served by {order.takenBy}
              </Txt>
            </View>
          ) : null}
        </Card>

        <Card>
          <Txt w="bold" size={16} style={{ marginBottom: 10 }}>
            Your order
          </Txt>
          {lines.map((line, index) => (
            <View key={`${line._id}-${index}`} style={{ flexDirection: "row", paddingVertical: 8, borderTopWidth: index === 0 ? 0 : 1, borderColor: palette.line }}>
              <Txt w="bold" size={13.5} color={palette.brandDark} style={{ width: 32 }}>
                {line.quantity}×
              </Txt>
              <View style={{ flex: 1 }}>
                <Txt w="medium" size={13.5}>
                  {line.name}
                </Txt>
                {line.note ? (
                  <Txt size={12} color={palette.muted}>
                    Note: {line.note}
                  </Txt>
                ) : null}
              </View>
              <Txt w="medium" size={13.5}>
                {formatKes(line.cost * line.quantity)}
              </Txt>
            </View>
          ))}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10, paddingTop: 12, borderTopWidth: 1, borderColor: palette.line }}>
            <Txt w="bold" size={15}>
              Total
            </Txt>
            <Txt w="extrabold" size={17} testID="order-total">
              {formatKes(order.totalAmount)}
            </Txt>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
            <Txt size={13} color={palette.muted}>
              Payment
            </Txt>
            <Txt w="semibold" size={13} color={order.status === "completed" ? palette.success : palette.body}>
              {order.status === "completed"
                ? `Paid${order.paymentMethod ? ` · ${paymentLabel(order.paymentMethod)}` : ""}`
                : order.paymentMethod
                  ? `${paymentLabel(order.paymentMethod)} · awaiting payment`
                  : "Not paid yet"}
            </Txt>
          </View>
        </Card>

        <View style={{ gap: 10 }}>
          {order.status === "served" && <Button label="Request the bill" icon="wallet-outline" onPress={() => setPaying(true)} testID="detail-request-bill" />}
          {open && order.reservationId ? <Button label="Order more" variant="soft" icon="add-circle-outline" onPress={orderMore} /> : null}
          {order.status === "placed" && <Button label="Cancel order" variant="danger" onPress={() => setAsking(true)} testID="detail-cancel" />}
          {order.status === "completed" && (
            <Button
              label="Rate your visit"
              variant="soft"
              icon="star-outline"
              onPress={() =>
                router.push({ pathname: "/screens/ratescreen", params: { restaurantId: order.restaurantId, restaurantName: order.restaurantName } })
              }
            />
          )}
        </View>
      </ScrollView>

      <PaymentSheet order={paying ? order : null} onClose={() => setPaying(false)} />
      <ConfirmDialog
        visible={asking}
        title="Cancel this order?"
        message="The kitchen will be told to stop. You can only cancel before the food is served."
        confirmLabel="Cancel order"
        destructive
        busy={cancel.isPending}
        onConfirm={() =>
          cancel.mutate(order._id, {
            onSuccess: () => {
              setAsking(false);
              showToast("success", "Order cancelled.");
            },
            onError: (err) => {
              setAsking(false);
              showToast("error", errorMessage(err, "This order can no longer be cancelled."));
            },
          })
        }
        onCancel={() => setAsking(false)}
      />
    </View>
  );
}
