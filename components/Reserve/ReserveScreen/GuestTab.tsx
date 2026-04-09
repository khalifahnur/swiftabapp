import useStore from "@/store/useStore";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function GuestTab() {
  const { guestCount, setGuestCount } = useStore();

  const handleAdd = () => setGuestCount(guestCount + 1);
  const handleSub = () =>
    setGuestCount(guestCount > 1 ? guestCount - 1 : guestCount);

  return (
    <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6">
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-lg font-bold text-gray-900">Guests</Text>
          <Text className="text-sm font-medium text-gray-500 mt-1">
            Number of people
          </Text>
        </View>

        <View className="flex-row items-center bg-gray-50 rounded-2xl p-1 border border-gray-200">
          <TouchableOpacity
            style={[
              styles.buttonBase,
              guestCount > 1 ? styles.buttonActive : styles.buttonInactive,
            ]}
            onPress={handleSub}
            disabled={guestCount <= 1}
          >
            <Ionicons
              name="remove"
              size={20}
              color={guestCount > 1 ? "#111827" : "#9CA3AF"}
            />
          </TouchableOpacity>

          <Text className="w-10 text-center font-bold text-lg text-gray-900">
            {guestCount}
          </Text>

          <TouchableOpacity
            className="w-10 h-10 rounded-xl items-center justify-center bg-white shadow-sm"
            onPress={handleAdd}
          >
            <Ionicons name="add" size={20} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonInactive: {
    backgroundColor: "transparent",
  },
});
