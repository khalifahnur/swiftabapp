import { Icon } from "@/components/ui/Icon";
import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming } from "react-native-reanimated";

import { palette } from "@/constants/theme";

/** A tick that pops in, for moments when something has gone through. */
export default function SuccessMark({ size = 96 }: { size?: number }) {
  const pop = useSharedValue(0);
  const ring = useSharedValue(0);

  useEffect(() => {
    pop.value = withSpring(1, { damping: 9, stiffness: 140 });
    ring.value = withDelay(150, withTiming(1, { duration: 700 }));
  }, [pop, ring]);

  const circle = useAnimatedStyle(() => ({ transform: [{ scale: pop.value }] }));
  const halo = useAnimatedStyle(() => ({ opacity: 0.35 * (1 - ring.value), transform: [{ scale: 1 + ring.value * 0.7 }] }));

  return (
    <View style={{ width: size * 1.7, height: size * 1.7, alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={[{ position: "absolute", width: size, height: size, borderRadius: size / 2, backgroundColor: palette.success }, halo]} />
      <Animated.View
        style={[
          { width: size, height: size, borderRadius: size / 2, backgroundColor: palette.success, alignItems: "center", justifyContent: "center" },
          circle,
        ]}
      >
        <Icon name="checkmark" size={size * 0.56} color={palette.white} />
      </Animated.View>
    </View>
  );
}
