import { create } from "zustand";
import { persist } from "zustand/middleware";

import { deviceStorage } from "@/lib/storage";
import type { Restaurant } from "@/types";

/** Enough of a restaurant to show a saved card without a network call. */
export interface SavedRestaurant {
  id: string;
  restaurantName: string;
  image: string;
  location: string;
  rate: number;
  cuisines?: string[];
}

interface WishlistState {
  saved: SavedRestaurant[];
  toggle: (restaurant: Restaurant | SavedRestaurant) => boolean;
  remove: (id: string) => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      saved: [],
      toggle: (restaurant) => {
        const exists = get().saved.some((r) => r.id === restaurant.id);
        if (exists) {
          set({ saved: get().saved.filter((r) => r.id !== restaurant.id) });
          return false;
        }
        const { id, restaurantName, image, location, rate, cuisines } = restaurant;
        set({ saved: [{ id, restaurantName, image, location, rate, cuisines }, ...get().saved] });
        return true;
      },
      remove: (id) => set({ saved: get().saved.filter((r) => r.id !== id) }),
    }),
    { name: "swiftab-wishlist", storage: deviceStorage },
  ),
);

export const useIsSaved = (id: string | undefined) => useWishlist((s) => s.saved.some((r) => r.id === id));
