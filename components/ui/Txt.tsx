import React from "react";
import { Text, TextProps } from "react-native";

import { fonts, FontWeight, palette } from "@/constants/theme";

export interface TxtProps extends TextProps {
  /** Font weight; each maps to its own Plus Jakarta Sans file. */
  w?: FontWeight;
  size?: number;
  color?: string;
  center?: boolean;
}

/** Text in the app typeface. Use instead of <Text> so weights render the same on every device. */
export function Txt({ w = "regular", size = 14, color = palette.ink, center, style, ...rest }: TxtProps) {
  return (
    <Text
      allowFontScaling
      maxFontSizeMultiplier={1.3}
      {...rest}
      style={[
        { fontFamily: fonts[w], fontSize: size, color, lineHeight: Math.round(size * 1.38) },
        center && { textAlign: "center" },
        style,
      ]}
    />
  );
}
