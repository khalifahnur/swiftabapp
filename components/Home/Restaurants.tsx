import { RestaurantData } from "@/types";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  Text,
  useWindowDimensions,
  View
} from "react-native";
import Card from "../Card";

interface Section {
  title: string;
  data: RestaurantData[];
}

export default function Restaurants({
  title,
  data,
}: {
  title: string;
  data: Section[];
}) {
  const route = useRouter();
  const { width } = useWindowDimensions();

  const handleNavigate = (restaurantData: RestaurantData) => {
    route.push({
      pathname: "/screens/restaurantdetails",
      params: { data: JSON.stringify(restaurantData) },
    });
  };

  return (
    <View className="mt-6">
      <View className="flex-row justify-between items-end px-6 mb-4">
        <Text className="text-xl font-bold text-gray-900 tracking-tight">
          {title}
        </Text>
        <Text className="text-teal-600 font-medium text-sm">See all</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
        decelerationRate="fast"
        snapToInterval={width * 0.75 + 16}
      >
        {data.map((restaurant) =>
          restaurant.data.map((item: RestaurantData) => (
            <Card
              key={item._id}
              restaurantName={item.restaurantName}
              location={item.location}
              rate={item.rate}
              handlePress={() => handleNavigate(item)}
              image={item.image}
            />
          )),
        )}
      </ScrollView>
    </View>
  );
}
