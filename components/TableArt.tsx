import React from "react";
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";

export default function TableArt({ size = 300 }: { size?: number }) {
  const chairs = [0, 60, 120, 180, 240, 300];
  return (
    <Svg width={size} height={size} viewBox="0 0 300 300">
      <Defs>
        <LinearGradient id="top" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#E4F1EE" />
        </LinearGradient>
        <LinearGradient id="chair" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#3FB8A5" />
          <Stop offset="1" stopColor="#1F8F7F" />
        </LinearGradient>
      </Defs>

      <Circle cx="150" cy="150" r="146" fill="#FFFFFF" opacity={0.04} />
      <Circle cx="150" cy="150" r="118" fill="#FFFFFF" opacity={0.05} />

      {chairs.map((angle) => (
        <G key={angle} rotation={angle} origin="150, 150">
          <Rect
            x="126"
            y="34"
            width="48"
            height="26"
            rx="12"
            fill="url(#chair)"
          />
          <Rect x="132" y="28" width="36" height="9" rx="4.5" fill="#7FD8C8" />
        </G>
      ))}

      {/* Table top. */}
      <Circle cx="150" cy="154" r="84" fill="#062623" opacity={0.35} />
      <Circle cx="150" cy="150" r="84" fill="url(#top)" />
      <Circle
        cx="150"
        cy="150"
        r="84"
        fill="none"
        stroke="#CFE5E0"
        strokeWidth="2"
      />

      {/* Place settings. */}
      {[30, 150, 270].map((angle) => (
        <G key={angle} rotation={angle} origin="150, 150">
          <Circle
            cx="150"
            cy="96"
            r="19"
            fill="#FFFFFF"
            stroke="#CFE5E0"
            strokeWidth="2"
          />
          <Circle cx="150" cy="96" r="11" fill="#F0F7F5" />
          <Rect x="122" y="84" width="3" height="24" rx="1.5" fill="#9CC9C0" />
          <Rect x="175" y="84" width="3" height="24" rx="1.5" fill="#9CC9C0" />
        </G>
      ))}

      {/* The "reserved" marker in the middle. */}
      <Circle cx="150" cy="150" r="27" fill="#0B3B36" />
      <Path
        d="M139 150.5l7.5 7.5L162 142.5"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* A few sparks. */}
      <Circle cx="252" cy="62" r="5" fill="#F5A623" />
      <Circle cx="44" cy="232" r="4" fill="#7FD8C8" />
      <Circle cx="266" cy="214" r="3" fill="#FFFFFF" opacity={0.7} />
    </Svg>
  );
}
