import { color } from "@/constants/Colors";
//import { FlashList } from "@shopify/flash-list";
//import { FlashList } from "@shopify/flash-list/src";
import React from "react";
import { FlatList, RefreshControl } from "react-native";
import SpaceBelow from "../Index/SpaceBelow";
import ReservationCard from "./ReserveCard";

interface dataprops {
  date: string;
  time: number;
  location: string;
  rate: string;
  image: string;
  restaurantName: string;
}
interface prop {
  data: dataprops[] | undefined;
  refreshing: boolean;
  onRefresh: () => void;
}

export default function Container({ data, refreshing, onRefresh }: prop) {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <ReservationCard items={item} />}
      //estimatedItemSize={50}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[color.green]} />
      }
      ListFooterComponent={()=><SpaceBelow />}
    />
  );
}
