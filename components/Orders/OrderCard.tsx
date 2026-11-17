import { pushOnce } from "@/lib/nav";
import { Icon } from "@/components/ui/Icon";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

import { Picture, Pill } from "@/components/ui/Bits";
import { Tap } from "@/components/ui/Tap";
import { Button } from "@/components/ui/Button";
import { Txt } from "@/components/ui/Txt";
import { palette, radius, shadow } from "@/constants/theme";
import { formatKes, isOpenOrder, orderTone, paymentLabel } from "@/lib/format";
import { fromApi } from "@/lib/time";
import type { Order } from "@/types";

import { TimelineStrip } from "./Timeline";

export const orderNumber = (order: Order) => order.orderId || `#${order._id.slice(-6).toUpperCase()}`;

/** One order in the list: where it stands, what was ordered and the next thing to do. */
export default function OrderCard({ order, onPay, onCancel }: { order: Order; onPay: (order: Order) => void; onCancel: (order: Order) => void }) {
  const router = useRouter();
  const tone = orderTone(order.status);
  const open = isOpenOrder(order.status);
  const lines = order.menu ?? [];
  const itemCount = lines.reduce((sum, line) => sum + (line.quantity || 1), 0);

  return (
    <Tap
      testID={`order-${order._id}`}
      accessibilityRole="button"
      accessibilityLabel={`Order at ${order.restaurantName}, ${tone.label}`}
      onPress={() => pushOnce(router, { pathname: "/screens/order", params: { id: order._id } })}
      pressedStyle={{ opacity: 0.94 }}
      style={[shadow.card, { backgroundColor: palette.surface, borderRadius: radius.xl, padding: 16 }]}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Picture uri={order.restaurantImage} style={{ width: 48, height: 48, borderRadius: 14 }} />
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <Txt w="bold" size={15.5} numberOfLines={1}>
            {order.restaurantName || "Restaurant"}
          </Txt>
          <Txt size={12.5} color={palette.muted} numberOfLines={1}>
            Table {order.tableNumber} · {orderNumber(order)} · {fromApi(order.createdAt).format("D MMM, h:mm A")}
          </Txt>
        </View>
        <Pill label={tone.label} fg={tone.fg} bg={tone.bg} />
      </View>

      {open && (
        <View style={{ marginTop: 16 }}>
          <TimelineStrip status={order.status} />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 7, marginTop: 10 }}>
            <Icon name="pulse-outline" size={14} color={palette.brand} />
            <Txt size={12.5} color={palette.body} style={{ flex: 1 }}>
              {tone.hint}
            </Txt>
          </View>
        </View>
      )}

      <View style={{ marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderColor: palette.line, gap: 5 }}>
        {lines.slice(0, 3).map((line, index) => (
          <View key={`${line._id}-${index}`} style={{ flexDirection: "row" }}>
            <Txt w="semibold" size={13} color={palette.brandDark} style={{ width: 28 }}>
              {line.quantity}×
            </Txt>
            <Txt size={13} color={palette.body} numberOfLines={1} style={{ flex: 1 }}>
              {line.name}
            </Txt>
            <Txt size={13} color={palette.body}>
              {formatKes(line.cost * line.quantity)}
            </Txt>
          </View>
        ))}
        {lines.length > 3 && (
          <Txt size={12.5} color={palette.muted}>
            +{lines.length - 3} more
          </Txt>
        )}
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
        <View style={{ flex: 1 }}>
          <Txt size={12} color={palette.muted}>
            {itemCount} {itemCount === 1 ? "item" : "items"}
            {order.paymentMethod ? ` · ${paymentLabel(order.paymentMethod)}` : ""}
          </Txt>
          <Txt w="extrabold" size={17}>
            {formatKes(order.totalAmount)}
          </Txt>
        </View>
        {order.status === "served" && <Button label="Request bill" size="md" icon="wallet-outline" onPress={() => onPay(order)} testID={`pay-order-${order._id}`} />}
        {order.status === "placed" && <Button label="Cancel" size="md" variant="danger" onPress={() => onCancel(order)} testID={`cancel-order-${order._id}`} />}
        {!open && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <Txt w="semibold" size={13} color={palette.brandDark}>
              Receipt
            </Txt>
            <Icon name="chevron-forward" size={14} color={palette.brandDark} />
          </View>
        )}
      </View>
    </Tap>
  );
}
