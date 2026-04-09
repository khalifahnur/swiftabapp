import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import { addToWishlist, removeToWishlist } from "@/redux/WishlistSlice";
import { RootState } from "@/redux/store/Store";
import { RestaurantParam } from "@/types";

import About from "./About";
import Menu from "./Menu";
import Reviews from "./Reviews";

const { width } = Dimensions.get("window");
const HEADER_MAX_HEIGHT = 320;

export default function Container() {
  const params = useLocalSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const [activeTab, setActiveTab] = useState<"About" | "Menu" | "Reviews">(
    "About",
  );

  const HEADER_MIN_HEIGHT = insets.top + 60;
  const SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const paramData: RestaurantParam = params?.data
    ? JSON.parse(Array.isArray(params.data) ? params.data[0] : params.data)
    : {
        image: "",
        restaurantName: "",
        location: "",
        latitude: 0,
        longitude: 0,
        rate: 0,
        about: [],
        menu: { _id: "", breakfast: [], lunch: [], dinner: [] },
        _id: "",
        review: [],
      };

  const wishlistCart = useSelector(
    (state: RootState) => state.wishlist.wishlist,
  );
  const isInWishlist = wishlistCart.some((item) => item._id === paramData?._id);

  const handleWishlist = () => {
    if (!isInWishlist) {
      dispatch(addToWishlist(paramData));
    } else {
      dispatch(removeToWishlist(paramData._id));
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-HEADER_MAX_HEIGHT, 0, HEADER_MAX_HEIGHT],
            [-HEADER_MAX_HEIGHT / 2, 0, HEADER_MAX_HEIGHT * 0.5],
            Extrapolation.CLAMP,
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [-HEADER_MAX_HEIGHT, 0],
            [2, 1],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const navBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        scrollY.value,
        [SCROLL_DISTANCE - 50, SCROLL_DISTANCE],
        ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"],
      ),
      borderBottomWidth: interpolate(
        scrollY.value,
        [SCROLL_DISTANCE, SCROLL_DISTANCE + 10],
        [0, 1],
        Extrapolation.CLAMP,
      ),
      borderColor: "#F3F4F6",
    };
  });

  const navTitleAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [SCROLL_DISTANCE - 20, SCROLL_DISTANCE],
        [0, 1],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [SCROLL_DISTANCE - 20, SCROLL_DISTANCE],
            [10, 0],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const iconAnimatedColor = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        scrollY.value,
        [SCROLL_DISTANCE - 50, SCROLL_DISTANCE],
        ["rgb(255, 255, 255)", "rgb(17, 24, 39)"],
      ),
    };
  });

  const buttonBgAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        scrollY.value,
        [SCROLL_DISTANCE - 50, SCROLL_DISTANCE],
        ["rgba(0,0,0,0.4)", "rgba(255,255,255,0)"],
      ),
    };
  });

  const renderContent = () => {
    switch (activeTab) {
      case "About":
        return <About data={paramData} />;
      case "Menu":
        return <Menu menu={paramData.menu} restaurantId={paramData._id} />;
      case "Reviews":
        return <Reviews reviews={paramData.review} />;
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light" backgroundColor="transparent" translucent />
      <Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
        <Animated.Image
          source={{ uri: paramData.image }}
          style={styles.image}
        />
        <View className="absolute inset-0 bg-black/20" />
      </Animated.View>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      >
        <View
          style={{
            marginTop: HEADER_MAX_HEIGHT - 40,
            backgroundColor: "#FFFFFF",
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            overflow: "hidden",
            minHeight: "100%",
          }}
        >
          <View className="items-center mt-3 mb-1">
            <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </View>

          <View style={{ paddingHorizontal: 24, paddingTop: 16 }}>
            <Text className="text-3xl font-bold text-gray-900 mb-6">
              {paramData.restaurantName}
            </Text>

            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#F3F4F6",
                padding: 4,
                borderRadius: 16,
                marginBottom: 24,
              }}
            >
              {["About", "Menu", "Reviews"].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.tabBase,
                    activeTab === tab ? styles.activeTab : styles.inactiveTab,
                  ]}
                  onPress={() => setActiveTab(tab as any)}
                >
                  <Text
                    className={`font-semibold ${
                      activeTab === tab ? "text-teal-600" : "text-gray-500"
                    }`}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View className="min-h-[500px]">{renderContent()}</View>
          </View>
        </View>
      </Animated.ScrollView>
      <Animated.View
        style={[
          navBarAnimatedStyle,
          { paddingTop: insets.top, height: HEADER_MIN_HEIGHT },
        ]}
        className="absolute top-0 w-full flex-row items-center justify-between px-4 z-50"
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Animated.View
            style={[buttonBgAnimatedStyle]}
            className="w-10 h-10 rounded-full items-center justify-center"
          >
            <Animated.Text style={iconAnimatedColor}>
              <Ionicons name="arrow-back" size={24} />
            </Animated.Text>
          </Animated.View>
        </TouchableOpacity>

        <Animated.Text
          style={navTitleAnimatedStyle}
          className="font-bold text-lg text-gray-900 absolute left-0 right-0 text-center -z-10"
        >
          {paramData.restaurantName}
        </Animated.Text>

        <TouchableOpacity onPress={handleWishlist}>
          <Animated.View
            style={[buttonBgAnimatedStyle]}
            className="w-10 h-10 rounded-full items-center justify-center"
          >
            {isInWishlist ? (
              <AntDesign name="heart" size={22} color="#ef4444" />
            ) : (
              <Animated.Text style={iconAnimatedColor}>
                <AntDesign name="heart" size={22} />
              </Animated.Text>
            )}
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      <View
        className="absolute bottom-0 w-full bg-white border-t border-gray-100 px-6 pt-4 shadow-lg"
        style={{ paddingBottom: Math.max(insets.bottom, 20) }}
      >
        <TouchableOpacity
          className="bg-teal-600 py-4 rounded-2xl items-center"
          onPress={() =>
            router.navigate({
              pathname: "/screens/reserve",
              params: { data: JSON.stringify(paramData) },
            })
          }
        >
          <Text className="font-bold text-white text-lg">Reserve a Table</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // We keep only the styles required for absolute positioning and animation basics
  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_MAX_HEIGHT,
    width: width,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  tabBase: {
    flex: 1,
    paddingVertical: 12, // py-3
    borderRadius: 12, // rounded-xl
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#FFFFFF",
    // shadow-sm equivalent
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inactiveTab: {
    backgroundColor: "transparent",
  },
});
