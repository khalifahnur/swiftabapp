import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { FlatList, useWindowDimensions, View, ViewToken } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import RestaurantMap from "@/components/Map/RestaurantMap";
import { RestaurantRow } from "@/components/RestaurantCard";
import { IconButton } from "@/components/ui/Button";
import { Txt } from "@/components/ui/Txt";
import { palette, shadow } from "@/constants/theme";
import { useRestaurants } from "@/hooks/queries";
import { useLocation } from "@/hooks/useLocation";
import { hasCoordinates, haversineKm } from "@/lib/restaurant";
import type { Restaurant } from "@/types";

/** Restaurants on a map, with a strip of cards that stays in step with the pins. */
export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const location = useLocation();
  const { data } = useRestaurants();
  const list = useRef<FlatList<Restaurant>>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const restaurants = useMemo(
    () =>
      (data ?? [])
        .filter(hasCoordinates)
        .map((r) => (location.coords ? { ...r, distanceKm: haversineKm(location.coords, r) } : r))
        .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0)),
    [data, location.coords],
  );

  const cardWidth = Math.min(width - 56, 360);
  const onViewable = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const first = viewableItems[0]?.item as Restaurant | undefined;
    if (first) setSelectedId(first.id);
  }).current;

  const select = (id: string) => {
    setSelectedId(id);
    const index = restaurants.findIndex((r) => r.id === id);
    if (index >= 0) list.current?.scrollToIndex({ index, animated: true });
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.canvas }}>
      <RestaurantMap restaurants={restaurants} selectedId={selectedId} userCoords={location.coords} onSelect={select} />

      <View style={{ position: "absolute", top: insets.top + 10, left: 20, right: 20, flexDirection: "row", alignItems: "center", gap: 10 }}>
        <IconButton icon="chevron-back" label="Go back" style={shadow.card} onPress={() => router.back()} />
        <View style={[shadow.card, { flex: 1, height: 44, borderRadius: 22, backgroundColor: palette.surface, justifyContent: "center", paddingHorizontal: 16 }]}>
          <Txt w="semibold" size={13.5} numberOfLines={1}>
            {restaurants.length} {restaurants.length === 1 ? "restaurant" : "restaurants"} on the map
          </Txt>
        </View>
      </View>

      <View style={{ position: "absolute", left: 0, right: 0, bottom: Math.max(insets.bottom, 16) + 8 }}>
        <FlatList
          ref={list}
          horizontal
          data={restaurants}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          snapToInterval={cardWidth + 12}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          getItemLayout={(_, index) => ({ length: cardWidth + 12, offset: (cardWidth + 12) * index, index })}
          onViewableItemsChanged={onViewable}
          viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
          renderItem={({ item }) => (
            <View style={[shadow.raised, { width: cardWidth, borderRadius: 20, backgroundColor: palette.surface }]}>
              <RestaurantRow restaurant={item} />
            </View>
          )}
        />
      </View>
    </View>
  );
}
