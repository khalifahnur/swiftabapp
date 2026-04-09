import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Header() {
  const [greeting, setGreeting] = useState<string>("");
  const [userData, setUserData] = useState<any>({});
  const route = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userString = await AsyncStorage.getItem("userObj");
      if (userString) {
        const userObj = JSON.parse(userString);
        setUserData(userObj.user);
      }
    };
    fetchUser();

    const hour = moment().hour();
    if (hour >= 5 && hour < 12) setGreeting("Good Morning");
    else if (hour >= 12 && hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <View className="flex-row justify-between items-center px-6 pt-4 pb-2 bg-gray-50">
      <View>
        <Text className="text-gray-500 text-sm font-medium mb-1">
          {greeting} 👋
        </Text>
        <Text className="text-gray-900 text-2xl font-bold tracking-tight">
          {userData?.name ? userData.name.split(" ")[0] : "Guest"}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => route.push("/settings")}
        className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm border border-gray-100"
      >
        <Ionicons name="person-outline" size={22} color="#0d9488" />
      </TouchableOpacity>
    </View>
  );
}
