import { useCreateOrder } from "@/hooks/orderhooks/orderhooks";
import { useCartStore } from "@/store/useOrderStore";
import { OrderResponse } from "@/types";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const CartCard = ({
  item,
  onRemove,
}: {
  item: any;
  onRemove: (id: string) => void;
}) => (
  <View className="flex-row bg-white rounded-2xl p-3 mb-4 shadow-sm border border-gray-100 mx-6 items-center">
    <View className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden mr-4">
      <Image
        source={{ uri: item.image }}
        className="w-full h-full"
        resizeMode="cover"
      />
    </View>

    <View className="flex-1 justify-center py-1">
      <Text className="font-bold text-gray-900 text-lg mb-1" numberOfLines={1}>
        {item.name}
      </Text>
      <View className="flex-row items-center justify-between mt-2">
        <Text className="font-bold text-teal-600 text-base">
          Ksh. {item.cost}
        </Text>
        <Text className="font-medium text-gray-500 text-sm bg-gray-100 px-2 py-0.5 rounded-md">
          Qty: {item.quantity}
        </Text>
      </View>
    </View>

    <TouchableOpacity
      onPress={() => onRemove(item._id)}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      className="ml-3 w-10 h-10 bg-red-50 rounded-full items-center justify-center"
    >
      <AntDesign name="delete" size={18} color="#ef4444" />
    </TouchableOpacity>
  </View>
);

export default function CartScreen({
  restaurantId,
  userId,
  reservationId,
  tableNumber,
}: {
  restaurantId: string;
  userId: string;
  reservationId: string;
  tableNumber: string;
}) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const cartItems = useCartStore((state) => state.items);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const { mutate: submitOrder, isPending } = useCreateOrder();

  const subTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.cost * item.quantity, 0);
  }, [cartItems]);

  const handleCheckOut = () => {
    const orderPayload = {
      userId,
      restaurantId,
      reservationId,
      tableNumber,
      menu: cartItems.map((item) => ({
        _id: item._id,
        name: item.name,
        cost: item.cost,
        quantity: item.quantity,
      })),
    };

    submitOrder(orderPayload, {
      onSuccess: (data: OrderResponse) => {
        if (clearCart) clearCart();
        router.replace("/order");
      },
      onError: (error: any) => {
        Alert.alert("Order Failed", error.message || "Something went wrong.");
      },
    });
  };

  if (cartItems.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
        <Stack.Screen options={{ headerShown: false }} />

        <View className="flex-row items-center px-6 py-4 bg-gray-50">
          <TouchableOpacity onPress={() => router.back()}>
            <View className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm border border-gray-200">
              <Ionicons name="close" size={24} />
            </View>
          </TouchableOpacity>
        </View>

        <View className="flex-1 justify-center items-center px-6 pb-20">
          <LottieView
            source={require("@/assets/images/lottie/emptycart.json")}
            autoPlay
            loop
            style={{ width: 110, height: 110 }}
          />
          <Text className="text-xl font-bold text-gray-900 mt-2 mb-2">
            Your Cart is Empty
          </Text>
          <Text className="text-base font-medium text-gray-500 text-center px-4 leading-6">
            Looks like you haven't added any delicious meals yet.
          </Text>
          <TouchableOpacity
            className="mt-8 bg-teal-600 px-8 py-4 rounded-lg shadow-sm"
            onPress={() => router.navigate("/(tabs)")}
          >
            <Text className="text-white font-bold text-base">Explore Menu</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-row items-center px-6 py-4 bg-gray-50">
        <TouchableOpacity onPress={() => router.back()}>
          <View className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm border border-gray-200">
            <Ionicons name="arrow-back" size={20} color="#111827" />
          </View>
        </TouchableOpacity>
        <Text className="flex-1 text-center font-bold text-xl text-gray-900 mr-10">
          My Cart
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 180, paddingTop: 10 }}
      >
        {cartItems.map((item) => (
          <CartCard key={item._id} item={item} onRemove={removeFromCart} />
        ))}
      </ScrollView>

      <View
        className="absolute bottom-0 w-full bg-white border-t border-gray-100 rounded-t-3xl mb-5 px-6 pt-6 shadow-lg"
        style={{ paddingBottom: Math.max(insets.bottom, 30) }}
      >
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-base font-medium text-gray-500">Subtotal</Text>
          <Text className="text-xl font-bold text-gray-900">
            Ksh. {subTotal.toLocaleString()}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleCheckOut}
          disabled={isPending}
          className={`flex-row justify-center items-center py-4 rounded-lg shadow-sm gap-2 ${
            isPending ? "bg-teal-400" : "bg-teal-600"
          }`}
        >
          {isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">Confirm Order</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
