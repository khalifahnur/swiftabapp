import { Menu, RestaurantData } from "@/types";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  BackHandler,
  Platform,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View
} from "react-native";
import Card from "../Card";
import NewSubHeader from "./NewSubHeader";

type RestaurantProps = {
  _id: string;
  about: object[];
  image: string;
  latitude: number;
  location: string;
  longitude: number;
  menu: Menu;
  rate: number;
  restaurantId: string;
  restaurantName: string;
  review: object[];
};

interface Section {
  title: string;
  data: RestaurantData[];
}

export default function Restaurants({
  title,
  data,
}: {
  title: string;
  data: SectionData[];
}) {
  const window = useWindowDimensions();
  const item_width =
    Platform.OS === "ios" ? window.width * 0.89 : window.width ;
  const route = useRouter();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {

        return true; 
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  const NavigateHandler = (RestaurantData: RestaurantData) => {
    return route.push({
      pathname: "/screens/restaurantdetails",
      params: { data: JSON.stringify(RestaurantData) },
    });
  };

  // const sectionRestaurants = data.filter((item) => item.title === title);

  return (
    <View style={styles.section}>
      <View style={styles.headerWrapper}>
        <NewSubHeader headerTitle={title} />
      </View>
      <ScrollView
      horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        decelerationRate={Platform.OS === "ios" ? 0 : 0}
        contentContainerStyle={styles.scrollContent}
      >
        {data.map((restaurant) =>
          restaurant.data.map((item: RestaurantData) => (
            <Card
              key={item._id}
              restaurantName={item.restaurantName}
              location={item.location}
              rate={item.rate}
              handlePress={() => NavigateHandler(item)}
              image={item.image}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginVertical: 12,
  },
  headerWrapper: {
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  scrollContent: {
    paddingHorizontal: 10, // Adds padding to start/end of list
    paddingBottom: 10,     // Adds space for the shadow to show
  },
});
