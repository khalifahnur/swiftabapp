import { useRouter } from "expo-router";
import React, { forwardRef } from "react";
import { FlatList, ViewabilityConfig, ViewToken } from "react-native";
import Card from "./Card";

interface Props {
  data: any[];
  cardWidth: number;
  onViewableItemsChanged?: (info: {
    viewableItems: ViewToken[];
    changed: ViewToken[];
  }) => void;
  viewabilityConfig?: ViewabilityConfig;
}

const RestaurantsList = forwardRef<FlatList, Props>(
  ({ data, cardWidth, onViewableItemsChanged, viewabilityConfig }, ref) => {
    const route = useRouter();

    const navigateHandler = (item: any) => {
      route.push({
        pathname: "/screens/restaurantdetails",
        params: { data: JSON.stringify(item) },
      });
    };

    return (
      <FlatList
        ref={ref}
        data={data}
        keyExtractor={(item) => item._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + 16}
        snapToAlignment="center"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={{ paddingHorizontal: 16, alignItems: "center" }}
        getItemLayout={(data, index) => ({
          length: cardWidth + 16,
          offset: (cardWidth + 16) * index,
          index,
        })}
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
      />
    );
  },
);

export default RestaurantsList;
