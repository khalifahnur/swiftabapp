import { Icon } from "@/components/ui/Icon";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import { LayoutChangeEvent, Platform, Pressable, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { palette } from "@/constants/theme";

import { Txt } from "./ui/Txt";

const HEIGHT = 68;
const KNOB = 56;
const PAD = 6;

/** One chevron of the three that ripple toward the end of the track. */
function Chevron({ index, pulse }: { index: number; pulse: SharedValue<number> }) {
  const style = useAnimatedStyle(() => {
    const phase = (pulse.value + 1 - index / 3) % 1;
    return { opacity: 0.25 + 0.75 * Math.max(0, 1 - Math.abs(phase - 0.5) * 2.4) };
  });
  return (
    <Animated.View style={[style, { marginLeft: index === 0 ? 0 : -9 }]}>
      <Icon name="chevron-forward" size={20} color={palette.white} />
    </Animated.View>
  );
}

/**
 * A pill the person drags (or taps) to continue. Dragging the knob to the far
 * end, or activating it with a screen reader, calls `onComplete` once.
 */
export default function SwipeToStart({ label, onComplete }: { label: string; onComplete: () => void }) {
  const [trackWidth, setTrackWidth] = useState(0);
  const travel = Math.max(0, trackWidth - KNOB - PAD * 2);
  const x = useSharedValue(0);
  const startX = useSharedValue(0);
  const pulse = useSharedValue(0);
  const done = useSharedValue(false);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 1500, easing: Easing.linear }), -1, false);
  }, [pulse]);

  const finish = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    }
    onComplete();
  };

  const complete = () => {
    "worklet";
    if (done.value) return;
    done.value = true;
    x.value = withTiming(travel, { duration: 220 }, (finished) => {
      if (finished) runOnJS(finish)();
    });
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-8, 8])
    .onStart(() => {
      startX.value = x.value;
    })
    .onUpdate((event) => {
      if (done.value) return;
      x.value = Math.min(travel, Math.max(0, startX.value + event.translationX));
    })
    .onEnd(() => {
      if (done.value) return;
      if (x.value > travel * 0.72) complete();
      else x.value = withSpring(0, { damping: 16, stiffness: 180 });
    });

  const knobStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  const labelStyle = useAnimatedStyle(() => ({
    opacity: travel > 0 ? interpolate(x.value, [0, travel * 0.6], [1, 0], "clamp") : 1,
  }));
  const fillStyle = useAnimatedStyle(() => ({ width: x.value + KNOB + PAD * 2 }));

  return (
    <View
      onLayout={(event: LayoutChangeEvent) => setTrackWidth(event.nativeEvent.layout.width)}
      style={{
        height: HEIGHT,
        borderRadius: HEIGHT / 2,
        backgroundColor: "rgba(255,255,255,0.12)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.18)",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={[
          fillStyle,
          { position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: HEIGHT / 2, backgroundColor: "rgba(255,255,255,0.14)" },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          labelStyle,
          { position: "absolute", left: KNOB + PAD * 2, right: 22, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
        ]}
      >
        <Txt w="semibold" size={17} color={palette.white} style={{ marginLeft: 14 }}>
          {label}
        </Txt>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {[0, 1, 2].map((i) => (
            <Chevron key={i} index={i} pulse={pulse} />
          ))}
        </View>
      </Animated.View>
      <GestureDetector gesture={pan}>
        <Animated.View style={[knobStyle, { position: "absolute", left: PAD }]}>
          <Pressable
            testID="swipe-to-start"
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityHint="Swipe right or double tap to continue"
            onPress={() => complete()}
            style={{
              width: KNOB,
              height: KNOB,
              borderRadius: KNOB / 2,
              backgroundColor: palette.white,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="arrow-forward" size={24} color={palette.pine} />
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
