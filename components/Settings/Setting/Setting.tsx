import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import {
  BackHandler,
  Image,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "@/lib/authStore";

interface UserData {
  email: string;
  name: string;
  phoneNumber: string;
  userId: string;
}

const SettingRow = ({
  icon,
  iconFamily: IconComponent,
  iconColor,
  iconBg,
  title,
  onPress,
  isLast = false,
  showToggle = false,
  toggleValue = false,
  onToggle,
}: any) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    disabled={!onPress && !showToggle}
    className={`flex-row items-center py-4 ${!isLast ? "border-b border-gray-100" : ""}`}
  >
    <View
      className="w-10 h-10 rounded-xl items-center justify-center mr-4"
      style={{ backgroundColor: iconBg }}
    >
      <IconComponent name={icon} size={20} color={iconColor} />
    </View>
    <Text className="flex-1 text-base font-medium text-gray-800">{title}</Text>

    {showToggle ? (
      <Switch
        value={toggleValue}
        onValueChange={onToggle}
        trackColor={{ false: "#E5E7EB", true: "#0d9488" }} // teal-600 when active
        thumbColor="#ffffff"
      />
    ) : (
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    )}
  </TouchableOpacity>
);

export default function Setting() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData>({} as UserData);
  const [loading, setLoading] = useState(false);
  const [notOff, setNotOff] = useState(false);

  const { logOut } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userObj = JSON.parse(
          (await AsyncStorage.getItem("userObj")) || "{}",
        );
        setUserData(userObj.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  const LogOutHandler = async () => {
    try {
      setLoading(true);
      logOut();
      await AsyncStorage.clear();

      setTimeout(() => {
        router.replace("/(auth)");
      }, 1500);

      const backAction = () => {
        BackHandler.exitApp();
        return true;
      };

      const subscribe = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction,
      );
      return () => subscribe.remove();
    } catch (error) {
      setLoading(false);
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <LottieView
          source={require("@/assets/images/lottie/loader.json")}
          autoPlay
          loop
          style={{ width: 120, height: 120 }}
        />
        <Text className="mt-4 text-base font-medium text-gray-500">
          Logging out...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      {/* Safely hide the header using expo-router */}
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Profile Section */}
        <View className="items-center mt-6 mb-8">
          <View className="relative shadow-sm">
            <Image
              source={require("@/assets/images/user.jpeg")}
              className="w-24 h-24 rounded-full bg-gray-200"
            />
            {/* Small edit badge */}
            <View className="absolute bottom-0 right-0 bg-teal-600 w-8 h-8 rounded-full items-center justify-center border-2 border-gray-50">
              <Ionicons name="pencil" size={14} color="#fff" />
            </View>
          </View>
          <Text className="text-2xl font-bold text-gray-900 mt-4 mb-1">
            {userData?.name || "Guest"}
          </Text>
          <Text className="text-sm font-regular text-gray-500">
            {userData?.email || "No email provided"}
          </Text>
        </View>

        <View className="px-6">
          {/* Preferences Group */}
          <Text className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 ml-2">
            Preferences
          </Text>
          <View className="bg-white rounded-3xl px-4 py-2 mb-6 shadow-sm border border-gray-100">
            <SettingRow
              icon="notifications"
              iconFamily={Ionicons}
              iconColor="#4F46E5" // Indigo
              iconBg="#EEF2FF"
              title="Push Notifications"
              showToggle={true}
              toggleValue={notOff}
              onToggle={() => setNotOff(!notOff)}
              isLast={true}
            />
          </View>

          {/* Support & Legal Group */}
          <Text className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 ml-2">
            Support & Legal
          </Text>
          <View className="bg-white rounded-3xl px-4 py-2 mb-8 shadow-sm border border-gray-100">
            <SettingRow
              icon="help-circle-outline"
              iconFamily={MaterialCommunityIcons}
              iconColor="#10B981" // Emerald
              iconBg="#ECFDF5"
              title="Help Center"
              onPress={() => router.push("/screens/help")}
            />
            <SettingRow
              icon="shield-checkmark-outline"
              iconFamily={Ionicons}
              iconColor="#3B82F6" // Blue
              iconBg="#EFF6FF"
              title="Privacy Policy"
              onPress={() => router.push("/screens/PolicyScreen?type=privacy")}
            />
            <SettingRow
              icon="document-text-outline"
              iconFamily={Ionicons}
              iconColor="#8B5CF6" // Purple
              iconBg="#F5F3FF"
              title="Terms & Conditions"
              onPress={() => router.push("/screens/PolicyScreen?type=terms")}
            />
            <SettingRow
              icon="information-outline"
              iconFamily={MaterialCommunityIcons}
              iconColor="#6B7280" // Gray
              iconBg="#F3F4F6"
              title="About Swiftab"
              onPress={() => router.push("/screens/PolicyScreen?type=about")}
              isLast={true}
            />
          </View>
          <TouchableOpacity
            onPress={LogOutHandler}
            className="flex-row justify-center items-center bg-red-50 py-4 rounded-2xl border border-red-100 mb-6"
          >
            <MaterialIcons name="logout" size={20} color="#EF4444" />
            <Text className="text-red-500 text-base font-bold ml-2">
              Log Out
            </Text>
          </TouchableOpacity>

          <Text className="text-center text-gray-400 text-xs font-medium">
            Swiftab App v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
