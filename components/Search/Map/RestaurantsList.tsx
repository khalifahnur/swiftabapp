import {
  FlatList,
  StyleSheet,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import Card from "./Card";

export default function RestaurantsList({ data, scrollViewRef, cardWidth }) {
  const route = useRouter();
  const restaurantsData = data.flatMap((item) => item.data);

  const navigateHandler = (item) => {
    route.push({
      pathname: "/screens/restaurantdetails",
      params: { data: JSON.stringify(item) },
    });
  };

  return (
    <FlatList
      data={restaurantsData}
      ref={scrollViewRef}
      snapToInterval={cardWidth}
      snapToAlignment="start"
      decelerationRate="fast"
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <Card
          image={item.image}
          restaurantName={item.restaurantName}
          rate={item.rate}
          location={item.location}
          handlePress={() => navigateHandler(item)}
          cardWidth={cardWidth}
        />
      )}
      contentContainerStyle={styles.container}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    //backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});