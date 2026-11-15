import { create } from "zustand";

/** The reservation a diner is putting together, from date to table. */
interface BookingDraft {
  restaurantId: string | null;
  /** Restaurant-local "YYYY-MM-DD". */
  date: string;
  /** Restaurant-local "HH:mm". */
  startTime: string;
  durationMinutes: number;
  guests: number;
  tableName: string | null;
  floorId: string | null;
  floorName: string;
  notes: string;
  /** Starts a draft for a restaurant, keeping nothing from a previous one. */
  begin: (restaurantId: string) => void;
  set: (patch: Partial<Omit<BookingDraft, "begin" | "set" | "reset">>) => void;
  reset: () => void;
}

const empty = {
  restaurantId: null,
  date: "",
  startTime: "",
  durationMinutes: 90,
  guests: 2,
  tableName: null,
  floorId: null,
  floorName: "",
  notes: "",
};

export const useBooking = create<BookingDraft>((set, get) => ({
  ...empty,
  begin: (restaurantId) => {
    if (get().restaurantId !== restaurantId) set({ ...empty, restaurantId });
  },
  set: (patch) => set(patch),
  reset: () => set({ ...empty }),
}));
