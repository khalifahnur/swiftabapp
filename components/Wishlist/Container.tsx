import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useRef } from "react";
import {
  Animated,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/redux/store/Store";
import { removeToWishlist } from "@/redux/WishlistSlice";
import { RestaurantParam } from "@/types";

const WishlistCard = ({
  item,
  onPress,
  onRemove,
}: {
  item: RestaurantParam;
  onPress: () => void;
  onRemove: (id: string) => void;
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const animateIn = () =>
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  const animateOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      bounciness: 8,
      useNativeDriver: true,
    }).start();

  const locationText =
    item.about?.map((loc) => loc.location).join(", ") || item.location;

  return (
    <TouchableWithoutFeedback
      onPressIn={animateIn}
      onPressOut={animateOut}
      onPress={onPress}
    >
      <Animated.View
        style={{ transform: [{ scale }] }}
        className="flex-row bg-white rounded-2xl p-3 mb-4 shadow-sm border border-gray-100 mx-6 items-center"
      >
        <Image
          source={{ uri: item.image }}
          className="w-24 h-24 rounded-xl bg-gray-100"
          resizeMode="cover"
        />

        <View className="flex-1 ml-4 justify-center">
          <View className="flex-row justify-between items-start mb-1">
            <Text
              className="font-bold text-gray-900 text-lg flex-1 mr-2"
              numberOfLines={1}
            >
              {item.restaurantName}
            </Text>
            <TouchableOpacity
              onPress={() => onRemove(item._id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              className="bg-red-50 p-2 rounded-full"
            >
              <AntDesign name="heart" size={16} color="#ef4444" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center mb-2">
            <Ionicons name="location" size={14} color="#0d9488" />
            <Text
              className="font-medium text-gray-500 text-sm ml-1 flex-1"
              numberOfLines={1}
            >
              {locationText}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="star" size={14} color="#f5a623" />
            <Text className="font-bold text-gray-700 text-sm ml-1">
              {item.rate}
            </Text>
          </View>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default function Container() {
  const wishlistData = useSelector(
    (state: RootState) => state.wishlist.wishlist,
  );
  const dispatch = useDispatch();
  const router = useRouter();

  const handleRemoveFromWishlist = (_id: string) => {
    dispatch(removeToWishlist(_id));
  };

  const NavigateHandler = (data: RestaurantParam) => {
    router.replace({
      pathname: "/screens/restaurantdetails",
      params: { data: JSON.stringify(data) },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="px-6 py-4 bg-gray-50 mb-2">
        <Text className="text-3xl font-bold text-gray-900 tracking-tight">
          Favourites
        </Text>
      </View>

      {wishlistData.length > 0 ? (
        <FlatList
          data={wishlistData}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <WishlistCard
              item={item}
              onPress={() => NavigateHandler(item)}
              onRemove={handleRemoveFromWishlist}
            />
          )}
        />
      ) : (
        <View className="flex-1 justify-center items-center px-6 pb-20">
          <LottieView
            source={require("@/assets/images/lottie/emptywishlist.json")}
            autoPlay
            loop
            style={{ width: 100, height: 100 }}
          />
          <Text className="text-lg font-bold text-gray-900 mt-6 mb-2">
            No favourites yet
          </Text>
          <Text className="text-sm font-medium text-gray-500 text-center px-4 leading-6">
            Tap the heart icon on any restaurant to save it here for quick
            access later.
          </Text>

          <TouchableOpacity
            className="mt-8 bg-teal-600 px-8 py-4 rounded-lg shadow-sm"
            onPress={() => router.navigate("/(tabs)")}
          >
            <Text className="text-white font-bold text-base">
              Explore Restaurants
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
