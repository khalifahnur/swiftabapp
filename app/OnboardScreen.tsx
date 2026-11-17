import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Pressable, useWindowDimensions, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import SwipeToStart from "@/components/SwipeToStart";
import TableArt from "@/components/TableArt";
import { Txt } from "@/components/ui/Txt";
import { palette } from "@/constants/theme";
import { useAuthStore } from "@/lib/authStore";

const POINTS = [
  "Pick your exact table",
  "Order before you arrive",
  "Pay from your phone",
];

export default function OnboardScreen() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);

  const float = useSharedValue(0);
  const enter = useSharedValue(0);

  useEffect(() => {
    enter.value = withDelay(
      120,
      withTiming(1, { duration: 700, easing: Easing.out(Easing.cubic) }),
    );
    float.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 2600, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
    );
  }, [enter, float]);

  const artStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [
      { translateY: -8 * float.value },
      { scale: 0.92 + 0.08 * enter.value },
    ],
  }));
  const textStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ translateY: 18 * (1 - enter.value) }],
  }));

  const compact = height < 700;
  const artSize = Math.min(320, Math.max(210, height * 0.36));

  return (
    <View style={{ flex: 1, backgroundColor: palette.pine }}>
      <StatusBar style="light" />

      {/* Depth: two large soft circles behind the content. */}
      <View
        style={{
          position: "absolute",
          top: -120,
          right: -110,
          width: 340,
          height: 340,
          borderRadius: 170,
          backgroundColor: "#0F4A44",
        }}
      />
      <View
        style={{
          position: "absolute",
          top: height * 0.34,
          left: -150,
          width: 300,
          height: 300,
          borderRadius: 150,
          backgroundColor: "#093230",
        }}
      />

      <View
        style={{
          flex: 1,
          paddingTop: insets.top + 12,
          paddingBottom: Math.max(insets.bottom, 20) + 12,
          paddingHorizontal: 24,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Txt
            w="extrabold"
            size={20}
            color={palette.white}
            style={{ letterSpacing: 0.3 }}
          >
            swiftab
          </Txt>
          <Pressable
            accessibilityRole="button"
            hitSlop={10}
            onPress={completeOnboarding}
          >
            <Txt w="semibold" size={14} color="rgba(255,255,255,0.72)">
              Skip
            </Txt>
          </Pressable>
        </View>

        <Animated.View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <TableArt size={artSize} />
        </Animated.View>

        <Animated.View style={textStyle}>
          <Txt
            w="extrabold"
            size={compact ? 34 : 40}
            color={palette.white}
            style={{ lineHeight: compact ? 40 : 46, letterSpacing: -0.6 }}
          >
            Your table,{"\n"}ready when{"\n"}you are.
          </Txt>
          <Txt
            size={15}
            color="rgba(255,255,255,0.74)"
            style={{ marginTop: 12, maxWidth: 320 }}
          >
            Book a seat at the restaurants you love and skip the wait at the
            door.
          </Txt>

          <SwipeToStart label="Get started" onComplete={completeOnboarding} />
        </Animated.View>
      </View>
    </View>
  );
}
