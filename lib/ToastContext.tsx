import { Icon, type IconName } from "@/components/ui/Icon";
import * as Haptics from "expo-haptics";
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Animated, Platform, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Txt } from "@/components/ui/Txt";
import { palette } from "@/constants/theme";

export type ToastType = "success" | "error" | "info";

export interface ToastOptions {
  /** A short button shown on the right, for example "Track". */
  actionLabel?: string;
  onAction?: () => void;
  /** Milliseconds on screen. */
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, options?: ToastOptions) => void;
  hideToast: () => void;
}

interface ToastState extends ToastOptions {
  id: number;
  type: ToastType;
  message: string;
}

type Listener = (toast: Omit<ToastState, "id">) => void;
let listener: Listener | null = null;

/**
 * Shows a toast from anywhere, including code that is not a component
 * (notification handlers, request callbacks).
 */
export const toast = {
  show(type: ToastType, message: string, options?: ToastOptions) {
    listener?.({ type, message, ...options });
  },
  success: (message: string, options?: ToastOptions) => toast.show("success", message, options),
  error: (message: string, options?: ToastOptions) => toast.show("error", message, options),
  info: (message: string, options?: ToastOptions) => toast.show("info", message, options),
};

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};

const LOOK: Record<ToastType, { icon: IconName; tint: string }> = {
  success: { icon: "checkmark-circle", tint: "#4ADE9B" },
  error: { icon: "alert-circle", tint: "#FF8A8A" },
  info: { icon: "notifications", tint: "#8FD3FF" },
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets();
  const [current, setCurrent] = useState<ToastState | null>(null);
  const progress = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const counter = useRef(0);

  const hideToast = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    Animated.timing(progress, { toValue: 0, duration: 180, useNativeDriver: true }).start(({ finished }) => {
      if (finished) setCurrent(null);
    });
  }, [progress]);

  const showToast = useCallback(
    (type: ToastType, message: string, options?: ToastOptions) => {
      if (!message) return;
      if (timer.current) clearTimeout(timer.current);
      counter.current += 1;
      setCurrent({ id: counter.current, type, message, ...options });
      progress.stopAnimation();
      Animated.spring(progress, { toValue: 1, useNativeDriver: true, speed: 18, bounciness: 6 }).start();
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(
          type === "error" ? Haptics.NotificationFeedbackType.Error : Haptics.NotificationFeedbackType.Success,
        ).catch(() => undefined);
      }
      timer.current = setTimeout(hideToast, options?.duration ?? (options?.actionLabel ? 6000 : 3800));
    },
    [hideToast, progress],
  );

  useEffect(() => {
    listener = ({ type, message, ...options }) => showToast(type, message, options);
    return () => {
      listener = null;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [showToast]);

  const look = current ? LOOK[current.type] : LOOK.info;

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {current && (
        <Animated.View
          pointerEvents="box-none"
          style={{
            position: "absolute",
            top: insets.top + 10,
            left: 16,
            right: 16,
            zIndex: 9999,
            elevation: 30,
            opacity: progress,
            transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [-24, 0] }) }],
          }}
        >
          <Pressable
            testID="toast"
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
            onPress={hideToast}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#122826",
              borderRadius: 18,
              paddingVertical: 13,
              paddingLeft: 14,
              paddingRight: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.22,
              shadowRadius: 16,
              elevation: 12,
            }}
          >
            <Icon name={look.icon} size={22} color={look.tint} />
            <Txt w="medium" size={14} color={palette.white} style={{ flex: 1, marginHorizontal: 10 }}>
              {current.message}
            </Txt>
            {current.actionLabel ? (
              <Pressable
                accessibilityRole="button"
                hitSlop={8}
                onPress={() => {
                  hideToast();
                  current.onAction?.();
                }}
                style={{ backgroundColor: "rgba(255,255,255,0.14)", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 12 }}
              >
                <Txt w="bold" size={13} color={palette.white}>
                  {current.actionLabel}
                </Txt>
              </Pressable>
            ) : (
              <View style={{ width: 4 }} />
            )}
          </Pressable>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};
