import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { fetchCompletedReservation } from "@/api/api";
import Container from "@/components/Reserve/History/Container";
import { ActiveReservation } from "@/types";

interface UserData {
  email: string;
  name: string;
  phoneNumber: string;
  userId: string;
}

export default function HistoryTab() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData>({} as UserData);
  const [refreshing, setRefreshing] = useState(false);

  const { userId } = userData;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userObjStr = await AsyncStorage.getItem("userObj");
        const userObj = JSON.parse(userObjStr || "{}");
        setUserData(userObj.user || {});
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, []);

  const { data, isLoading, isError, error, refetch } = useQuery<
    ActiveReservation[],
    Error
  >({
    queryKey: ["completed", userId],
    queryFn: () => fetchCompletedReservation(userId),
    staleTime: 10 * 60 * 1000,
    enabled: !!userId,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const isLoadingOrRefreshing = isLoading || refreshing;

  if (isLoadingOrRefreshing && !data) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <LottieView
          source={require("@/assets/images/lottie/loader.json")}
          autoPlay
          loop
          style={{ width: 120, height: 120 }}
        />
        <Text className="mt-2 text-gray-500 font-medium">
          Fetching history...
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-6">
        <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
          <Ionicons name="alert-circle" size={32} color="#ef4444" />
        </View>
        <Text className="text-xl font-bold text-gray-900 mb-2 text-center">
          Something went wrong
        </Text>
        <Text className="text-gray-500 text-center mb-6">
          {error?.message || "Failed to load history."}
        </Text>
        <TouchableOpacity
          className="bg-teal-600 px-6 py-3 rounded-lg shadow-sm"
          onPress={() => refetch()}
        >
          <Text className="text-white font-bold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-6 pb-20">
        <LottieView
          source={require("@/assets/images/lottie/cancelled.json")}
          autoPlay
          loop
          style={{ width: 180, height: 180 }}
        />
        <Text className="text-xl font-bold text-gray-900 mt-6 mb-2 text-center">
          No Past Reservations
        </Text>
        <Text className="text-base font-medium text-gray-500 text-center px-4 leading-6">
          Your completed and cancelled reservations will appear here for your
          records.
        </Text>

        <TouchableOpacity
          className="mt-8 bg-teal-600 px-8 py-4 rounded-lg shadow-sm"
          onPress={() => router.navigate("/(tabs)")}
        >
          <Text className="text-white font-bold text-base">
            Explore Restaurants
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Container data={data} refreshing={refreshing} onRefresh={onRefresh} />
    </View>
  );
}
