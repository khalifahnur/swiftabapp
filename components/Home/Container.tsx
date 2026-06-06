import { RestaurantData } from "@/types";
import React from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import Header from "./Header";
import Restaurants from "./Restaurants";

interface Section {
  title: string;
  data: RestaurantData[];
}

interface ContainerProps {
  allRestaurants: Section[];
  refreshing: boolean;
  onRefresh: () => void;
  isLoading: boolean;
}

const Container = ({
  allRestaurants,
  refreshing,
  onRefresh,
}: ContainerProps) => {
  return (
    <View className="flex-1 bg-gray-50">
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0d9488"
            colors={["#0d9488"]}
          />
        }
      >
        <Restaurants title="New Arrivals" data={allRestaurants} />
        <Restaurants title="Recommended For You" data={allRestaurants} />
      </ScrollView>
    </View>
  );
};

export default Container;
