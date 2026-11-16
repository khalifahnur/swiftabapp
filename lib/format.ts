import type { OrderStatus, PaymentMethod, ReservationStatus } from "@/types";

import { palette } from "@/constants/theme";

export function formatKes(amount: number | undefined | null): string {
  const value = Math.round(Number(amount) || 0);
  return `KES ${value.toLocaleString("en-KE")}`;
}

export const initials = (name: string | undefined) =>
  (name ?? "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "?";

export const firstName = (name: string | undefined) => (name ?? "").trim().split(/\s+/)[0] || "there";

export const titleCase = (text: string) =>
  text.replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

interface Tone {
  label: string;
  fg: string;
  bg: string;
}

export const ORDER_STATUS: Record<OrderStatus, Tone & { hint: string }> = {
  placed: {
    label: "Preparing",
    fg: "#B26A00",
    bg: palette.amberTint,
    hint: "The kitchen has your order.",
  },
  served: {
    label: "Served",
    fg: palette.info,
    bg: palette.infoTint,
    hint: "Enjoy your meal. Ask for the bill when you are ready.",
  },
  ready_to_pay: {
    label: "Bill requested",
    fg: "#6D4BC3",
    bg: "#EFEAFB",
    hint: "Your waiter is bringing the bill.",
  },
  completed: {
    label: "Paid",
    fg: palette.success,
    bg: palette.successTint,
    hint: "Thank you for dining with us.",
  },
  cancelled: {
    label: "Cancelled",
    fg: palette.danger,
    bg: palette.dangerTint,
    hint: "This order was cancelled.",
  },
};

export const orderTone = (status: string): Tone & { hint: string } =>
  ORDER_STATUS[status as OrderStatus] ?? {
    label: titleCase(status || "Unknown"),
    fg: palette.body,
    bg: palette.line,
    hint: "",
  };

export const isOpenOrder = (status: string) =>
  status === "placed" || status === "served" || status === "ready_to_pay";

export const RESERVATION_STATUS: Record<ReservationStatus, Tone> = {
  active: { label: "Confirmed", fg: palette.brandDark, bg: palette.brandTint },
  seated: { label: "Seated", fg: palette.info, bg: palette.infoTint },
  completed: { label: "Completed", fg: palette.success, bg: palette.successTint },
  cancelled: { label: "Cancelled", fg: palette.danger, bg: palette.dangerTint },
  no_show: { label: "Missed", fg: "#B26A00", bg: palette.amberTint },
};

export const reservationTone = (status: string): Tone =>
  RESERVATION_STATUS[status as ReservationStatus] ?? {
    label: titleCase(status || "Unknown"),
    fg: palette.body,
    bg: palette.line,
  };

export const PAYMENT_METHODS: { key: PaymentMethod; label: string; hint: string; icon: string; color: string }[] = [
  { key: "mpesa", label: "M-Pesa", hint: "Pay from your phone", icon: "phone-portrait-outline", color: "#1E9E6A" },
  { key: "card", label: "Card", hint: "Visa or Mastercard at the table", icon: "card-outline", color: "#2A78D6" },
  { key: "cash", label: "Cash", hint: "Pay your waiter directly", icon: "cash-outline", color: "#B26A00" },
  { key: "airtel_money", label: "Airtel Money", hint: "Pay from your phone", icon: "phone-portrait-outline", color: "#D64545" },
];

export const paymentLabel = (method: string | undefined | null) =>
  PAYMENT_METHODS.find((m) => m.key === method)?.label ?? (method ? titleCase(method) : "");
