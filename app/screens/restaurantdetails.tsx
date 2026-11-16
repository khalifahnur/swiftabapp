import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, { Extrapolation, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { errorMessage } from "@/api/client";
import MenuTab from "@/components/Details/MenuTab";
import Overview from "@/components/Details/Overview";
import ReviewsTab from "@/components/Details/ReviewsTab";
import { SaveButton } from "@/components/RestaurantCard";
import { ErrorState, Picture, Pill, ScreenHeader, Segmented, Skeleton } from "@/components/ui/Bits";
import { Button, IconButton } from "@/components/ui/Button";
import { Txt } from "@/components/ui/Txt";
import { palette, shadow } from "@/constants/theme";
import { useMarkViewed, usePromotions, useRestaurant } from "@/hooks/queries";
import { formatKes } from "@/lib/format";
import { shareRestaurant } from "@/lib/links";
import { averagePrice, openState } from "@/lib/restaurant";
import { useBooking } from "@/store/useBooking";

const HERO = 320;
type Tab = "overview" | "menu" | "reviews";

export default function RestaurantDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: restaurant, isLoading, isError, error, refetch } = useRestaurant(id);
  const { data: promotions } = usePromotions(id);
  const markViewed = useMarkViewed();
  const beginBooking = useBooking((s) => s.begin);
  const [tab, setTab] = useState<Tab>("overview");

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });
  const heroStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [0, HERO], [0, -HERO * 0.35], Extrapolation.CLAMP) },
      { scale: interpolate(scrollY.value, [-HERO, 0], [2, 1], Extrapolation.CLAMP) },
    ],
  }));
  const barStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [HERO - 150, HERO - 90], [0, 1], Extrapolation.CLAMP),
  }));

  const { mutate: recordView } = markViewed;
  useEffect(() => {
    if (id) recordView(id);
  }, [id, recordView]);

  if (isError && !restaurant) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.canvas }}>
        <ScreenHeader title="Restaurant" />
        <ErrorState message={errorMessage(error)} onRetry={() => refetch()} />
      </View>
    );
  }

  if (isLoading || !restaurant) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.surface }}>
        <Skeleton height={HERO} round={0} />
        <View style={{ padding: 24, gap: 14 }}>
          <Skeleton height={30} width="70%" />
          <Skeleton height={18} width="50%" />
          <Skeleton height={46} round={23} />
          <Skeleton height={120} />
        </View>
      </View>
    );
  }

  const state = openState(restaurant);
  const price = averagePrice(restaurant);
  const bookable = restaurant.acceptingReservations !== false;
  const reviewCount = restaurant.review.length;

  const book = () => {
    beginBooking(restaurant.id);
    router.push({ pathname: "/screens/reserve", params: { id: restaurant.id } });
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.surface }}>
      <StatusBar style="light" />

      <Animated.View style={[{ position: "absolute", top: 0, left: 0, right: 0, height: HERO }, heroStyle]}>
        <Picture uri={restaurant.image} style={{ width: "100%", height: "100%" }} />
        <LinearGradient colors={["rgba(0,0,0,0.45)", "transparent"]} style={{ position: "absolute", left: 0, right: 0, top: 0, height: 130 }} />
      </Animated.View>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        <View
          style={{
            marginTop: HERO - 34,
            backgroundColor: palette.surface,
            borderTopLeftRadius: 34,
            borderTopRightRadius: 34,
            paddingHorizontal: 22,
            paddingTop: 12,
            minHeight: 520,
          }}
        >
          <View style={{ alignSelf: "center", width: 44, height: 5, borderRadius: 3, backgroundColor: palette.line, marginBottom: 16 }} />

          <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Txt w="extrabold" size={25} style={{ lineHeight: 31, letterSpacing: -0.3 }}>
                {restaurant.restaurantName}
              </Txt>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 6 }}>
                <Ionicons name="location-outline" size={15} color={palette.muted} />
                <Txt size={13.5} color={palette.muted} numberOfLines={1} style={{ flex: 1 }}>
                  {restaurant.location}
                </Txt>
              </View>
            </View>
            {restaurant.logo ? <Picture uri={restaurant.logo} style={{ width: 52, height: 52, borderRadius: 16 }} /> : null}
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <Ionicons name="star" size={16} color={palette.amber} />
              <Txt w="bold" size={14.5}>
                {restaurant.rate > 0 ? restaurant.rate.toFixed(1) : "New"}
              </Txt>
              <Txt size={13} color={palette.muted}>
                {reviewCount ? `(${reviewCount} ${reviewCount === 1 ? "review" : "reviews"})` : "(no reviews yet)"}
              </Txt>
            </View>
            {state.open !== null && (
              <Pill
                label={state.open ? state.label || "Open now" : state.label || "Closed"}
                fg={state.open ? palette.success : palette.danger}
                bg={state.open ? palette.successTint : palette.dangerTint}
                icon="time-outline"
              />
            )}
          </View>

          {restaurant.cuisines?.length ? (
            <Txt size={13.5} color={palette.body} style={{ marginTop: 10 }}>
              {restaurant.cuisines.join(" · ")}
            </Txt>
          ) : null}

          <View style={{ marginTop: 20, marginBottom: 22 }}>
            <Segmented
              value={tab}
              onChange={setTab}
              options={[
                { key: "overview", label: "Overview" },
                { key: "menu", label: "Menu" },
                { key: "reviews", label: "Reviews", count: reviewCount || undefined },
              ]}
            />
          </View>

          {tab === "overview" && <Overview restaurant={restaurant} promotions={promotions ?? []} />}
          {tab === "menu" && <MenuTab restaurantId={restaurant.id} />}
          {tab === "reviews" && <ReviewsTab restaurant={restaurant} />}
        </View>
      </Animated.ScrollView>

      {/* Floating buttons over the photo, and a solid bar once it has scrolled away. */}
      <Animated.View
        pointerEvents="none"
        style={[
          { position: "absolute", top: 0, left: 0, right: 0, height: insets.top + 64, backgroundColor: palette.surface, borderBottomWidth: 1, borderColor: palette.line },
          barStyle,
        ]}
      >
        <Txt w="bold" size={16} numberOfLines={1} center style={{ marginTop: insets.top + 20, marginHorizontal: 120 }}>
          {restaurant.restaurantName}
        </Txt>
      </Animated.View>
      <View style={{ position: "absolute", top: insets.top + 10, left: 20, right: 20, flexDirection: "row", justifyContent: "space-between" }}>
        <IconButton
          icon="chevron-back"
          label="Go back"
          background="rgba(255,255,255,0.94)"
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)"))}
          testID="detail-back"
        />
        <View style={{ flexDirection: "row", gap: 10 }}>
          <IconButton icon="share-social-outline" label="Share" background="rgba(255,255,255,0.94)" onPress={() => shareRestaurant(restaurant)} />
          <SaveButton restaurant={restaurant} size={44} />
        </View>
      </View>

      <View
        style={[
          shadow.raised,
          {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: palette.surface,
            borderTopLeftRadius: 26,
            borderTopRightRadius: 26,
            paddingHorizontal: 22,
            paddingTop: 14,
            paddingBottom: Math.max(insets.bottom, 16) + 6,
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
          },
        ]}
      >
        {price > 0 && (
          <View>
            <Txt size={12} color={palette.muted}>
              Average spend
            </Txt>
            <Txt w="bold" size={16}>
              {formatKes(price)}
            </Txt>
          </View>
        )}
        <Button
          label={bookable ? "Book a Table" : "Not taking bookings"}
          disabled={!bookable}
          onPress={book}
          style={{ flex: 1 }}
          testID="book-table"
        />
      </View>
    </View>
  );
}
