import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { tapFeedback } from "@/components/ui/Button";
import { Txt } from "@/components/ui/Txt";
import { palette, shadow } from "@/constants/theme";
import { useOrders } from "@/hooks/queries";
import { isOpenOrder } from "@/lib/format";

type IconName = keyof typeof Ionicons.glyphMap;

const TABS: Record<string, { label: string; icon: IconName; active: IconName }> = {
  index: { label: "Home", icon: "home-outline", active: "home" },
  bookings: { label: "Bookings", icon: "calendar-outline", active: "calendar" },
  wishlist: { label: "Saved", icon: "heart-outline", active: "heart" },
  settings: { label: "Profile", icon: "person-outline", active: "person" },
};

/** A floating pill of tabs with a raised button in the middle for orders. */
function PillTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data: orders } = useOrders();
  const openOrders = orders?.filter((o) => isOpenOrder(o.status)).length ?? 0;

  const tab = (routeIndex: number) => {
    const route = state.routes[routeIndex];
    const meta = TABS[route.name];
    if (!meta) return null;
    const focused = state.index === routeIndex;
    return (
      <Pressable
        key={route.key}
        testID={`tab-${route.name}`}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={meta.label}
        onPress={() => {
          tapFeedback();
          const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        }}
        style={{ flex: 1, alignItems: "center", justifyContent: "center", height: 60 }}
      >
        <View
          style={{
            width: 46,
            height: 46,
            borderRadius: 23,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: focused ? palette.brandTint : "transparent",
          }}
        >
          <Ionicons name={focused ? meta.active : meta.icon} size={22} color={focused ? palette.pine : palette.faint} />
        </View>
      </Pressable>
    );
  };

  return (
    <View
      pointerEvents="box-none"
      style={{ position: "absolute", left: 20, right: 20, bottom: Math.max(insets.bottom, 12) + 6 }}
    >
      <View
        style={[
          shadow.raised,
          {
            height: 68,
            borderRadius: 34,
            backgroundColor: palette.surface,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: palette.line,
          },
        ]}
      >
        {tab(0)}
        {tab(1)}
        <View style={{ width: 72 }} />
        {tab(2)}
        {tab(3)}
      </View>

      <Pressable
        testID="tab-orders"
        accessibilityRole="button"
        accessibilityLabel={openOrders ? `Orders, ${openOrders} in progress` : "Orders"}
        onPress={() => {
          tapFeedback();
          router.push("/Order");
        }}
        style={({ pressed }) => [
          shadow.raised,
          {
            position: "absolute",
            alignSelf: "center",
            top: -14,
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: palette.pine,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 4,
            borderColor: palette.canvas,
            transform: [{ scale: pressed ? 0.95 : 1 }],
          },
        ]}
      >
        <Ionicons name="receipt-outline" size={24} color={palette.white} />
        {openOrders > 0 && (
          <View
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              minWidth: 20,
              height: 20,
              borderRadius: 10,
              paddingHorizontal: 5,
              backgroundColor: palette.amber,
              borderWidth: 2,
              borderColor: palette.canvas,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Txt w="bold" size={10} color={palette.ink} style={{ lineHeight: 13 }}>
              {openOrders > 9 ? "9+" : openOrders}
            </Txt>
          </View>
        )}
      </Pressable>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <PillTabBar {...props} />} screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: palette.canvas } }}>
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="bookings" options={{ title: "Bookings" }} />
      <Tabs.Screen name="wishlist" options={{ title: "Saved" }} />
      <Tabs.Screen name="settings" options={{ title: "Profile" }} />
    </Tabs>
  );
}
