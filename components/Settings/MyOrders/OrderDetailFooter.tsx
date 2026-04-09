import { calculateTotal, formatCurrency } from "@/lib/helpers";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OrderDetailFooter({ selectedOrder }: any) {
  const insets = useSafeAreaInsets();
  if (!selectedOrder) return null;

  const total = calculateTotal(selectedOrder.menu);
  const tax = total * 0.1;

  return (
    <View
      className="bg-white rounded-t-3xl px-6 pt-6 shadow-xl border-t border-gray-100"
      style={{ paddingBottom: Math.max(insets.bottom, 20) }}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm font-medium text-gray-500">Subtotal</Text>
        <Text className="text-sm font-bold text-gray-700">
          {formatCurrency(total)}
        </Text>
      </View>
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-sm font-medium text-gray-500">Tax (10%)</Text>
        <Text className="text-sm font-bold text-gray-700">
          {formatCurrency(tax)}
        </Text>
      </View>

      <View className="h-px bg-gray-200 mb-4" />

      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-lg font-bold text-gray-900">Total</Text>
        <Text className="text-2xl font-bold text-teal-600">
          {formatCurrency(total + tax)}
        </Text>
      </View>

      {selectedOrder.paid === "Unpaid" ? (
        <TouchableOpacity className="flex-row justify-center items-center bg-teal-600 py-4 rounded-2xl shadow-sm gap-2">
          <Ionicons name="wallet" size={20} color="#fff" />
          <Text className="text-white font-bold text-lg">Pay Now</Text>
        </TouchableOpacity>
      ) : (
        <View className="flex-row justify-center items-center bg-gray-100 py-4 rounded-2xl gap-2">
          <Ionicons name="checkmark-circle" size={20} color="#0d9488" />
          <Text className="text-gray-500 font-bold text-base">
            Payment Completed
          </Text>
        </View>
      )}
    </View>
  );
}
