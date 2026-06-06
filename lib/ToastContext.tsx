import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import React, { createContext, useContext, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

type ToastType = "success" | "error";
interface ToastContextType {
  showToast: (type: ToastType, message: string) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toastConfig, setToastConfig] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  // Animation values
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = (type: ToastType, message: string) => {
    setToastConfig({ type, message });

    // Slide up and fade in
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-hide after 4 seconds
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      hideToast();
    }, 4000);
  };

  const hideToast = () => {
    // Slide down and fade out
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToastConfig(null);
    });
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}

      {toastConfig && (
        <Animated.View
          style={{
            position: "absolute",
            top: 50,
            left: 16,
            right: 16,
            backgroundColor: "#2f2f2f",
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
            transform: [{ translateY }],
            opacity: opacity,
            zIndex: 9999,
            elevation: 100,
          }}
        >
          <View className="flex-row items-center flex-1">
            {toastConfig.type === "error" ? (
              <View className=" w-6 h-6 items-center justify-center ">
                <FontAwesome5 name="exclamation" size={16} color="red" />
              </View>
            ) : (
              <View className="bg-green-500 w-6 h-6 items-center justify-center">
                <Ionicons name="checkmark" size={16} color="green" />
              </View>
            )}

            <Text className="text-white ml-3 text-sm font-medium flex-1">
              {toastConfig.message}
            </Text>
          </View>

          <TouchableOpacity
            onPress={hideToast}
            className="bg-[#4b4b4b] rounded-full w-6 h-6 items-center justify-center ml-2"
          >
            <Ionicons name="close" size={14} color="#d1d5db" />
          </TouchableOpacity>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};
