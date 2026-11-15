import React from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { palette } from "@/constants/theme";

import { IconButton } from "./Button";
import { Txt } from "./Txt";

/** A panel that slides up from the bottom. Tapping outside or the X closes it. */
export function Sheet({
  visible,
  onClose,
  title,
  subtitle,
  children,
  footer,
  dismissable = true,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  dismissable?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const close = () => dismissable && onClose();
  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={close}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <Pressable accessibilityLabel="Close" onPress={close} style={{ flex: 1, backgroundColor: "rgba(8,26,24,0.5)" }} />
        <View
          style={{
            backgroundColor: palette.surface,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingBottom: Math.max(insets.bottom, 16) + 8,
            maxHeight: "86%",
            marginTop: -28,
          }}
        >
          <View style={{ alignItems: "center", paddingTop: 10 }}>
            <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: palette.line }} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 22, paddingTop: 14, paddingBottom: 6 }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Txt w="bold" size={19}>
                {title}
              </Txt>
              {subtitle ? (
                <Txt size={13.5} color={palette.muted} style={{ marginTop: 4 }}>
                  {subtitle}
                </Txt>
              ) : null}
            </View>
            {dismissable && <IconButton icon="close" label="Close" size={36} background={palette.canvas} onPress={onClose} />}
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 22, paddingTop: 10, paddingBottom: 8 }}
          >
            {children}
          </ScrollView>
          {footer ? <View style={{ paddingHorizontal: 22, paddingTop: 10 }}>{footer}</View> : null}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

/** A centred yes/no question. */
export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = "Keep it",
  destructive,
  busy,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onCancel}>
      <View style={{ flex: 1, backgroundColor: "rgba(8,26,24,0.5)", justifyContent: "center", padding: 28 }}>
        <View style={{ backgroundColor: palette.surface, borderRadius: 24, padding: 22 }}>
          <Txt w="bold" size={18}>
            {title}
          </Txt>
          <Txt size={14} color={palette.body} style={{ marginTop: 8 }}>
            {message}
          </Txt>
          <View style={{ flexDirection: "row", gap: 10, marginTop: 22 }}>
            <Pressable
              accessibilityRole="button"
              disabled={busy}
              onPress={onCancel}
              style={{ flex: 1, height: 48, borderRadius: 24, borderWidth: 1, borderColor: palette.line, alignItems: "center", justifyContent: "center" }}
            >
              <Txt w="semibold">{cancelLabel}</Txt>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={busy}
              onPress={onConfirm}
              style={{
                flex: 1,
                height: 48,
                borderRadius: 24,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: destructive ? palette.danger : palette.pine,
                opacity: busy ? 0.6 : 1,
              }}
            >
              <Txt w="semibold" color={palette.white}>
                {busy ? "Please wait…" : confirmLabel}
              </Txt>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
