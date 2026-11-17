import { pushOnce } from "@/lib/nav";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { tapFeedback } from "@/components/ui/Button";
import { Tap } from "@/components/ui/Tap";
import { Txt } from "@/components/ui/Txt";
import { palette, shadow } from "@/constants/theme";
import { useOrders } from "@/hooks/queries";
import { isOpenOrder } from "@/lib/format";


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
        style={{ flex: 1, alignItems: "center", justifyContent: "center", height: 56 }}
      >
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: focused ? palette.brandTint : "transparent",
          }}
        >
          <Icon name={focused ? meta.active : meta.icon} size={21} color={focused ? palette.pine : palette.faint} strokeWidth={focused ? 2.3 : 1.9} />
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
            height: 62,
            borderRadius: 31,
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
        <View style={{ width: 68 }} />
        {tab(2)}
        {tab(3)}
      </View>

      {/* Centred by a full-width row, so it sits in the middle on every screen size. */}
      <View pointerEvents="box-none" style={{ position: "absolute", left: 0, right: 0, top: -12, alignItems: "center" }}>
        <Tap
          testID="tab-orders"
          accessibilityRole="button"
          accessibilityLabel={openOrders ? `Orders, ${openOrders} in progress` : "Orders"}
          onPress={() => {
            tapFeedback();
            pushOnce(router, "/Order");
          }}
          pressedStyle={{ transform: [{ scale: 0.94 }] }}
          style={[
            shadow.raised,
            {
              width: 58,
              height: 58,
              borderRadius: 29,
              backgroundColor: palette.pine,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 4,
              borderColor: palette.canvas,
            },
          ]}
        >
          <Icon name="receipt-outline" size={22} color={palette.white} />
          {openOrders > 0 && (
            <View
              style={{
                position: "absolute",
                top: -4,
                right: -4,
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
        </Tap>
      </View>
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
