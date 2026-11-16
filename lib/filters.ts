import type { Restaurant } from "@/types";

import { averagePrice, openState, priceLevel } from "./restaurant";

export type SortKey = "recommended" | "distance" | "rating" | "price";

export interface Filters {
  openNow: boolean;
  bookable: boolean;
  minRating: number;
  /** "$" … "$$$$"; empty means any. */
  prices: string[];
  amenities: string[];
  sort: SortKey;
}

export const NO_FILTERS: Filters = {
  openNow: false,
  bookable: false,
  minRating: 0,
  prices: [],
  amenities: [],
  sort: "recommended",
};

export const activeFilterCount = (f: Filters) =>
  Number(f.openNow) + Number(f.bookable) + Number(f.minRating > 0) + f.prices.length + f.amenities.length + Number(f.sort !== "recommended");

/** Narrows and orders a list of restaurants by a cuisine, free text and the filter sheet. */
export function applyFilters(
  restaurants: Restaurant[],
  options: { filters: Filters; cuisine?: string | null; text?: string; onlyIds?: Set<string> | null },
): Restaurant[] {
  const { filters, cuisine, text, onlyIds } = options;
  const needle = text?.trim().toLowerCase();

  const kept = restaurants.filter((r) => {
    if (onlyIds && !onlyIds.has(r.id)) return false;
    if (cuisine && !r.cuisines?.some((c) => c.toLowerCase() === cuisine.toLowerCase())) return false;
    if (filters.openNow && openState(r).open !== true) return false;
    if (filters.bookable && r.acceptingReservations === false) return false;
    if (filters.minRating && r.rate < filters.minRating) return false;
    if (filters.prices.length && !filters.prices.includes(priceLevel(averagePrice(r)))) return false;
    if (filters.amenities.length && !filters.amenities.every((a) => r.amenities?.includes(a))) return false;
    if (needle) {
      const haystack = [r.restaurantName, r.location, ...(r.cuisines ?? []), ...(r.amenities ?? [])].join(" ").toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
    return true;
  });

  const byDistance = (a: Restaurant, b: Restaurant) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity);
  switch (filters.sort) {
    case "distance":
      return kept.sort(byDistance);
    case "rating":
      return kept.sort((a, b) => b.rate - a.rate);
    case "price":
      return kept.sort((a, b) => (averagePrice(a) || Infinity) - (averagePrice(b) || Infinity));
    default:
      // Open places first, then the closest, then the best rated.
      return kept.sort((a, b) => {
        const open = Number(openState(b).open === true) - Number(openState(a).open === true);
        if (open) return open;
        const distance = byDistance(a, b);
        if (Number.isFinite(distance) && distance !== 0) return distance;
        return b.rate - a.rate;
      });
  }
}
