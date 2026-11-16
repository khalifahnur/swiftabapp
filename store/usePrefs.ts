import { create } from "zustand";
import { persist } from "zustand/middleware";

import { deviceStorage } from "@/lib/storage";

interface PrefsState {
  /** Order and booking updates sent by the restaurant. */
  pushEnabled: boolean;
  /** Remind before every new booking without being asked. */
  autoReminder: boolean;
  /** How long before a booking the reminder fires. */
  reminderLeadMinutes: number;
  recentSearches: string[];
  set: (patch: Partial<Pick<PrefsState, "pushEnabled" | "autoReminder" | "reminderLeadMinutes">>) => void;
  addSearch: (term: string) => void;
  clearSearches: () => void;
}

export const REMINDER_LEADS = [15, 30, 60, 120];

export const usePrefs = create<PrefsState>()(
  persist(
    (set, get) => ({
      pushEnabled: true,
      autoReminder: true,
      reminderLeadMinutes: 60,
      recentSearches: [],
      set: (patch) => set(patch),
      addSearch: (term) => {
        const clean = term.trim();
        if (clean.length < 2) return;
        const rest = get().recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase());
        set({ recentSearches: [clean, ...rest].slice(0, 8) });
      },
      clearSearches: () => set({ recentSearches: [] }),
    }),
    { name: "swiftab-prefs", storage: deviceStorage },
  ),
);
