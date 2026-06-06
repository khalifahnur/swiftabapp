import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Header() {
  const [locationName, setLocationName] = useState<string>("Locating...");
  const insets = useSafeAreaInsets();
  const route = useRouter();

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationName("Nairobi, KE");
          return;
        }
        let location = await Location.getCurrentPositionAsync({});

        let geocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (geocode.length > 0) {
          const current = geocode[0];
          const city = current.city || current.subregion || "Unknown";
          const country = current.isoCountryCode || current.country || "USA";
          setLocationName(`${city}, ${country}`);
        }
      } catch (error) {
        setLocationName("Nairobi, KE");
      }
    };

    fetchLocation();
  }, []);

  const handleSearchClick = () => {
    route.push({
      pathname: "/screens/search",
      params: { address: locationName },
    });
  };

  return (
    <View
      className="bg-[#008080] rounded-b-[32px] px-6 pb-6"
      style={{ paddingTop: insets.top + 16 }}
    >
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-indigo-200 text-sm font-medium mb-1">
            Location
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="location" size={20} color="#f97316" />
            <Text className="text-white text-lg font-bold mx-1">
              {locationName}
            </Text>
            <Ionicons name="chevron-down" size={16} color="#f97316" />
          </View>
        </View>
        <TouchableOpacity className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center relative">
          <Ionicons name="notifications" size={24} color="white" />
          <View className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#008080]" />
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center gap-3">
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleSearchClick}
          className="flex-1 bg-white flex-row items-center px-4 h-14 rounded-2xl"
        >
          <Ionicons name="search" size={20} color="#9ca3af" />
          <View
            pointerEvents="none"
            className="flex-1 ml-2 justify-center h-full"
          >
            <TextInput
              placeholder="Search"
              placeholderTextColor="#9ca3af"
              className="text-base text-gray-900"
              editable={false}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity className="w-14 h-14 bg-white rounded-2xl items-center justify-center">
          <Ionicons name="options" size={24} color="#008080" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
