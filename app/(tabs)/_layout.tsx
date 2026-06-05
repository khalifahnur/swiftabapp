import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// import { useCartStore } from "@/store/useOrderStore";

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  // const cart = useCartStore((state) => state.items);

  const bottomPadding = Math.max(insets.bottom, 16);

  return (
    <View
      className="absolute left-0 right-0 flex-row items-center justify-center px-4 mb-5"
      style={{ bottom: bottomPadding, backgroundColor: "transparent" }}
    >
      <View
        style={[
          styles.shadowPremium,
          {
            flex: 1,
            flexDirection: "row",
            backgroundColor: "#FFFFFF",
            borderRadius: 999,
            padding: 8,
            alignItems: "center",
            justifyContent: "space-between",
            borderWidth: 1,
            borderColor: "#F3F4F6",
            marginRight: 16,
          },
        ]}
      >
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName: keyof typeof Ionicons.glyphMap = "home";
          let label = "";

          if (route.name === "index") {
            iconName = isFocused ? "home" : "home-outline";
            label = "Home";
          } else if (route.name === "(toptabs)") {
            iconName = isFocused ? "calendar" : "calendar-outline";
            label = "Bookings";
          } else if (route.name === "wishlist") {
            iconName = isFocused ? "heart" : "heart-outline";
            label = "Saved";
          } else if (route.name === "settings") {
            iconName = isFocused ? "person" : "person-outline";
            label = "Profile";
          }

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              activeOpacity={0.8}
              className={`flex-row items-center justify-center rounded-full px-3 py-2.5 ${
                isFocused ? "bg-teal-50" : "bg-transparent"
              }`}
            >
              <Ionicons
                name={iconName}
                size={22}
                color={isFocused ? "#0d9488" : "#9CA3AF"}
              />
              {isFocused && (
                <Text className="ml-1.5 font-bold text-xs text-teal-700">
                  {label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.navigate("/Order")}
        className="w-14 h-14 rounded-full bg-teal-600 items-center justify-center border-2 border-white"
        style={styles.shadowPremium}
      >
        {/* {cart?.length > 0 && (
          <View className="absolute -top-1 -right-1 bg-red-500 h-5 min-w-[20px] rounded-full items-center justify-center px-1 border border-white z-10">
            <Text className="text-white text-[10px] font-bold leading-none">
              {cart.length > 9 ? "9+" : cart.length}
            </Text>
          </View>
        )} */}
        <Ionicons
          name="cart"
          size={24}
          color="#FFFFFF"
          style={{ marginLeft: -2 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="(toptabs)" options={{ title: "Bookings" }} />
      <Tabs.Screen name="wishlist" options={{ title: "Saved" }} />
      <Tabs.Screen name="settings" options={{ title: "Profile" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  shadowPremium: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});
