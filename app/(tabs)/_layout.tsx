import { color } from "@/constants/Colors";
import { useCartStore } from "@/store/useOrderStore";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomTabBar = ({ state, descriptors, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const cart = useCartStore((state) => state.items);

  return (
    <View
      style={[styles.tabBarContainer, { paddingBottom: insets.bottom + 10 }]}
    >
      <View style={styles.pillContainer}>
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
            iconName = isFocused ? "calendar-clear" : "calendar-clear-outline";
            label = "Reservations";
          } else if (route.name === "wishlist") {
            iconName = isFocused ? "heart" : "heart-outline";
            label = "Favorites";
          } else if (route.name === "settings") {
            iconName = isFocused ? "settings" : "settings-outline";
            label = "Settings";
          }

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={[styles.tabItem, isFocused ? styles.tabItemFocused : null]}
            >
              <Ionicons
                name={iconName}
                size={22}
                color={isFocused ? "#000" : "#FFF"}
              />
              {isFocused && <Text style={styles.tabLabel}>{label}</Text>}
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.mapButton}
        activeOpacity={0.8}
        onPress={() => router.navigate("/cart")}
      >
        {cart?.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cart.length}</Text>
          </View>
        )}
        <Ionicons name="cart" size={24} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="(toptabs)" options={{ title: "Reservation" }} />
      <Tabs.Screen name="wishlist" options={{ title: "Favorites" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "transparent",
  },
  pillContainer: {
    flexDirection: "row",
    backgroundColor: color.green,
    borderRadius: 35,
    padding: 8,
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    flex: 1,
    marginRight: 15,
    maxWidth: 320,
  },
  tabItem: {
    padding: 10,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  tabItemFocused: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tabLabel: {
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 12,
    color: "#000",
  },
  mapButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: color.green,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  badge: {
    position: "absolute",
    height: 20,
    width: 20,
    backgroundColor: "red",
    top: -10,
    right: 0,
    borderRadius: 20,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
});
