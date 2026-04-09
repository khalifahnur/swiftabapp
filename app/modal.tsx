import MenuScreen from "@/components/Modal/MenuModal";
import { useRestaurantMenu } from "@/hooks/reshooks/fetchres";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function MenuModal() {
  const router = useRouter();
  const { restaurantId, userId, reservationId, tableNumber } =
    useLocalSearchParams<{
      restaurantId: string;
      userId: string;
      reservationId: string;
      tableNumber: string;
    }>();
  const { data: menu, isLoading, error } = useRestaurantMenu(restaurantId);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <LottieView
          source={require("@/assets/images/lottie/loader.json")}
          autoPlay
          loop
          style={{ width: 120, height: 120 }}
        />
        <Text className="text-gray-500 font-medium mt-2">Loading menu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-6">
        <View className="w-16 h-16 bg-red-50 rounded-full items-center justify-center mb-4">
          <Ionicons name="alert-circle" size={32} color="#ef4444" />
        </View>
        <Text className="text-xl font-bold text-gray-900 mb-2">
          Failed to load menu
        </Text>
        <Text className="text-gray-500 text-center mb-6">{error.message}</Text>
        <TouchableOpacity
          className="bg-teal-600 px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!menu) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-6">
        <LottieView
          source={require("@/assets/images/lottie/empty.json")}
          autoPlay
          loop
          style={{ width: 180, height: 180 }}
        />
        <Text className="text-xl font-bold text-gray-900 mt-4">
          Menu is Empty
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          This restaurant hasn't added any items yet.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen options={{ headerShown: false }} />
      <MenuScreen
        menuData={menu}
        restaurantId={restaurantId}
        userId={userId}
        reservationId={reservationId}
        tableNumber={tableNumber}
      />
    </View>
  );
}
