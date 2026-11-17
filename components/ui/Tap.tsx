import React, { useState } from "react";
import { Pressable, PressableProps, StyleProp, ViewStyle } from "react-native";

/**
 * A pressable that dims while held. Styles are plain objects on purpose:
 * NativeWind drops a function passed to Pressable's `style` on phones, which
 * leaves the control with no size, colour or position.
 */
export function Tap({
  style,
  pressedStyle = { opacity: 0.82 },
  onPressIn,
  onPressOut,
  children,
  ...rest
}: Omit<PressableProps, "style" | "children"> & {
  style?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      {...rest}
      onPressIn={(event) => {
        setPressed(true);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        setPressed(false);
        onPressOut?.(event);
      }}
      style={[style, pressed && pressedStyle]}
    >
      {children}
    </Pressable>
  );
}
