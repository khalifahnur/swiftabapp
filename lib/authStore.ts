import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { secureStorage } from "./storage";

export interface SessionUser {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
}

interface AuthState {
  isLoggedIn: boolean;
  hasCompletedOnboarding: boolean;
  token: string | null;
  user: SessionUser | null;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  /** Starts a session from a sign-in response. */
  signIn: (session: { token?: string | null; user: SessionUser }) => void;
  setUser: (user: SessionUser) => void;
  logOut: () => void;
  completeOnboarding: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      hasCompletedOnboarding: false,
      token: null,
      user: null,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      signIn: ({ token, user }) => set({ isLoggedIn: true, token: token ?? null, user }),
      setUser: (user) => set({ user }),
      logOut: () => set({ isLoggedIn: false, token: null, user: null }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
    }),
    {
      name: "auth-storage",
      storage: secureStorage,
      partialize: ({ isLoggedIn, hasCompletedOnboarding, token, user }) => ({
        isLoggedIn,
        hasCompletedOnboarding,
        token,
        user,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (state.isLoggedIn && !state.user) {
          // Signed in on a build that kept the profile in AsyncStorage.
          migrateLegacySession().finally(() => state.setHasHydrated(true));
        } else {
          state.setHasHydrated(true);
        }
      },
    },
  ),
);

/**
 * Earlier builds stored the sign-in response under "userObj". Carry the
 * profile over so nobody is signed out by the update; if it is missing or
 * unreadable the person signs in again.
 */
async function migrateLegacySession(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem("userObj");
    const legacy = raw ? JSON.parse(raw) : null;
    const user = legacy?.user;
    if (user?.userId) {
      useAuthStore.setState({
        user: {
          userId: String(user.userId),
          name: user.name ?? "",
          email: user.email ?? "",
          phoneNumber: user.phoneNumber ?? "",
        },
        // Tokens from those builds are not accepted by the current API; the
        // next sign-in issues a new one.
        token: null,
      });
    } else {
      useAuthStore.setState({ isLoggedIn: false });
    }
    await AsyncStorage.removeItem("userObj");
  } catch {
    useAuthStore.setState({ isLoggedIn: false });
  }
}

/** The signed-in diner, or null. */
export const useUser = () => useAuthStore((s) => s.user);
