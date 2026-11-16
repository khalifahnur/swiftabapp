import type { OpeningHour, Restaurant, RestaurantDoc, Review } from "@/types";

import { nowInBusinessTz, prettyClock } from "./time";

/** Turns the API's wrapped documents into one flat object per restaurant. */
export function flattenRestaurants(docs: RestaurantDoc[] | null | undefined): Restaurant[] {
  if (!Array.isArray(docs)) return [];
  const out: Restaurant[] = [];
  for (const doc of docs) {
    const data = doc?.data?.[0];
    if (!doc?._id || !data) continue;
    out.push({
      ...data,
      id: doc._id,
      distanceKm: doc.distanceKm,
      latitude: Number(data.latitude) || 0,
      longitude: Number(data.longitude) || 0,
      rate: Number(data.rate) || 0,
      about: data.about ?? [],
      menu: data.menu ?? {},
      review: flattenReviews(data.review),
    });
  }
  return out;
}

/** Reviews were once stored in nested groups; accept both shapes. */
function flattenReviews(raw: unknown): Review[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .flatMap((entry: any) => (Array.isArray(entry?.review) ? entry.review : [entry]))
    .filter((r: any) => r && (r.reviewTxt || r.rating));
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const minutes = (clock: string) => {
  const [h, m] = clock.split(":").map(Number);
  return h * 60 + (m || 0);
};

export function hoursFor(hours: OpeningHour[] | undefined, dayName: string): OpeningHour | undefined {
  return hours?.find((h) => h.day?.toLowerCase() === dayName.toLowerCase());
}

export interface OpenState {
  /** Null when the restaurant has not published its hours. */
  open: boolean | null;
  label: string;
}

/** Whether the restaurant is open right now, with a short explanation. */
export function openState(restaurant: Pick<Restaurant, "openingHours">): OpenState {
  const hours = restaurant.openingHours;
  if (!hours?.some((h) => h.open)) return { open: null, label: "" };

  const now = nowInBusinessTz();
  const nowMin = now.hours() * 60 + now.minutes();
  const today = hoursFor(hours, DAYS[now.day()]);
  const yesterday = hoursFor(hours, DAYS[(now.day() + 6) % 7]);

  // A late night that runs past midnight still counts as open.
  if (yesterday?.open && minutes(yesterday.to) < minutes(yesterday.from) && nowMin < minutes(yesterday.to)) {
    return { open: true, label: `Open until ${prettyClock(yesterday.to)}` };
  }
  if (today?.open) {
    const from = minutes(today.from);
    const to = minutes(today.to);
    const overnight = to <= from;
    if (nowMin >= from && (overnight || nowMin < to)) {
      return { open: true, label: `Open until ${prettyClock(today.to)}` };
    }
    if (nowMin < from) return { open: false, label: `Opens ${prettyClock(today.from)}` };
  }
  for (let i = 1; i <= 7; i++) {
    const next = hoursFor(hours, DAYS[(now.day() + i) % 7]);
    if (next?.open) {
      const when = i === 1 ? "tomorrow" : next.day.slice(0, 3);
      return { open: false, label: `Opens ${when} ${prettyClock(next.from)}` };
    }
  }
  return { open: false, label: "Closed" };
}

/** Opening hours for a calendar date ("YYYY-MM-DD"), or undefined if unknown. */
export function hoursOnDate(hours: OpeningHour[] | undefined, date: string): OpeningHour | undefined {
  if (!hours?.length) return undefined;
  const [y, m, d] = date.split("-").map(Number);
  const day = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return hoursFor(hours, DAYS[day]);
}

export function todayHoursLabel(restaurant: Pick<Restaurant, "openingHours" | "about">): string {
  const today = hoursFor(restaurant.openingHours, DAYS[nowInBusinessTz().day()]);
  if (today?.open) return `${prettyClock(today.from)} – ${prettyClock(today.to)}`;
  if (today && restaurant.openingHours?.some((h) => h.open)) return "Closed today";
  return restaurant.about?.[0]?.hrsOfOperation ?? "";
}

export const averagePrice = (restaurant: Pick<Restaurant, "about">) =>
  Number(restaurant.about?.[0]?.averagePrice) || 0;

/** "$" to "$$$$" from the average spend per person in shillings. */
export function priceLevel(price: number): string {
  if (!price) return "";
  if (price < 800) return "$";
  if (price < 2000) return "$$";
  if (price < 4500) return "$$$";
  return "$$$$";
}

export function distanceLabel(km?: number): string {
  if (km === undefined || km === null || Number.isNaN(km)) return "";
  return km < 1 ? `${Math.max(50, Math.round(km * 20) * 50)} m` : `${km.toFixed(km < 10 ? 1 : 0)} km`;
}

export function haversineKm(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) {
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude);
  const dLng = rad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/** Every cuisine offered across a list of restaurants, most common first. */
export function cuisinesOf(restaurants: Restaurant[]): string[] {
  const count = new Map<string, number>();
  restaurants.forEach((r) => r.cuisines?.forEach((c) => count.set(c, (count.get(c) ?? 0) + 1)));
  return [...count.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name);
}

export const hasCoordinates = (r: { latitude?: number; longitude?: number }) =>
  Boolean(r.latitude && r.longitude);
