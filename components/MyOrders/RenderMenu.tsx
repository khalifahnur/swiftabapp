import { FetchOrder } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface RenderMenuProps {
  item: FetchOrder;
  activeTab: string;
  onOpenPayment: (orderId: string) => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "placed":
      return {
        bg: "bg-orange-100",
        text: "text-orange-600",
        label: "In Kitchen",
      };
    case "served":
      return { bg: "bg-blue-100", text: "text-blue-600", label: "Served" };
    case "ready_to_pay":
      return {
        bg: "bg-purple-100",
        text: "text-purple-600",
        label: "Awaiting Payment",
      };
    case "completed":
      return { bg: "bg-green-100", text: "text-green-600", label: "Completed" };
    case "cancelled":
      return { bg: "bg-red-100", text: "text-red-600", label: "Cancelled" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-600", label: status };
  }
};

export default function RenderMenu({
  item,
  activeTab,
  onOpenPayment,
}: RenderMenuProps) {
  const currentStatus = item.status;
  const badge = getStatusBadge(currentStatus);
  const isServed = currentStatus === "served";

  return (
    <View className="bg-white p-5 rounded-lg mb-4 shadow-sm border border-gray-100 mx-5">
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-2">
          <Text className="text-lg font-bold text-gray-800" numberOfLines={1}>
            {item.restaurantName || "Restaurant"}
          </Text>
          <Text className="text-gray-500 text-sm mt-1">
            Table: {item.tableNumber} • ID: #{item._id?.substring(0, 8)}
          </Text>
        </View>
        <View className={`px-3 py-1.5 rounded-xl ${badge.bg}`}>
          <Text className={`text-xs font-bold ${badge.text}`}>
            {badge.label}
          </Text>
        </View>
      </View>

      <View className="h-px bg-gray-100 my-2" />

      <View className="my-2">
        {item.menu?.map((menuItem: any, idx: number) => (
          <View key={idx} className="flex-row justify-between mb-1">
            <Text className="text-gray-600 flex-1 mr-4" numberOfLines={1}>
              {menuItem.quantity} x {menuItem.name}
            </Text>
            <Text className="text-gray-800 font-medium">
              Ksh. {(menuItem.cost * menuItem.quantity).toLocaleString()}
            </Text>
          </View>
        ))}
      </View>

      <View className="h-px bg-gray-100 my-2" />

      <View className="flex-row justify-between items-center mt-2">
        <Text className="text-gray-500 font-medium">Total</Text>
        <Text className="text-lg font-bold text-gray-900">
          Ksh. {item.totalAmount?.toLocaleString()}
        </Text>
      </View>
      {isServed && activeTab === "active" && (
        <TouchableOpacity
          onPress={() => onOpenPayment(item._id)}
          className="bg-teal-600 mt-4 py-3 rounded-lg flex-row justify-center items-center shadow-sm"
        >
          <Ionicons
            name="wallet-outline"
            size={20}
            color="white"
            className="mr-2"
          />
          <Text className="text-white font-bold text-base ml-2">
            Complete Order
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
