import { Ionicons } from "@expo/vector-icons";
import { Image, ImageProps } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleProp, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { palette, radius } from "@/constants/theme";

import { IconButton, tapFeedback } from "./Button";
import { Txt } from "./Txt";

/** Title bar for pushed screens: back button, centred title, optional action. */
export function ScreenHeader({
  title,
  right,
  onBack,
  transparent,
}: {
  title?: string;
  right?: React.ReactNode;
  onBack?: () => void;
  transparent?: boolean;
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top + 8,
        paddingHorizontal: 20,
        paddingBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: transparent ? "transparent" : palette.canvas,
      }}
    >
      <IconButton
        icon="chevron-back"
        label="Go back"
        bordered
        onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace("/(tabs)")))}
      />
      <View style={{ flex: 1, alignItems: "center", paddingHorizontal: 8 }}>
        {title ? (
          <Txt w="bold" size={17} numberOfLines={1}>
            {title}
          </Txt>
        ) : null}
      </View>
      <View style={{ minWidth: 44, alignItems: "flex-end" }}>{right}</View>
    </View>
  );
}

export function Chip({
  label,
  selected,
  onPress,
  icon,
  style,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: Boolean(selected) }}
      accessibilityLabel={label}
      onPress={() => {
        tapFeedback();
        onPress?.();
      }}
      style={[
        {
          height: 40,
          paddingHorizontal: 16,
          borderRadius: radius.pill,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          backgroundColor: selected ? palette.pine : palette.surface,
          borderWidth: 1,
          borderColor: selected ? palette.pine : palette.line,
        },
        style,
      ]}
    >
      {icon && <Ionicons name={icon} size={15} color={selected ? palette.white : palette.body} />}
      <Txt w="semibold" size={13} color={selected ? palette.white : palette.body}>
        {label}
      </Txt>
    </Pressable>
  );
}

/** A small rounded label, for statuses and tags. */
export function Pill({ label, fg, bg, icon }: { label: string; fg: string; bg: string; icon?: keyof typeof Ionicons.glyphMap }) {
  return (
    <View
      style={{
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: bg,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: radius.pill,
      }}
    >
      {icon && <Ionicons name={icon} size={12} color={fg} />}
      <Txt w="semibold" size={11.5} color={fg} style={{ lineHeight: 15 }}>
        {label}
      </Txt>
    </View>
  );
}

export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  action?: React.ReactNode;
}) {
  return (
    <View style={{ alignItems: "center", paddingHorizontal: 36, paddingVertical: 48 }}>
      <View
        style={{
          width: 76,
          height: 76,
          borderRadius: 38,
          backgroundColor: palette.brandTint,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
        }}
      >
        <Ionicons name={icon} size={32} color={palette.brand} />
      </View>
      <Txt w="bold" size={18} center>
        {title}
      </Txt>
      {message ? (
        <Txt size={14} color={palette.muted} center style={{ marginTop: 6 }}>
          {message}
        </Txt>
      ) : null}
      {action ? <View style={{ marginTop: 22, alignSelf: "stretch" }}>{action}</View> : null}
    </View>
  );
}

/** A grey block that pulses while content loads. */
export function Skeleton({ height, width, round = 14, style }: { height: number; width?: number | `${number}%`; round?: number; style?: StyleProp<ViewStyle> }) {
  const pulse = useRef(new Animated.Value(0.55)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.55, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  return (
    <Animated.View
      style={[{ height, width: width ?? "100%", borderRadius: round, backgroundColor: "#E3E9E7", opacity: pulse }, style]}
    />
  );
}

/** A remote picture that fades in, with a neutral tile while loading or if it fails. */
export function Picture({
  uri,
  style,
  icon = "restaurant-outline",
  ...rest
}: Omit<ImageProps, "source"> & { uri?: string | null; icon?: keyof typeof Ionicons.glyphMap }) {
  const [failed, setFailed] = useState(false);
  if (!uri || failed) {
    return (
      <View style={[{ backgroundColor: "#E3E9E7", alignItems: "center", justifyContent: "center" }, style as StyleProp<ViewStyle>]}>
        <Ionicons name={icon} size={24} color={palette.faint} />
      </View>
    );
  }
  return (
    <Image
      source={{ uri }}
      contentFit="cover"
      transition={200}
      cachePolicy="memory-disk"
      onError={() => setFailed(true)}
      style={[{ backgroundColor: "#E3E9E7" }, style]}
      {...rest}
    />
  );
}

export function Stars({ value, size = 14, onChange }: { value: number; size?: number; onChange?: (value: number) => void }) {
  return (
    <View style={{ flexDirection: "row", gap: onChange ? 8 : 2 }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const name = value >= star ? "star" : value >= star - 0.5 ? "star-half" : "star-outline";
        const icon = <Ionicons name={name} size={size} color={value >= star - 0.5 ? palette.amber : palette.faint} />;
        if (!onChange) return <View key={star}>{icon}</View>;
        return (
          <Pressable
            key={star}
            accessibilityRole="button"
            accessibilityLabel={`${star} star${star === 1 ? "" : "s"}`}
            hitSlop={6}
            onPress={() => {
              tapFeedback();
              onChange(star);
            }}
          >
            {icon}
          </Pressable>
        );
      })}
    </View>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string; count?: number }[];
  value: T;
  onChange: (key: T) => void;
}) {
  return (
    <View style={{ flexDirection: "row", backgroundColor: "#E9EEEC", borderRadius: radius.pill, padding: 4 }}>
      {options.map((option) => {
        const active = option.key === value;
        return (
          <Pressable
            key={option.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => {
              tapFeedback();
              onChange(option.key);
            }}
            style={{
              flex: 1,
              height: 40,
              borderRadius: radius.pill,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 6,
              backgroundColor: active ? palette.pine : "transparent",
            }}
          >
            <Txt w="semibold" size={13} color={active ? palette.white : palette.body}>
              {option.label}
            </Txt>
            {option.count ? (
              <View
                style={{
                  minWidth: 18,
                  height: 18,
                  borderRadius: 9,
                  paddingHorizontal: 5,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: active ? "rgba(255,255,255,0.22)" : palette.surface,
                }}
              >
                <Txt w="bold" size={10} color={active ? palette.white : palette.body} style={{ lineHeight: 13 }}>
                  {option.count}
                </Txt>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

export function Stepper({
  value,
  onMinus,
  onPlus,
  min = 0,
  max = 99,
  compact,
}: {
  value: number;
  onMinus: () => void;
  onPlus: () => void;
  min?: number;
  max?: number;
  compact?: boolean;
}) {
  const size = compact ? 30 : 38;
  const button = (icon: "remove" | "add", onPress: () => void, disabled: boolean, filled: boolean, label: string) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      hitSlop={6}
      onPress={() => {
        tapFeedback();
        onPress();
      }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: filled ? palette.pine : palette.surface,
        borderWidth: filled ? 0 : 1,
        borderColor: palette.line,
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <Ionicons name={icon} size={compact ? 16 : 18} color={filled ? palette.white : palette.ink} />
    </Pressable>
  );
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: compact ? 8 : 12 }}>
      {button("remove", onMinus, value <= min, false, "Decrease")}
      <Txt w="bold" size={compact ? 14 : 17} style={{ minWidth: compact ? 16 : 22, textAlign: "center" }}>
        {value}
      </Txt>
      {button("add", onPlus, value >= max, true, "Increase")}
    </View>
  );
}

/** A white rounded card. */
export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return (
    <View
      style={[
        { backgroundColor: palette.surface, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: palette.line },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <EmptyState
      icon="cloud-offline-outline"
      title="We could not load this"
      message={message}
      action={
        onRetry ? (
          <Pressable
            accessibilityRole="button"
            onPress={onRetry}
            style={{ alignSelf: "center", paddingHorizontal: 22, height: 44, borderRadius: 22, backgroundColor: palette.pine, justifyContent: "center" }}
          >
            <Txt w="semibold" color={palette.white}>
              Try again
            </Txt>
          </Pressable>
        ) : undefined
      }
    />
  );
}
