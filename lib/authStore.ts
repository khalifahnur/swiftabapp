import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { setItem, getItem, deleteItemAsync } from "expo-secure-store";

interface AuthState {
  isLoggedIn: boolean;
  hasCompletedOnboarding: boolean;
  logIn: () => void;
  logOut: () => void;
  completeOnboarding: () => void;
  _hasHydrated: boolean; // Add this internal flag
  setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      hasCompletedOnboarding: false,
      _hasHydrated: false, // Default to false
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      logIn: () => set({ isLoggedIn: true }),
      logOut: () => set({ isLoggedIn: false }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => ({
        setItem,
        getItem,
        removeItem: deleteItemAsync,
      })),
      // This is the magic part: it runs when storage is read
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);