import { Stack } from "expo-router";
import React from "react";

import { palette } from "@/constants/theme";

export default function ScreensLayout() {
  return <Stack screenOptions={{ headerShown: false, animation: "slide_from_right", contentStyle: { backgroundColor: palette.canvas } }} />;
}
