import qrcode from "qrcode-generator";
import React, { useMemo } from "react";
import Svg, { Path, Rect } from "react-native-svg";

/** A QR code drawn as one SVG path, so it stays sharp and cheap to render. */
export function QrCode({ value, size = 120, color = "#0B3B36", background = "#FFFFFF" }: { value: string; size?: number; color?: string; background?: string }) {
  const { path, count } = useMemo(() => {
    const qr = qrcode(0, "M");
    qr.addData(value);
    qr.make();
    const n = qr.getModuleCount();
    let d = "";
    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        if (qr.isDark(row, col)) d += `M${col} ${row}h1v1h-1z`;
      }
    }
    return { path: d, count: n };
  }, [value]);

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${count} ${count}`} accessibilityLabel="QR code">
      <Rect width={count} height={count} fill={background} />
      <Path d={path} fill={color} />
    </Svg>
  );
}
