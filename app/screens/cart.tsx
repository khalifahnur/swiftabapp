import Container from "@/components/Cart/Container";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function CartScreen() {
  const { restaurantName, restaurantId, userId, reservationId, tableNumber } =
    useLocalSearchParams<{
      restaurantName: string;
      restaurantId: string;
      userId: string;
      reservationId: string;
      tableNumber: string;
    }>();
  return (
    <Container
      restaurantId={restaurantId}
      userId={userId}
      reservationId={reservationId}
      tableNumber={tableNumber}
      restaurantName={restaurantName}
    />
  );
}
