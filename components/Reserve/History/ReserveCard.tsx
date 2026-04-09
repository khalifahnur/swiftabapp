import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import moment from "moment";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface Props {
  items: {
    date: string;
    time: number;
    location: string;
    rate: string;
    image: string;
    restaurantName: string;
  };
}

export default function ReserveCard({ items }: Props) {
  const formattedTime = moment(items.time).format("MMM DD, YYYY • hh:mm A");

  return (
    <View className="bg-white mx-6 mb-4 rounded-3xl p-4 shadow-sm border border-gray-100 opacity-90">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-gray-900 font-bold text-sm">{formattedTime}</Text>
        <View className="bg-gray-100 px-2 py-1 rounded-md">
          <Text className="text-gray-500 font-bold text-xs">Completed</Text>
        </View>
      </View>

      <View className="h-px bg-gray-100 w-full mb-3" />

      <View className="flex-row mb-4">
        <Image
          source={{ uri: items.image }}
          className="w-20 h-20 rounded-2xl bg-gray-100 mr-4"
        />
        <View className="flex-1 justify-center">
          <View className="flex-row justify-between items-center mb-1">
            <Text
              className="font-bold text-gray-900 text-base"
              numberOfLines={1}
            >
              {items.restaurantName}
            </Text>
            <View className="flex-row items-center bg-teal-50 px-2 py-0.5 rounded-md">
              <Ionicons name="star" size={12} color="#f5a623" />
              <Text className="text-teal-700 font-bold text-xs ml-1">
                {items.rate}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center mb-1">
            <Ionicons name="location" size={14} color="#0d9488" />
            <Text
              className="text-gray-500 font-medium text-xs ml-1"
              numberOfLines={1}
            >
              {items.location}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        className="w-full bg-teal-50 border border-teal-100 py-3 rounded-xl items-center flex-row justify-center"
        onPress={() => router.navigate("/screens/ratescreen")}
      >
        <Ionicons name="star-outline" size={16} color="#0d9488" />
        <Text className="text-teal-600 font-bold text-sm ml-2">
          Rate Your Experience
        </Text>
      </TouchableOpacity>
    </View>
  );
}
