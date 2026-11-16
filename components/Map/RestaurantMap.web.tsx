import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

import { Txt } from "@/components/ui/Txt";
import { palette } from "@/constants/theme";
import type { Restaurant } from "@/types";

/** Maps are native-only; the web preview explains that and keeps the list usable. */
export default function RestaurantMap(_props: {
  restaurants: Restaurant[];
  selectedId: string | null;
  userCoords: { latitude: number; longitude: number } | null;
  onSelect: (id: string) => void;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: palette.mint, alignItems: "center", justifyContent: "center", padding: 24 }}>
      <Ionicons name="map-outline" size={40} color={palette.pine} />
      <Txt w="semibold" size={14} color={palette.pine} center style={{ marginTop: 8 }}>
        The map is available in the Swiftab app.
      </Txt>
    </View>
  );
}
