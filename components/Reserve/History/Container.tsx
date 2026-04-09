import React from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import ReserveCard from "./ReserveCard";

interface DataProps {
  date: string;
  time: number;
  location: string;
  rate: string;
  image: string;
  restaurantName: string;
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
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <ReserveCard items={item} />}
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
              No reservation history.
            </Text>
          </View>
        }
      />
    </View>
  );
}
