import { formatCurrency } from "@/lib/helpers";
import React from "react";
import { Image, Text, View } from "react-native";

export default function RenderMenuItem({ item }: { item: any }) {
  if (!item) return null;

  return (
    <View className="flex-row bg-white p-3 rounded-2xl mx-6 mb-3 shadow-sm border border-gray-100 items-center">
      <View className="relative w-20 h-20 bg-gray-100 rounded-xl mr-4 overflow-hidden">
        <Image
          source={{ uri: item.image }}
          className="w-full h-full"
          resizeMode="cover"
        />
        {item.quantity > 1 && (
          <View className="absolute top-1 right-1 bg-black/70 px-1.5 py-0.5 rounded-md">
            <Text className="text-white text-xs font-bold">
              {item.quantity}x
            </Text>
          </View>
        )}
      </View>

      <View className="flex-1 justify-center py-1">
        <Text
          className="font-bold text-gray-900 text-lg mb-1"
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text
          className="font-regular text-gray-500 text-sm leading-5 mb-2"
          numberOfLines={1}
        >
          {item.description}
        </Text>
        <Text className="font-bold text-teal-600 text-base">
          {formatCurrency(item.cost)}
        </Text>
      </View>
    </View>
  );
}
