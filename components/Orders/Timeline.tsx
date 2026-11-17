import { Icon, type IconName } from "@/components/ui/Icon";
import React from "react";
import { View } from "react-native";

import { Txt } from "@/components/ui/Txt";
import { palette } from "@/constants/theme";
import { formatClock } from "@/lib/time";
import type { Order } from "@/types";

const STEPS: { key: string; label: string; detail: string; icon: IconName }[] = [
  { key: "placed", label: "Received", detail: "The kitchen has your order", icon: "receipt-outline" },
  { key: "served", label: "Served", detail: "Your food is at the table", icon: "restaurant-outline" },
  { key: "ready_to_pay", label: "Bill", detail: "Your waiter is bringing the bill", icon: "card-outline" },
  { key: "completed", label: "Paid", detail: "All settled. Thank you!", icon: "checkmark-done-outline" },
];

/** How far along an order is: 0 received … 3 paid. -1 when cancelled. */
export function orderProgress(status: string): number {
  if (status === "cancelled") return -1;
  const index = STEPS.findIndex((s) => s.key === status);
  return index < 0 ? 0 : index;
}

/** A one-line progress strip for order cards. */
export function TimelineStrip({ status }: { status: string }) {
  const progress = orderProgress(status);
  if (progress < 0) return null;
  return (
    <View accessibilityLabel={`Step ${progress + 1} of ${STEPS.length}: ${STEPS[progress].label}`}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {STEPS.map((step, i) => {
          const reached = i <= progress;
          return (
            <React.Fragment key={step.key}>
              <View
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: reached ? palette.pine : palette.surface,
                  borderWidth: reached ? 0 : 1.5,
                  borderColor: palette.line,
                }}
              >
                <Icon name={i < progress ? "checkmark" : step.icon} size={13} color={reached ? palette.white : palette.faint} />
              </View>
              {i < STEPS.length - 1 && (
                <View style={{ flex: 1, height: 3, marginHorizontal: 4, borderRadius: 2, backgroundColor: i < progress ? palette.pine : palette.line }} />
              )}
            </React.Fragment>
          );
        })}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
        {STEPS.map((step, i) => (
          <Txt
            key={step.key}
            w={i === progress ? "bold" : "medium"}
            size={11}
            color={i <= progress ? palette.ink : palette.faint}
            style={{ width: 62, textAlign: i === 0 ? "left" : i === STEPS.length - 1 ? "right" : "center" }}
          >
            {step.label}
          </Txt>
        ))}
      </View>
    </View>
  );
}

/** The full step-by-step view, with the time each step happened. */
export function TimelineDetail({ order }: { order: Order }) {
  const progress = orderProgress(order.status);
  const times: (string | undefined)[] = [order.createdAt, order.servedAt, undefined, order.paidAt];

  if (progress < 0) {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: palette.dangerTint, alignItems: "center", justifyContent: "center" }}>
          <Icon name="close" size={20} color={palette.danger} />
        </View>
        <View style={{ flex: 1 }}>
          <Txt w="bold" size={15}>
            Order cancelled
          </Txt>
          <Txt size={12.5} color={palette.muted}>
            Nothing will be charged for this order.
          </Txt>
        </View>
      </View>
    );
  }

  return (
    <View>
      {STEPS.map((step, i) => {
        const reached = i <= progress;
        const current = i === progress;
        const last = i === STEPS.length - 1;
        return (
          <View key={step.key} style={{ flexDirection: "row" }}>
            <View style={{ alignItems: "center", width: 40 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: reached ? palette.pine : palette.canvas,
                  borderWidth: reached ? 0 : 1.5,
                  borderColor: palette.line,
                }}
              >
                <Icon name={i < progress ? "checkmark" : step.icon} size={18} color={reached ? palette.white : palette.faint} />
              </View>
              {!last && <View style={{ width: 3, flex: 1, minHeight: 22, backgroundColor: i < progress ? palette.pine : palette.line, marginVertical: 3, borderRadius: 2 }} />}
            </View>
            <View style={{ flex: 1, marginLeft: 12, paddingBottom: last ? 0 : 16, paddingTop: 2 }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Txt w={current ? "bold" : "semibold"} size={14.5} color={reached ? palette.ink : palette.faint} style={{ flex: 1 }}>
                  {step.label}
                </Txt>
                {reached && times[i] ? (
                  <Txt size={12} color={palette.muted}>
                    {formatClock(times[i]!)}
                  </Txt>
                ) : null}
              </View>
              <Txt size={12.5} color={reached ? palette.body : palette.faint}>
                {step.detail}
              </Txt>
            </View>
          </View>
        );
      })}
    </View>
  );
}
