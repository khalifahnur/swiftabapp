import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { fetchAllRes } from "@/api/api";
import Container from "@/components/Home/Container";
import { Restaurant } from "@/types";
import { Ionicons } from "@expo/vector-icons";

interface UserData {
  email: string;
  name: string;
  phoneNumber: string;
  userId: string;
}

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState<UserData>({} as UserData);

  useEffect(() => {
    const fetchUser = async () => {
      const userString = await AsyncStorage.getItem("userObj");
      if (userString) {
        const userObj = JSON.parse(userString);
        setUserData(userObj.user);
      }
    };
    fetchUser();
  }, []);

  const {
    data: restaurantsData,
    isLoading: isRestaurantsLoading,
    isError: isRestaurantsError,
    error: restaurantsError,
    refetch: refetchRestaurants,
  } = useQuery<{ message: string; restaurants: Restaurant[] }>({
    queryKey: ["restaurants"],
    queryFn: fetchAllRes,
    staleTime: 10 * 60 * 1000,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchRestaurants();
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (isRestaurantsError) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-6">
        <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
          <Ionicons name="alert-circle" size={32} color="#ef4444" />
        </View>
        <Text className="text-xl font-bold text-gray-900 mb-2">
          Failed to load restaurants
        </Text>
        <Text className="text-gray-500 text-center mb-6">
          {restaurantsError.message}
        </Text>
        <TouchableOpacity
          className="bg-teal-600 px-6 py-3 rounded-lg"
          onPress={() => onRefresh}
        >
          <Text className="text-white font-bold">Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const transformedRestaurants = Array.isArray(restaurantsData?.restaurants)
    ? restaurantsData.restaurants.map((item) => ({
        restaurantId: item._id,
        title: item.title,
        data:
          Array.isArray(item.data) && item.data.length > 0
            ? item.data.map((entry, index) => ({
                ...entry,
                _id: entry._id || `${item._id}-${index}`,
                restaurantId: item._id,
              }))
            : [],
      }))
    : [];

  if (isRestaurantsLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <LottieView
          source={require("@/assets/images/lottie/loader.json")}
          autoPlay
          loop
          style={{ width: 120, height: 120 }}
        />
        <Text className="text-gray-500 font-medium mt-2">
          Loading restaurants...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <Container
        allRestaurants={transformedRestaurants}
        refreshing={refreshing}
        onRefresh={onRefresh}
        isLoading={isRestaurantsLoading}
      />
    </SafeAreaView>
  );
}
