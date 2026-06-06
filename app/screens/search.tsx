import { fetchAllRes } from "@/api/api";
import MapContainer from "@/components/Search/Map/MapContainer";
import { Restaurant } from "@/types";
import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function SearchScreen() {
  const { address } = useLocalSearchParams<{ address: string }>();
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const { data: restaurantsData, isLoading: isRestaurantsLoading } = useQuery<{
    message: string;
    restaurants: Restaurant[];
  }>({
    queryKey: ["restaurants"],
    queryFn: fetchAllRes,
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    const getUserLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setUserLocation({ latitude: 40.7128, longitude: -74.006 });
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    getUserLocation();
  }, []);

  const transformedRestaurants = Array.isArray(restaurantsData?.restaurants)
    ? restaurantsData.restaurants.map((item) => ({
        restaurantId: item._id,
        title: item.title,
        data:
          Array.isArray(item.data) && item.data.length > 0
            ? item.data.map((entry, index) => ({
                ...entry,
                _id: entry._id || `${item._id}-${index}`,
                restaurantId: item._id,
              }))
            : [],
      }))
    : [];

  if (isRestaurantsLoading || !userLocation) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#14b8a6" />
        <Text className="text-gray-500 mt-4 font-medium">Preparing map...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-transparent">
      <MapContainer
        restaurantsData={transformedRestaurants}
        userLocation={userLocation}
        displayAddress={address || "Search location"}
      />
    </View>
  );
}
