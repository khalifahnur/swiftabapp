import { pushOnce } from "@/lib/nav";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import NetInfo from "@react-native-community/netinfo";
import { focusManager, onlineManager, QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { AppState, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { setSessionExpiredHandler } from "@/api/client";
import AnimatedSplash from "@/components/AnimatedSplash";
import NetworkStatus from "@/components/NetworkStatus";
import { palette } from "@/constants/theme";
import { useOrderWatcher } from "@/hooks/useOrderWatcher";
import { useAuthStore } from "@/lib/authStore";
import { listenForNotifications, NotificationTarget, registerForPush } from "@/lib/notifications";
import { toast, ToastProvider } from "@/lib/ToastContext";
import { usePrefs } from "@/store/usePrefs";

import "../global.css";

SplashScreen.preventAutoHideAsync().catch(() => undefined);

// Refetch when the app comes back to the foreground or the network returns.
focusManager.setEventListener((setFocused) => {
  const subscription = AppState.addEventListener("change", (state) => {
    if (Platform.OS !== "web") setFocused(state === "active");
  });
  return () => subscription.remove();
});
onlineManager.setEventListener((setOnline) =>
  NetInfo.addEventListener((state) => setOnline(state.isConnected !== false)),
);

/** Work that only makes sense for a signed-in diner: push, deep links, live order updates. */
function SignedInServices() {
  const router = useRouter();
  const client = useQueryClient();
  const userId = useAuthStore((s) => s.user?.userId);
  const pushEnabled = usePrefs((s) => s.pushEnabled);

  useOrderWatcher();

  useEffect(() => {
    if (userId && pushEnabled) registerForPush(userId);
  }, [userId, pushEnabled]);

  useEffect(() => {
    const refresh = (target: NotificationTarget) => {
      if (target.type === "order" || target.type === "tab") client.invalidateQueries({ queryKey: ["orders"] });
      if (target.type === "tab") client.invalidateQueries({ queryKey: ["tab"] });
      if (target.type === "reservation") client.invalidateQueries({ queryKey: ["reservations"] });
    };
    return listenForNotifications({
      onReceive: refresh,
      onOpen: (target) => {
        refresh(target);
        if ((target.type === "order" || target.type === "tab") && target.orderId) {
          pushOnce(router, { pathname: "/screens/order", params: { id: target.orderId } });
        } else if (target.type === "order") {
          pushOnce(router, "/Order");
        } else if (target.type === "reservation" || target.type === "reminder") {
          pushOnce(router, "/(tabs)/bookings");
        }
      },
    });
  }, [client, router]);

  return null;
}

export default function RootLayout() {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, staleTime: 30 * 1000, gcTime: 30 * 60 * 1000 },
          mutations: { retry: 0 },
        },
      }),
  );
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const hasCompletedOnboarding = useAuthStore((s) => s.hasCompletedOnboarding);
  const hydrated = useAuthStore((s) => s._hasHydrated);

  const [fontsLoaded, fontError] = useFonts({
    "Jakarta-Regular": PlusJakartaSans_400Regular,
    "Jakarta-Medium": PlusJakartaSans_500Medium,
    "Jakarta-SemiBold": PlusJakartaSans_600SemiBold,
    "Jakarta-Bold": PlusJakartaSans_700Bold,
    "Jakarta-ExtraBold": PlusJakartaSans_800ExtraBold,
  });
  const ready = hydrated && (fontsLoaded || Boolean(fontError));

  // When the API no longer accepts the session, return to sign-in once.
  useEffect(() => {
    setSessionExpiredHandler(() => {
      if (!useAuthStore.getState().isLoggedIn) return;
      useAuthStore.getState().logOut();
      client.clear();
      toast.info("Your session has ended. Please sign in again.");
    });
    return () => setSessionExpiredHandler(null);
  }, [client]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: palette.canvas }}>
      <SafeAreaProvider>
        <QueryClientProvider client={client}>
          {ready && (
          <ToastProvider>
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.canvas } }}>
              <Stack.Protected guard={!hasCompletedOnboarding}>
                <Stack.Screen name="OnboardScreen" options={{ animation: "fade" }} />
              </Stack.Protected>
              <Stack.Protected guard={isLoggedIn && hasCompletedOnboarding}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="screens" />
                <Stack.Screen name="modal" options={{ presentation: "modal", animation: "slide_from_bottom" }} />
                <Stack.Screen name="Order" />
              </Stack.Protected>
              <Stack.Protected guard={!isLoggedIn && hasCompletedOnboarding}>
                <Stack.Screen name="(auth)" options={{ animation: "fade" }} />
              </Stack.Protected>
            </Stack>
            {isLoggedIn && <SignedInServices />}
            <NetworkStatus />
            <StatusBar style="dark" />
          </ToastProvider>
          )}
          {/* Hides the system splash itself, then animates away once the app is ready underneath. */}
          <AnimatedSplash ready={ready} />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
