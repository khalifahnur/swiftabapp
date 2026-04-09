import { userCompleteOrder } from "@/hooks/orderhooks/orderhooks";
import { FetchOrder } from "@/types";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RenderMenu from "./RenderMenu";

interface OrdersProps {
  data: FetchOrder[];
  refreshing: boolean;
  onRefresh: () => void;
}

export default function Orders({ data, refreshing, onRefresh }: OrdersProps) {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { mutate: completeOrderMutate, isPending } = userCompleteOrder();

  const activeOrders = data.filter((o) =>
    ["placed", "served", "ready_to_pay", "completed", "cancelled"].includes(
      o.status,
    ),
  );
  const historyOrders = data.filter((o) =>
    ["completed", "cancelled"].includes(o.status),
  );

  const displayedOrders = activeTab === "active" ? activeOrders : historyOrders;

  const handlePayment = (method: string) => {
    if (!selectedOrderId) return;

    completeOrderMutate(
      {
        orderId: selectedOrderId,
        data: { status: "ready_to_pay", paymentMethod: method },
      },
      {
        onSuccess: () => {
          setPaymentModalVisible(false);
          setSelectedOrderId(null);
          onRefresh();
        },
      },
    );
  };

  return (
    <View className="flex-1 bg-gray-50 pt-4">
      <View className="px-5 mb-2">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl font-bold text-gray-900">My Orders</Text>
        </View>

        <View className="flex-row bg-gray-200 p-1 rounded-xl mb-4">
          <TouchableOpacity
            onPress={() => setActiveTab("active")}
            className={`flex-1 py-2.5 rounded-lg items-center ${
              activeTab === "active" ? "bg-white shadow-sm" : ""
            }`}
          >
            <Text
              className={`font-semibold ${
                activeTab === "active" ? "text-gray-900" : "text-gray-500"
              }`}
            >
              Active
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("history")}
            className={`flex-1 py-2.5 rounded-lg items-center ${
              activeTab === "history" ? "bg-white shadow-sm" : ""
            }`}
          >
            <Text
              className={`font-semibold ${
                activeTab === "history" ? "text-gray-900" : "text-gray-500"
              }`}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {displayedOrders.length === 0 ? (
        <View className="flex-1 items-center justify-center pb-20">
          <Ionicons name="receipt-outline" size={60} color="#cbd5e1" />
          <Text className="text-gray-400 mt-4 font-medium text-lg">
            No {activeTab} orders found.
          </Text>
        </View>
      ) : (
        <FlatList
          data={displayedOrders}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <RenderMenu
              item={item}
              activeTab={activeTab}
              onOpenPayment={(orderId) => {
                setSelectedOrderId(orderId);
                setPaymentModalVisible(true);
              }}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#0d9488"]}
              tintColor="#0d9488"
            />
          }
        />
      )}

      <Modal
        visible={isPaymentModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          if (!isPending) setPaymentModalVisible(false);
        }}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 pb-10">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-900">
                Select Payment Method
              </Text>
              <TouchableOpacity
                onPress={() => setPaymentModalVisible(false)}
                disabled={isPending}
              >
                <Ionicons name="close-circle" size={28} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-500 mb-5">
              Choose how you would like to pay for your order. Your waiter will
              be notified.
            </Text>

            {/* Payment Options */}
            <TouchableOpacity
              onPress={() => handlePayment("mpesa")}
              disabled={isPending}
              className="flex-row items-center bg-green-50 p-4 rounded-xl border border-green-200 mb-3"
            >
              <MaterialCommunityIcons
                name="phone-classic"
                size={24}
                color="#10b981"
              />
              <Text className="text-green-800 font-bold text-lg ml-3">
                M-Pesa
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handlePayment("card")}
              disabled={isPending}
              className="flex-row items-center bg-blue-50 p-4 rounded-xl border border-blue-200 mb-3"
            >
              <Ionicons name="card" size={24} color="#3b82f6" />
              <Text className="text-blue-800 font-bold text-lg ml-3">
                Credit / Debit Card
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handlePayment("cash")}
              disabled={isPending}
              className="flex-row items-center bg-gray-100 p-4 rounded-xl border border-gray-300"
            >
              <Ionicons name="cash" size={24} color="#4b5563" />
              <Text className="text-gray-700 font-bold text-lg ml-3">Cash</Text>
            </TouchableOpacity>

            {/* Loading Indicator for API call */}
            {isPending && (
              <View className="flex-row items-center justify-center mt-6">
                <ActivityIndicator size="small" color="#0d9488" />
                <Text className="text-teal-700 font-medium ml-2">
                  Notifying waiter...
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
