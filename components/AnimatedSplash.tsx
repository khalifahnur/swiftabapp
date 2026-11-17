import { Image } from "expo-image";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const TEAL = "#008080";
/** Long enough for the logo to land, short enough not to feel like waiting. */
const MIN_VISIBLE = 1500;

/**
 * Picks up where the system splash leaves off: the same logo on the same
 * colour, which then springs in, breathes while the app gets ready, and lifts
 * away. Draws over the app, so the first screen is ready underneath.
 */
export default function AnimatedSplash({ ready }: { ready: boolean }) {
  const [gone, setGone] = useState(false);
  const [elapsed, setElapsed] = useState(false);

  const logo = useSharedValue(0);
  const breathe = useSharedValue(0);
  const ring = useSharedValue(0);
  const word = useSharedValue(0);
  const exit = useSharedValue(0);

  useEffect(() => {
    logo.value = withSpring(1, { damping: 9, stiffness: 110, mass: 0.9 });
    ring.value = withDelay(250, withRepeat(withTiming(1, { duration: 1500, easing: Easing.out(Easing.quad) }), -1, false));
    breathe.value = withDelay(
      700,
      withRepeat(withSequence(withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }), withTiming(0, { duration: 900, easing: Easing.inOut(Easing.quad) })), -1),
    );
    word.value = withDelay(450, withTiming(1, { duration: 500 }));
    const timer = setTimeout(() => setElapsed(true), MIN_VISIBLE);
    return () => clearTimeout(timer);
  }, [logo, ring, breathe, word]);

  useEffect(() => {
    if (!ready || !elapsed) return;
    exit.value = withTiming(1, { duration: 420, easing: Easing.in(Easing.cubic) }, (finished) => {
      if (finished) runOnJS(setGone)(true);
    });
  }, [ready, elapsed, exit]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: 1 - exit.value }));
  const logoStyle = useAnimatedStyle(() => ({
    opacity: Math.min(1, logo.value * 1.4),
    transform: [{ scale: (0.55 + 0.45 * logo.value) * (1 + 0.04 * breathe.value) * (1 + 0.5 * exit.value) }, { rotate: `${(1 - logo.value) * -18}deg` }],
  }));
  const ringStyle = useAnimatedStyle(() => ({ opacity: 0.28 * (1 - ring.value), transform: [{ scale: 0.7 + ring.value * 0.9 }] }));
  const wordStyle = useAnimatedStyle(() => ({ opacity: word.value * (1 - exit.value), transform: [{ translateY: 10 * (1 - word.value) }] }));

  if (gone) return null;

  return (
    <Animated.View
      pointerEvents={ready && elapsed ? "none" : "auto"}
      // The system splash stays up until this view has been drawn, so there is no flash between them.
      onLayout={() => SplashScreen.hideAsync().catch(() => undefined)}
      style={[StyleSheet.absoluteFill, styles.overlay, overlayStyle]}
    >
      <View style={styles.centre}>
        <Animated.View style={[styles.ring, ringStyle]} />
        <Animated.View style={logoStyle}>
          <Image source={require("../assets/images/adaptive-icon.png")} style={styles.logo} contentFit="contain" />
        </Animated.View>
      </View>
      <Animated.View style={[styles.word, wordStyle]}>
        <Text style={styles.name}>swiftab</Text>
        <Text style={styles.tag}>Your table, ready when you are</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: { backgroundColor: TEAL, zIndex: 10000, elevation: 50, alignItems: "center", justifyContent: "center" },
  centre: { width: 240, height: 240, alignItems: "center", justifyContent: "center" },
  ring: { position: "absolute", width: 190, height: 190, borderRadius: 95, borderWidth: 2, borderColor: "#FFFFFF" },
  logo: { width: 200, height: 200 },
  word: { position: "absolute", bottom: 72, alignItems: "center" },
  name: { color: "#FFFFFF", fontSize: 24, fontWeight: "800", letterSpacing: 0.4 },
  tag: { color: "rgba(255,255,255,0.78)", fontSize: 13, marginTop: 4 },
});
