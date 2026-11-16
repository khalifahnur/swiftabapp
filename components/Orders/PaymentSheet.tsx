import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

import { errorMessage } from "@/api/client";
import { Button, tapFeedback } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { Txt } from "@/components/ui/Txt";
import { palette, radius } from "@/constants/theme";
import { useRequestBill, useRestaurant } from "@/hooks/queries";
import { formatKes, PAYMENT_METHODS } from "@/lib/format";
import { useToast } from "@/lib/ToastContext";
import type { Order, PaymentMethod } from "@/types";

/** Asks how the diner wants to pay, then tells the restaurant to bring the bill. */
export default function PaymentSheet({ order, onClose }: { order: Order | null; onClose: () => void }) {
  const { showToast } = useToast();
  const request = useRequestBill();
  const { data: restaurant } = useRestaurant(order?.restaurantId);
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const [problem, setProblem] = useState("");

  useEffect(() => {
    if (order) {
      setMethod(null);
      setProblem("");
    }
  }, [order]);

  // Offer only what the restaurant accepts, when it has said.
  const accepted = restaurant?.paymentMethods?.length ? restaurant.paymentMethods : null;
  const methods = PAYMENT_METHODS.filter((m) => !accepted || accepted.includes(m.key));
  const options = methods.length ? methods : PAYMENT_METHODS;

  const submit = () => {
    if (!order || !method) return;
    setProblem("");
    request.mutate(
      { orderId: order._id, paymentMethod: method },
      {
        onSuccess: () => {
          onClose();
          showToast("success", "Bill requested. Your waiter is on the way.");
        },
        // Shown in the sheet: a toast would sit behind it.
        onError: (error) => setProblem(errorMessage(error, "We could not request the bill. Please try again.")),
      },
    );
  };

  return (
    <Sheet
      visible={Boolean(order)}
      onClose={onClose}
      dismissable={!request.isPending}
      title="How would you like to pay?"
      subtitle={order ? `${order.restaurantName} · Table ${order.tableNumber} · ${formatKes(order.totalAmount)}` : undefined}
      footer={
        <Button
          label={method ? "Request the bill" : "Choose a payment method"}
          disabled={!method}
          loading={request.isPending}
          onPress={submit}
          testID="request-bill"
        />
      }
    >
      <View style={{ gap: 10 }}>
        {options.map((option) => {
          const selected = method === option.key;
          return (
            <Pressable
              key={option.key}
              testID={`pay-${option.key}`}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              aria-checked={selected}
              accessibilityLabel={option.label}
              onPress={() => {
                tapFeedback();
                setMethod(option.key);
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 14,
                borderRadius: radius.lg,
                borderWidth: 1.5,
                borderColor: selected ? palette.pine : palette.line,
                backgroundColor: selected ? palette.brandTint : palette.surface,
              }}
            >
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: `${option.color}1F`, alignItems: "center", justifyContent: "center" }}>
                <Ionicons name={option.icon as keyof typeof Ionicons.glyphMap} size={20} color={option.color} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Txt w="bold" size={15}>
                  {option.label}
                </Txt>
                <Txt size={12.5} color={palette.muted}>
                  {option.hint}
                </Txt>
              </View>
              <Ionicons name={selected ? "radio-button-on" : "radio-button-off"} size={22} color={selected ? palette.pine : palette.faint} />
            </Pressable>
          );
        })}
      </View>
      {problem ? (
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center", marginTop: 12, padding: 12, borderRadius: radius.md, backgroundColor: palette.dangerTint }}>
          <Ionicons name="alert-circle" size={18} color={palette.danger} />
          <Txt size={12.5} color={palette.danger} style={{ flex: 1 }}>
            {problem}
          </Txt>
        </View>
      ) : null}
      <Txt size={12} color={palette.muted} style={{ marginTop: 14 }}>
        You pay at the table. Your waiter confirms the payment and the order is marked as paid.
      </Txt>
    </Sheet>
  );
}
