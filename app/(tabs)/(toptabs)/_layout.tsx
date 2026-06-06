import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext(Navigator);

const TopTabLayout = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <MaterialTopTabs
        screenOptions={{
          animationEnabled: false, // ✅ fix flickering indicator
          lazy: false,
          tabBarStyle: {
            backgroundColor: "#fff",
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: "#F3F4F6",
          },
          tabBarPressColor: "transparent",
          tabBarActiveTintColor: "#0d9488",
          tabBarInactiveTintColor: "#6B7280",
          tabBarIndicatorStyle: {
            backgroundColor: "#0d9488",
            height: 3,
            borderRadius: 3,
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: "bold",
            textTransform: "capitalize",
          },
        }}
      >
        <MaterialTopTabs.Screen name="index" options={{ title: "Active" }} />
        <MaterialTopTabs.Screen name="history" options={{ title: "History" }} />
      </MaterialTopTabs>
    </SafeAreaView>
  );
};

export default TopTabLayout;
