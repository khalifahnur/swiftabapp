import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

import { orderTone } from "@/lib/format";
import { wasOwnChange } from "@/lib/ownChanges";
import { toast } from "@/lib/ToastContext";
import { useInbox } from "@/store/useInbox";

import { useOrders } from "./queries";

const MESSAGES: Record<string, (restaurant: string) => { title: string; body: string }> = {
  served: (r) => ({ title: "Your order is served", body: `Enjoy your meal at ${r}.` }),
  ready_to_pay: (r) => ({ title: "Bill requested", body: `${r} is bringing your bill.` }),
  completed: (r) => ({ title: "Payment received", body: `Thanks for dining at ${r}.` }),
  cancelled: (r) => ({ title: "Order cancelled", body: `Your order at ${r} was cancelled.` }),
};

/**
 * Watches the diner's orders while the app is open and announces each change
 * of status (served, paid, cancelled) with a toast and an inbox entry, so
 * progress is visible even where push notifications are switched off.
 */
export function useOrderWatcher() {
  const router = useRouter();
  const { data: orders } = useOrders();
  const known = useRef<Map<string, string> | null>(null);

  useEffect(() => {
    if (!orders) return;
    const previous = known.current;
    const next = new Map(orders.map((o) => [o._id, o.status]));
    known.current = next;
    // The first load only records where things stand.
    if (!previous) return;

    for (const order of orders) {
      const before = previous.get(order._id);
      if (!before || before === order.status) continue;
      if (wasOwnChange(order._id, order.status)) continue;
      const message = MESSAGES[order.status]?.(order.restaurantName || "the restaurant");
      if (!message) continue;
      useInbox.getState().add({
        id: `order-${order._id}-${order.status}`,
        title: message.title,
        body: message.body,
        kind: "order",
        orderId: order._id,
      });
      toast.show(order.status === "cancelled" ? "error" : "success", `${orderTone(order.status).label}: ${message.body}`, {
        actionLabel: "View",
        onAction: () => router.push({ pathname: "/screens/order", params: { id: order._id } }),
      });
    }
  }, [orders, router]);
}
