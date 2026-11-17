import { Icon } from "@/components/ui/Icon";
import React from "react";
import { View } from "react-native";

import { Txt } from "@/components/ui/Txt";
import { palette } from "@/constants/theme";

/** Maps are native-only; the web preview shows the pin on a plain tile. */
export default function MiniMap({ title, height = 150 }: { latitude: number; longitude: number; title?: string; height?: number }) {
  return (
    <View style={{ height, borderRadius: 20, backgroundColor: palette.mint, alignItems: "center", justifyContent: "center" }}>
      <Icon name="location" size={30} color={palette.brand} />
      {title ? (
        <Txt w="semibold" size={13} color={palette.pine} style={{ marginTop: 4 }}>
          {title}
        </Txt>
      ) : null}
    </View>
  );
}
