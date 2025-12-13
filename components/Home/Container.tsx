import { RestaurantData } from "@/types";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Header from "./Header";
import Restaurants from "./Restaurants";

interface Section {
  title: string;
  data: RestaurantData[];
}

interface ContainerProps {
  //recentlyViewed:Section[];
  allRestaurants: Section[];
  refreshing: boolean;
  onRefresh: () => void;
  isLoading: boolean;
}
interface RestaurantCardProps {
  name: string;
  location: string;
  rating: number;
  image: string;
}

const Container = ({
  //recentlyViewed,
  allRestaurants,
  refreshing,
  onRefresh,
  isLoading,
}: ContainerProps) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <Promotions /> */}
        {/* <RecentlyViewedRestaurants recentlyViewed={recentlyViewed} /> */}
        <Restaurants title="New Restaurant" data={allRestaurants} />
        <Restaurants title="Recommended Restaurants" data={allRestaurants} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  offerCard: {
    backgroundColor: "#009688",
    margin: 20,
    borderRadius: 15,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  offerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  offerSubtext: {
    color: "#fff",
    fontSize: 16,
  },
  offerPercentage: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 5,
  },
  bookButton: {
    backgroundColor: "#E0F2F1",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  bookButtonText: {
    color: "#009688",
    fontWeight: "600",
  },
  offerImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  section: {
    marginBottom: 20,
  },
  cuisineSection: {
    padding: 0,
    marginBottom: 50,
  },
});

export default Container;
