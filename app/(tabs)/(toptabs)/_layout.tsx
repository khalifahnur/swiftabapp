import { color } from "@/constants/Colors";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { withLayoutContext } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

const TopTabLayout = () => {
  return (
    <SafeAreaView style={{flex:1}}>
    <MaterialTopTabs
      screenOptions={{
        animationEnabled: true,
        lazy: false,
        tabBarStyle: {
          backgroundColor: "transparent",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        tabBarPressColor: "transparent",

        tabBarActiveTintColor: color.green,
        tabBarInactiveTintColor: "#1E1E1E",

        tabBarIndicatorStyle: {
          backgroundColor: color.green,
          height: 3,
          borderRadius: 2,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
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
