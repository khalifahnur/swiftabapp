import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IconButton } from "@/components/ui/Button";
import { Txt } from "@/components/ui/Txt";
import { palette } from "@/constants/theme";

/** The frame every sign-in screen shares: green header, white sheet with the form. */
export default function AuthShell({
  title,
  subtitle,
  back,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  back?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <View style={{ flex: 1, backgroundColor: palette.pine }}>
      <StatusBar style="light" />
      <View style={{ position: "absolute", top: -90, right: -90, width: 260, height: 260, borderRadius: 130, backgroundColor: "#0F4A44" }} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={{ paddingTop: insets.top + 14, paddingHorizontal: 24, paddingBottom: 26 }}>
            <View style={{ height: 44, justifyContent: "center" }}>
              {back ? (
                <IconButton
                  icon="chevron-back"
                  label="Go back"
                  background="rgba(255,255,255,0.14)"
                  color={palette.white}
                  onPress={() => (router.canGoBack() ? router.back() : router.replace("/(auth)"))}
                />
              ) : (
                <Txt w="extrabold" size={20} color={palette.white}>
                  swiftab
                </Txt>
              )}
            </View>
            <Txt w="extrabold" size={30} color={palette.white} style={{ marginTop: 22, lineHeight: 36, letterSpacing: -0.4 }}>
              {title}
            </Txt>
            <Txt size={14.5} color="rgba(255,255,255,0.74)" style={{ marginTop: 8 }}>
              {subtitle}
            </Txt>
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: palette.canvas,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              paddingHorizontal: 24,
              paddingTop: 28,
              paddingBottom: Math.max(insets.bottom, 16) + 16,
            }}
          >
            {children}
            {footer ? <View style={{ marginTop: "auto", paddingTop: 24, alignItems: "center" }}>{footer}</View> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
