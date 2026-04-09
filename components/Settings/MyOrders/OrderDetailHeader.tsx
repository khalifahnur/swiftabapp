import { formatDate } from "@/lib/helpers";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function OrderDetailHeader({
  selectedOrder,
  setIsViewingDetails,
}: any) {
  if (!selectedOrder) return null;

  return (
    <View className="px-6 pt-2 pb-4">
      {/* Top Nav */}
      <View className="flex-row items-center justify-between mb-6">
        <TouchableOpacity
          className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm border border-gray-200"
          onPress={() => setIsViewingDetails(false)}
        >
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text className="font-bold text-lg text-gray-900">Order Details</Text>
        <View className="w-10" /> {/* Empty view for flex balancing */}
      </View>

      {/* Info Card */}
      <View className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6">
        <Text className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
          Order #{selectedOrder.orderId?.slice(-6).toUpperCase()}
        </Text>

        <View className="flex-row mb-4">
          <View className="flex-1">
            <Text className="text-xs font-medium text-gray-500 mb-1">
              Reservation ID
            </Text>
            <Text className="text-base font-bold text-gray-900">
              {selectedOrder.reservationId}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-xs font-medium text-gray-500 mb-1">
              Table No.
            </Text>
            <Text className="text-base font-bold text-gray-900">
              {selectedOrder.tableNumber}
            </Text>
          </View>
        </View>

        <View>
          <Text className="text-xs font-medium text-gray-500 mb-1">Date</Text>
          <Text className="text-base font-bold text-gray-900">
            {formatDate(selectedOrder.createdAt)}
          </Text>
        </View>
      </View>

      <Text className="text-lg font-bold text-gray-900 mb-2">Order Items</Text>
    </View>
  );
}
