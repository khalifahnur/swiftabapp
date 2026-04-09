import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function Reviews({ reviews }: { reviews: any[] }) {
  // Flatten the nested arrays so we just have one clean array of review objects
  const allReviews = reviews?.flatMap((item) => item.review) || [];

  return (
    <View className="pt-4 pb-6">
      {/* We slice to 3 so the screen isn't overwhelmed, forcing them to click "See All" */}
      {allReviews.slice(0, 3).map((item, index) => (
        <View
          key={index}
          className="bg-white rounded-2xl p-4 mb-4 border border-gray-100 shadow-sm"
        >
          {/* User Header */}
          <View className="flex-row items-center mb-3">
            <Image
              source={require("@/assets/images/user.jpeg")}
              className="w-10 h-10 rounded-full bg-gray-200 mr-3"
            />
            <View className="flex-1">
              <Text className="font-bold text-gray-900 text-base">
                {item.name}
              </Text>

              {/* Dynamic Star Rating using Icons */}
              <View className="flex-row items-center mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name={i < item.rating ? "star" : "star-outline"}
                    size={14}
                    color={i < item.rating ? "#f5a623" : "#D1D5DB"} // Yellow if active, gray if not
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Review Body */}
          <Text className="text-gray-600 font-regular text-sm leading-5 text-justify">
            {item.reviewTxt}
          </Text>
        </View>
      ))}

      {/* Button placed OUTSIDE the map loop */}
      {allReviews.length > 0 ? (
        <TouchableOpacity className="w-full py-4 rounded-xl border border-teal-600 items-center mt-2 bg-teal-50/50">
          <Text className="text-teal-600 font-bold text-base">
            Read All Reviews
          </Text>
        </TouchableOpacity>
      ) : (
        <View className="py-10 items-center">
          <Ionicons name="chatbubbles-outline" size={40} color="#9CA3AF" />
          <Text className="text-gray-500 font-medium mt-3">
            No reviews yet.
          </Text>
        </View>
      )}
    </View>
  );
}
