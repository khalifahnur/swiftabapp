import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

type CardProps = {
  image: string;
  restaurantName: string;
  rate: number;
  location: string;
  handlePress: () => void;
};

export default function Card({
  image,
  restaurantName,
  rate,
  location,
  handlePress,
}: CardProps) {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
      bounciness: 8,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={handlePress}
    >
      <Animated.View
        style={{ transform: [{ scale: scaleValue }] }}
        className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
      >
        <View style={{ width: width * 0.65 }}>
          <View className="relative h-44 w-full bg-gray-200">
            <Image
              source={{ uri: image }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute top-3 left-3 bg-white/90 rounded-full flex-row items-center px-2.5 py-1 shadow-sm">
              <Text className="text-gray-900 text-xs font-bold mr-1">
                {rate}
              </Text>
              <Ionicons name="star" size={12} color="#f5a623" />
            </View>

            <View className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full items-center justify-center shadow-sm">
              <Ionicons name="heart-outline" size={18} color="#4B5563" />
            </View>
          </View>

          <View className="p-4">
            <Text
              className="text-lg font-bold text-gray-900 mb-1"
              numberOfLines={1}
            >
              {restaurantName}
            </Text>

            <View className="flex-row items-center">
              <Ionicons name="location" size={14} color="#0d9488" />
              <Text
                className="text-sm font-medium text-gray-500 ml-1 flex-1"
                numberOfLines={1}
              >
                {location}
              </Text>
            </View>

            <View className="flex-row items-center mt-3 pt-3 border-t border-gray-100">
              <Ionicons name="time-outline" size={14} color="#6B7280" />
              <Text className="text-xs text-gray-500 ml-1 font-medium mr-4">
                15-20 min
              </Text>
              {/* <Ionicons name="bicycle-outline" size={16} color="#6B7280" />
              <Text className="text-xs text-gray-500 ml-1 font-medium">
                Free delivery
              </Text> */}
            </View>
          </View>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}
