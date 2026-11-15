import type { OpeningHour } from "@/types";

import { nowInBusinessTz } from "./time";

const toMinutes = (clock: string) => {
  const [h, m] = clock.split(":").map(Number);
  return h * 60 + (m || 0);
};
const toClock = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

export const SLOT_STEP = 30;
/** The latest a table can be taken before closing. */
const LAST_SEATING = 60;
/** How soon from now a table can be booked. */
const LEAD = 15;

/**
 * Start times a diner can pick on a date: every half hour the restaurant is
 * open, up to an hour before closing, and not in the past. `hours` is that
 * weekday's entry, or undefined when the restaurant has not published hours.
 */
export function slotsFor(date: string, hours: OpeningHour | undefined, hasPublishedHours: boolean): string[] {
  if (!date) return [];
  let from = 8 * 60;
  let to = 22 * 60;
  if (hasPublishedHours) {
    if (!hours?.open) return [];
    from = toMinutes(hours.from);
    to = toMinutes(hours.to);
    // Open past midnight: offer seatings up to the end of the day.
    if (to <= from) to = 24 * 60 + LAST_SEATING;
  }
  const last = Math.min(to - LAST_SEATING, 24 * 60 - SLOT_STEP);

  const now = nowInBusinessTz();
  const earliest = date === now.format("YYYY-MM-DD") ? now.hours() * 60 + now.minutes() + LEAD : 0;

  const slots: string[] = [];
  for (let m = Math.ceil(from / SLOT_STEP) * SLOT_STEP; m <= last; m += SLOT_STEP) {
    if (m >= earliest) slots.push(toClock(m));
  }
  return slots;
}

export function partOfDay(clock: string): "Morning" | "Afternoon" | "Evening" {
  const minutes = toMinutes(clock);
  if (minutes < 12 * 60) return "Morning";
  if (minutes < 17 * 60) return "Afternoon";
  return "Evening";
}

export const DURATIONS = [
  { minutes: 60, label: "1 h" },
  { minutes: 90, label: "1.5 h" },
  { minutes: 120, label: "2 h" },
  { minutes: 180, label: "3 h" },
];
