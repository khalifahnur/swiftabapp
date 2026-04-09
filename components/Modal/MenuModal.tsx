import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useCartStore } from "@/store/useOrderStore";
import { MenuItem } from "@/types";

const formatCurrency = (amount: number) => `KES ${amount.toLocaleString()}`;

const MenuTabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (t: string) => void;
}) => {
  const tabs = ["breakfast", "lunch", "dinner"];
  return (
    <View className="flex-row bg-gray-200/60 p-1 rounded-2xl mx-6 mb-6">
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => setActiveTab(tab)}
          style={[
            styles.tabBase,
            activeTab === tab ? styles.tabActive : styles.tabInactive,
          ]}
        >
          <Text
            className={`font-bold capitalize ${activeTab === tab ? "text-teal-600" : "text-gray-500"}`}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const FoodCard = ({ item }: { item: MenuItem }) => {
  const { addToCart, removeFromCart, getItemQuantity } = useCartStore();
  const quantity = getItemQuantity(item._id);

  return (
    <View className="flex-row bg-white rounded-3xl p-3 mb-4 shadow-sm border border-gray-100 mx-6 items-center">
      <Image
        source={{ uri: item.image }}
        className="w-24 h-24 rounded-2xl bg-gray-100 mr-4"
        resizeMode="cover"
      />

      <View className="flex-1 justify-center py-1">
        <Text
          className="font-bold text-gray-900 text-base mb-1"
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text
          className="font-regular text-gray-500 text-xs leading-4 mb-2"
          numberOfLines={2}
        >
          {item.description}
        </Text>
        <Text className="font-bold text-teal-600 text-sm">
          {formatCurrency(item.cost)}
        </Text>
      </View>

      <View className="ml-2">
        {quantity > 0 ? (
          <View className="flex-col items-center bg-gray-50 rounded-full border border-gray-200 py-1">
            <TouchableOpacity
              onPress={() => addToCart(item)}
              className="w-8 h-8 items-center justify-center bg-teal-600 rounded-full shadow-sm"
            >
              <Ionicons name="add" size={16} color="#fff" />
            </TouchableOpacity>

            <Text className="font-bold text-gray-900 my-1">{quantity}</Text>

            <TouchableOpacity
              onPress={() => removeFromCart(item._id)}
              className="w-8 h-8 items-center justify-center"
            >
              <Ionicons name="remove" size={16} color="#0d9488" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => addToCart(item)}
            className="w-10 h-10 bg-teal-50 rounded-full items-center justify-center border border-teal-100"
          >
            <Ionicons name="add" size={20} color="#0d9488" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default function MenuScreen({
  menuData,
  restaurantId,
  userId,
  reservationId,
  tableNumber,
}: {
  menuData: any;
  restaurantId: string;
  userId: string;
  reservationId: string;
  tableNumber: string;
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("breakfast");

  const totalPrice = useCartStore((state) => state.getTotalPrice());
  const cartItemCount = useCartStore((state) => state.items.length);

  const currentItems = menuData[activeTab] || [];

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="flex-row items-center px-6 py-4 bg-gray-50">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm border border-gray-200"
        >
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text className="flex-1 text-center font-bold text-xl text-gray-900 mr-10">
          Pre-Order
        </Text>
      </View>

      <MenuTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <FlatList
        data={currentItems}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: cartItemCount > 0 ? 120 : 40 }}
        renderItem={({ item }) => <FoodCard item={item} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-20 px-6">
            <Ionicons name="restaurant-outline" size={48} color="#D1D5DB" />
            <Text className="text-gray-500 font-medium mt-4 text-center">
              No items available for {activeTab}.
            </Text>
          </View>
        }
      />

      {cartItemCount > 0 && (
        <View
          className="absolute bottom-0 mb-5 w-full bg-white border-t border-gray-100 px-6 pt-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]"
          style={{ paddingBottom: Math.max(insets.bottom, 20) }}
        >
          <TouchableOpacity
            className="flex-row items-center bg-teal-600 rounded-lg p-4 shadow-sm"
            onPress={() =>
              router.navigate({
                pathname: "/screens/cart",
                params: {
                  restaurantId,
                  userId,
                  reservationId,
                  tableNumber,
                },
              })
            }
          >
            <View className="bg-teal-700/50 rounded-full w-8 h-8 items-center justify-center border border-teal-500">
              <Text className="text-white font-bold text-xs">
                {cartItemCount}
              </Text>
            </View>

            <Text className="flex-1 text-center text-white font-bold text-lg">
              View Cart
            </Text>

            <Text className="text-white font-bold text-base">
              {formatCurrency(totalPrice)}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabBase: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabInactive: {
    backgroundColor: "transparent",
  },
});
