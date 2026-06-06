import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type CardProps = {
  image: string;
  restaurantName: string;
  rate: number;
  location: string;
  handlePress: () => void;
  cardWidth?: number;
};

export default function Card({
  image,
  restaurantName,
  rate,
  location,
  handlePress,
  cardWidth = 280,
}: CardProps) {
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{ width: cardWidth }}
      activeOpacity={0.9}
      className="bg-white shadow-sm shadow-gray-300 rounded-xl mx-2 mb-2 overflow-hidden border border-gray-100"
    >
      <Image
        source={{ uri: image }}
        className="w-full h-32"
        resizeMode="cover"
      />
      <View className="p-3">
        <View className="flex-row justify-between items-center mb-1">
          <Text
            className="text-gray-900 text-base font-bold flex-1 mr-2"
            numberOfLines={1}
          >
            {restaurantName}
          </Text>
          <View className="flex-row items-center bg-teal-50 px-2 py-1 rounded-full">
            <Text className="text-teal-700 text-xs font-bold mr-1">{rate}</Text>
            <Ionicons name="star" size={12} color="#14b8a6" />
          </View>
        </View>

        <View className="flex-row items-center mt-1">
          <Ionicons name="location" size={14} color="#9ca3af" />
          <Text className="text-gray-500 text-xs ml-1 flex-1" numberOfLines={1}>
            {location}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
