import React from "react";
import { Platform, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { palette } from "@/constants/theme";

/** A small, non-interactive map centred on one place. */
export default function MiniMap({ latitude, longitude, title, height = 150 }: { latitude: number; longitude: number; title?: string; height?: number }) {
  return (
    <View pointerEvents="none" style={{ height, borderRadius: 20, overflow: "hidden", backgroundColor: palette.line }}>
      <MapView
        style={{ flex: 1 }}
        liteMode={Platform.OS === "android"}
        toolbarEnabled={false}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        initialRegion={{ latitude, longitude, latitudeDelta: 0.008, longitudeDelta: 0.008 }}
      >
        <Marker coordinate={{ latitude, longitude }} title={title} pinColor={palette.brand} />
      </MapView>
    </View>
  );
}
