import { Feather } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "@/lib/authStore";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const COLORS = {
  primary: "#0d9488",
  primaryLight: "#F0FDFA",
  bg: "#FFFFFF",
  textDark: "#111827",
  textLight: "#6B7280",
  dotInactive: "#E5E7EB",
  white: "#FFFFFF",
};

type OnboardingItem = {
  id: string;
  title: string;
  description: string;
  images: { uri: string }[];
};

const data: OnboardingItem[] = [
  {
    id: "1",
    title: "Find your table for any occasion",
    description:
      "An unrivaled selection of restaurants for whatever you are craving today.",
    images: [
      require("../assets/images/restaurants/res5.jpeg"),
      require("../assets/images/restaurants/res6.jpeg"),
    ],
  },
  {
    id: "2",
    title: "Discover new culinary experiences",
    description: "Explore top-rated local favorites and hidden gems near you.",
    images: [
      require("../assets/images/menu/lunch/fish.png"),
      require("../assets/images/menu/lunch/sushi.png"),
    ],
  },
  {
    id: "3",
    title: "Book instantly with ease",
    description: "Secure your reservation and pre-order food in seconds.",
    images: [
      require("../assets/images/restaurants/res6.jpeg"),
      require("../assets/images/restaurants/res6.jpeg"),
    ],
  },
];

const OnboardingScreen: React.FC = () => {
  const carouselRef = useRef<ICarouselInstance>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { completeOnboarding } = useAuthStore();

  const isLastSlide = activeIndex === data.length - 1;

  const handleNextPress = () => {
    if (isLastSlide) {
      completeOnboarding();
    } else {
      carouselRef.current?.next();
    }
  };

  const handleSkipPress = () => {
    completeOnboarding();
  };

  const renderItem = ({ item }: { item: OnboardingItem }) => {
    return (
      <View style={styles.slideContainer}>
        {/* Hero Image Section */}
        <View style={styles.imageContainer}>
          <View style={styles.imageWrapper}>
            <Image
              source={item.images[0]} // Using the primary image as a stunning hero shot
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* Text Content Section */}
        <View style={styles.textSection}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        {/* Skip Button (Top Right) */}
        <View style={styles.topNav}>
          {!isLastSlide ? (
            <TouchableOpacity
              onPress={handleSkipPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ height: 20 }} />
          )}
        </View>

        <View style={styles.carouselContainer}>
          <Carousel
            ref={carouselRef}
            loop={false}
            width={SCREEN_WIDTH}
            height={SCREEN_HEIGHT * 0.7}
            data={data}
            renderItem={renderItem}
            onSnapToItem={(index) => setActiveIndex(index)}
            panGestureHandlerProps={{ activeOffsetX: [-10, 10] }}
          />
        </View>

        {/* Bottom Navigation Area */}
        <View style={styles.bottomNavContainer}>
          {/* Expanding Pagination Dots */}
          <View style={styles.paginationContainer}>
            {data.map((_, index) => {
              const isActive = index === activeIndex;
              return (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    isActive ? styles.dotActive : styles.dotInactive,
                  ]}
                />
              );
            })}
          </View>

          {/* Floating Action Button */}
          <TouchableOpacity
            onPress={handleNextPress}
            style={styles.nextButton}
            activeOpacity={0.8}
          >
            <Feather
              name={isLastSlide ? "check" : "arrow-right"}
              size={28}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  safeArea: {
    flex: 1,
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 24,
    paddingTop: 10,
    height: 40,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textLight,
  },
  carouselContainer: {
    flex: 1,
  },
  slideContainer: {
    flex: 1,
    alignItems: "center",
    width: SCREEN_WIDTH,
  },
  // Hero Image Styles
  imageContainer: {
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_HEIGHT * 0.45,
    marginTop: 10,
    marginBottom: 40,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: { elevation: 10 },
    }),
  },
  imageWrapper: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    overflow: "hidden",
    backgroundColor: COLORS.primaryLight,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  // Text Section Styles
  textSection: {
    paddingHorizontal: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 16,
    textAlign: "center",
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  // Bottom Navigation Styles
  bottomNavContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: Platform.OS === "ios" ? 20 : 32,
  },
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24, // Pill shape for active state
    backgroundColor: COLORS.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: COLORS.dotInactive,
  },
  nextButton: {
    backgroundColor: COLORS.primary,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
});

export default OnboardingScreen;
