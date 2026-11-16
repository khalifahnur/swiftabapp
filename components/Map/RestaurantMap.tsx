import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { palette } from "@/constants/theme";
import type { Restaurant } from "@/types";

/** A map of restaurants. The selected one is highlighted and kept in view. */
export default function RestaurantMap({
  restaurants,
  selectedId,
  userCoords,
  onSelect,
}: {
  restaurants: Restaurant[];
  selectedId: string | null;
  userCoords: { latitude: number; longitude: number } | null;
  onSelect: (id: string) => void;
}) {
  const map = useRef<MapView>(null);
  const selected = restaurants.find((r) => r.id === selectedId);
  const first = selected ?? restaurants[0];
  const centre = userCoords ?? (first ? { latitude: first.latitude, longitude: first.longitude } : { latitude: -1.2864, longitude: 36.8172 });

  useEffect(() => {
    if (selected) {
      map.current?.animateToRegion(
        { latitude: selected.latitude - 0.004, longitude: selected.longitude, latitudeDelta: 0.03, longitudeDelta: 0.03 },
        450,
      );
    }
  }, [selected]);

  return (
    <MapView
      ref={map}
      style={{ flex: 1 }}
      showsUserLocation={Boolean(userCoords)}
      showsMyLocationButton={false}
      showsCompass={false}
      toolbarEnabled={false}
      initialRegion={{ ...centre, latitudeDelta: 0.08, longitudeDelta: 0.08 }}
    >
      {restaurants.map((restaurant) => {
        const active = restaurant.id === selectedId;
        return (
          <Marker
            key={restaurant.id}
            coordinate={{ latitude: restaurant.latitude, longitude: restaurant.longitude }}
            onPress={() => onSelect(restaurant.id)}
            zIndex={active ? 10 : 1}
            tracksViewChanges={false}
          >
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  width: active ? 44 : 36,
                  height: active ? 44 : 36,
                  borderRadius: 22,
                  backgroundColor: active ? palette.amber : palette.pine,
                  borderWidth: 3,
                  borderColor: palette.white,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="restaurant" size={active ? 19 : 15} color={active ? palette.ink : palette.white} />
              </View>
            </View>
          </Marker>
        );
      })}
    </MapView>
  );
}
