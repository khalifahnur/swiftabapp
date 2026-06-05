import NetworkStatus from "@/components/NetworkStatus";
import { color } from "@/constants/Colors";
import { useAppPermissions } from "@/hooks/usePermissionHook";
import { useAuthStore } from "@/lib/authStore";
import { Store } from "@/redux/store/Store";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { Provider } from "react-redux";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [client] = useState(() => new QueryClient());
  const { isLoggedIn, hasCompletedOnboarding, _hasHydrated } = useAuthStore();
  const insets = useSafeAreaInsets();
  const [fontsLoaded, fontError] = useFonts({
    "Jakarta-Regular": PlusJakartaSans_400Regular,
    "Jakarta-Medium": PlusJakartaSans_500Medium,
    "Jakarta-SemiBold": PlusJakartaSans_600SemiBold,
    "Jakarta-Bold": PlusJakartaSans_700Bold,
  });

  const toastConfig = useCallback(
    () => ({
      success: (props: any) => (
        <BaseToast
          {...props}
          style={{ marginTop: 10, borderLeftColor: "green" }}
        />
      ),
      error: (props: any) => (
        <ErrorToast
          {...props}
          style={{ marginTop: 10, borderLeftColor: "red" }}
        />
      ),
    }),
    [],
  );

  useEffect(() => {
    if (_hasHydrated || fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [_hasHydrated, fontsLoaded, fontError]);

  if (!_hasHydrated && !fontsLoaded && !fontError) {
    return null;
  }

  useAppPermissions();

  return (
    <Provider store={Store}>
      <QueryClientProvider client={client}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <>
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: insets.top,
                backgroundColor: color.green,
                zIndex: 9999,
              }}
            />

            <View style={{ flex: 1 }}>
              <Stack>
                <Stack.Protected guard={!hasCompletedOnboarding}>
                  <Stack.Screen
                    name="OnboardScreen"
                    options={{ headerShown: false }}
                  />
                </Stack.Protected>
                <Stack.Protected guard={isLoggedIn}>
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="screens"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="modal"
                    options={{
                      presentation: "modal",
                      title: "Pre-Order",
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="Order"
                    options={{
                      // presentation: "modal",
                      title: "Orders",
                      headerShown: false,
                    }}
                  />
                </Stack.Protected>
                <Stack.Protected guard={!isLoggedIn && hasCompletedOnboarding}>
                  <Stack.Screen
                    name="(auth)"
                    options={{ headerShown: false }}
                  />
                </Stack.Protected>
              </Stack>
              <StatusBar
                style="light"
                translucent={false}
                backgroundColor={color.green}
              />
              <NetworkStatus />
              <Toast config={toastConfig()} />
            </View>
          </>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </Provider>
  );
}
