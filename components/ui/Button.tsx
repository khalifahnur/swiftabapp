import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { ActivityIndicator, Platform, Pressable, StyleProp, View, ViewStyle } from "react-native";

import { palette, radius } from "@/constants/theme";

import { Txt } from "./Txt";

type Variant = "primary" | "brand" | "soft" | "outline" | "danger" | "ghost";

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconRight?: keyof typeof Ionicons.glyphMap;
  size?: "md" | "lg";
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const tones: Record<Variant, { bg: string; fg: string; border?: string }> = {
  primary: { bg: palette.pine, fg: palette.white },
  brand: { bg: palette.brand, fg: palette.white },
  soft: { bg: palette.brandTint, fg: palette.brandDark },
  outline: { bg: palette.surface, fg: palette.ink, border: palette.line },
  danger: { bg: palette.dangerTint, fg: palette.danger },
  ghost: { bg: "transparent", fg: palette.brandDark },
};

export const tapFeedback = () => {
  if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => undefined);
};

export function Button({
  label,
  onPress,
  variant = "primary",
  loading,
  disabled,
  icon,
  iconRight,
  size = "lg",
  style,
  testID,
}: ButtonProps) {
  const tone = tones[variant];
  const inactive = disabled || loading;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: Boolean(inactive), busy: Boolean(loading) }}
      disabled={inactive}
      onPress={() => {
        tapFeedback();
        onPress?.();
      }}
      style={({ pressed }) => [
        {
          height: size === "lg" ? 56 : 46,
          borderRadius: radius.pill,
          backgroundColor: tone.bg,
          borderWidth: tone.border ? 1 : 0,
          borderColor: tone.border,
          paddingHorizontal: 22,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          opacity: disabled ? 0.45 : pressed ? 0.88 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={tone.fg} />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {icon && <Ionicons name={icon} size={18} color={tone.fg} />}
          <Txt w="semibold" size={size === "lg" ? 16 : 14} color={tone.fg}>
            {label}
          </Txt>
          {iconRight && <Ionicons name={iconRight} size={18} color={tone.fg} />}
        </View>
      )}
    </Pressable>
  );
}

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  label: string;
  size?: number;
  color?: string;
  background?: string;
  bordered?: boolean;
  badge?: number | boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** A round button holding one icon. `label` is read out by screen readers. */
export function IconButton({
  icon,
  onPress,
  label,
  size = 44,
  color = palette.ink,
  background = palette.surface,
  bordered,
  badge,
  style,
  testID,
}: IconButtonProps) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      onPress={() => {
        tapFeedback();
        onPress?.();
      }}
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: background,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: bordered ? 1 : 0,
          borderColor: palette.line,
          opacity: pressed ? 0.75 : 1,
        },
        style,
      ]}
    >
      <Ionicons name={icon} size={Math.round(size * 0.46)} color={color} />
      {Boolean(badge) && (
        <View
          style={{
            position: "absolute",
            top: 2,
            right: 2,
            minWidth: typeof badge === "number" ? 18 : 10,
            height: typeof badge === "number" ? 18 : 10,
            borderRadius: 9,
            backgroundColor: palette.danger,
            borderWidth: 2,
            borderColor: background,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: typeof badge === "number" ? 3 : 0,
          }}
        >
          {typeof badge === "number" && (
            <Txt w="bold" size={9} color={palette.white} style={{ lineHeight: 12 }}>
              {badge > 9 ? "9+" : badge}
            </Txt>
          )}
        </View>
      )}
    </Pressable>
  );
}
