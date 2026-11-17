import { Icon, type IconName } from "@/components/ui/Icon";
import React, { useState } from "react";
import { Pressable, TextInput, TextInputProps, View } from "react-native";

import { fonts, palette, radius } from "@/constants/theme";

import { Txt } from "./Txt";

interface FieldProps extends TextInputProps {
  label?: string;
  error?: string | false | null;
  icon?: IconName;
  /** Adds a show/hide toggle. */
  password?: boolean;
  hint?: string;
  /** Replaces the text input, for custom controls that share the frame. */
  children?: React.ReactNode;
}

/** A labelled text input with room for an icon and an error line. */
export function Field({ label, error, icon, password, hint, children, style, ...input }: FieldProps) {
  const [hidden, setHidden] = useState(Boolean(password));
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ marginBottom: 16 }}>
      {label ? (
        <Txt w="semibold" size={13} color={palette.body} style={{ marginBottom: 7 }}>
          {label}
        </Txt>
      ) : null}
      <View
        style={{
          minHeight: 48,
          borderRadius: radius.md,
          backgroundColor: palette.surface,
          borderWidth: 1.5,
          borderColor: error ? palette.danger : focused ? palette.brand : palette.line,
          flexDirection: "row",
          alignItems: input.multiline ? "flex-start" : "center",
          paddingHorizontal: 14,
        }}
      >
        {icon && <Icon name={icon} size={18} color={palette.muted} style={{ marginRight: 10, marginTop: input.multiline ? 16 : 0 }} />}
        {children ?? (
          <TextInput
            placeholderTextColor={palette.faint}
            autoCorrect={false}
            {...input}
            secureTextEntry={hidden}
            onFocus={(e) => {
              setFocused(true);
              input.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              input.onBlur?.(e);
            }}
            style={[
              {
                flex: 1,
                fontFamily: fonts.medium,
                fontSize: 14,
                color: palette.ink,
                paddingVertical: input.multiline ? 14 : 0,
                minHeight: input.multiline ? 88 : 44,
                textAlignVertical: input.multiline ? "top" : "center",
              },
              style,
            ]}
          />
        )}
        {password && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? "Show password" : "Hide password"}
            hitSlop={10}
            onPress={() => setHidden((v) => !v)}
          >
            <Icon name={hidden ? "eye-off-outline" : "eye-outline"} size={20} color={palette.muted} />
          </Pressable>
        )}
      </View>
      {error ? (
        <Txt size={12} color={palette.danger} style={{ marginTop: 5, marginLeft: 2 }}>
          {error}
        </Txt>
      ) : hint ? (
        <Txt size={12} color={palette.muted} style={{ marginTop: 5, marginLeft: 2 }}>
          {hint}
        </Txt>
      ) : null}
    </View>
  );
}
