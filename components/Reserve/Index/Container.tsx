import React from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import ReservationCard from "./ReservationCard";
import SpaceBelow from "./SpaceBelow";

interface DataProps {
  date: string;
  time: string;
  location: string;
  rate: string;
  image: string;
  restaurantName: string;
  restaurantId: string;
  reservationId: string;
  id: string;
}

interface Props {
  data: DataProps[] | undefined;
  refreshing: boolean;
  onRefresh: () => void;
}

export default function Container({ data, refreshing, onRefresh }: Props) {
  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={data}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({ item }) => <ReservationCard items={item} />}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#0d9488"
            colors={["#0d9488"]}
          />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center pt-20">
            <Text className="text-gray-500 font-medium">
              No active reservations.
            </Text>
          </View>
        }
        ListFooterComponent={() => <SpaceBelow />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
