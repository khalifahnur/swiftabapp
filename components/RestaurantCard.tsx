import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";

import { IconButton } from "@/components/ui/Button";
import { Picture } from "@/components/ui/Bits";
import { Txt } from "@/components/ui/Txt";
import { palette, radius, shadow } from "@/constants/theme";
import { averagePrice, distanceLabel, openState, priceLevel, todayHoursLabel } from "@/lib/restaurant";
import { useToast } from "@/lib/ToastContext";
import { useIsSaved, useWishlist } from "@/store/useWishlist";
import type { Restaurant } from "@/types";

export function openRestaurant(router: ReturnType<typeof useRouter>, id: string) {
  router.push({ pathname: "/screens/restaurantdetails", params: { id } });
}

export function SaveButton({ restaurant, size = 38 }: { restaurant: Restaurant; size?: number }) {
  const saved = useIsSaved(restaurant.id);
  const toggle = useWishlist((s) => s.toggle);
  const { showToast } = useToast();
  return (
    <IconButton
      icon={saved ? "heart" : "heart-outline"}
      label={saved ? "Remove from saved" : "Save restaurant"}
      size={size}
      color={saved ? palette.danger : palette.ink}
      background="rgba(255,255,255,0.94)"
      onPress={() => showToast("success", toggle(restaurant) ? "Saved to your list" : "Removed from saved")}
    />
  );
}

function RatingBadge({ rate }: { rate: number }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "rgba(255,255,255,0.94)",
        paddingHorizontal: 9,
        height: 28,
        borderRadius: 14,
      }}
    >
      <Ionicons name="star" size={12} color={palette.amber} />
      <Txt w="bold" size={12.5} style={{ lineHeight: 16 }}>
        {rate > 0 ? rate.toFixed(1) : "New"}
      </Txt>
    </View>
  );
}

/** The large picture card used on the home feed. */
export function RestaurantCard({ restaurant, style }: { restaurant: Restaurant; style?: StyleProp<ViewStyle> }) {
  const router = useRouter();
  const state = openState(restaurant);
  const price = priceLevel(averagePrice(restaurant));
  const distance = distanceLabel(restaurant.distanceKm);
  const hours = todayHoursLabel(restaurant);
  const tags = [...(restaurant.cuisines ?? []).slice(0, 2), price].filter(Boolean);

  return (
    <Pressable
      testID={`restaurant-${restaurant.id}`}
      accessibilityRole="button"
      accessibilityLabel={`${restaurant.restaurantName}, ${restaurant.location}`}
      onPress={() => openRestaurant(router, restaurant.id)}
      style={({ pressed }) => [
        shadow.card,
        {
          backgroundColor: palette.surface,
          borderRadius: radius.xl,
          overflow: "hidden",
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
        style,
      ]}
    >
      <View style={{ height: 190 }}>
        <Picture uri={restaurant.image} style={{ width: "100%", height: "100%" }} />
        <LinearGradient
          colors={["rgba(0,0,0,0.28)", "transparent", "rgba(0,0,0,0.5)"]}
          locations={[0, 0.42, 1]}
          style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
        />
        <View style={{ position: "absolute", top: 12, left: 12, right: 12, flexDirection: "row", justifyContent: "space-between" }}>
          <RatingBadge rate={restaurant.rate} />
          <SaveButton restaurant={restaurant} />
        </View>
        <View style={{ position: "absolute", left: 14, right: 14, bottom: 12, flexDirection: "row", alignItems: "center", gap: 8 }}>
          {state.open !== null && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                paddingHorizontal: 9,
                height: 26,
                borderRadius: 13,
                backgroundColor: state.open ? "rgba(30,158,106,0.95)" : "rgba(15,31,29,0.78)",
              }}
            >
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: palette.white }} />
              <Txt w="semibold" size={11.5} color={palette.white} style={{ lineHeight: 15 }}>
                {state.open ? "Open now" : "Closed"}
              </Txt>
            </View>
          )}
          {distance ? (
            <View style={{ paddingHorizontal: 9, height: 26, borderRadius: 13, backgroundColor: "rgba(15,31,29,0.6)", justifyContent: "center" }}>
              <Txt w="semibold" size={11.5} color={palette.white} style={{ lineHeight: 15 }}>
                {distance} away
              </Txt>
            </View>
          ) : null}
        </View>
      </View>

      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Txt w="bold" size={18} numberOfLines={1} style={{ flex: 1 }}>
            {restaurant.restaurantName}
          </Txt>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
            <Txt w="semibold" size={13} color={palette.brandDark}>
              View
            </Txt>
            <Ionicons name="chevron-forward" size={14} color={palette.brandDark} />
          </View>
        </View>

        {tags.length > 0 && (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 9 }}>
            {tags.map((tag) => (
              <View key={tag} style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: palette.canvas }}>
                <Txt w="medium" size={12} color={palette.body} style={{ lineHeight: 16 }}>
                  {tag}
                </Txt>
              </View>
            ))}
          </View>
        )}

        <View style={{ marginTop: 11, gap: 5 }}>
          {hours ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
              <Ionicons name="time-outline" size={14} color={palette.muted} />
              <Txt size={13} color={palette.body} numberOfLines={1} style={{ flex: 1 }}>
                {state.open === false && state.label ? state.label : hours}
              </Txt>
            </View>
          ) : null}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
            <Ionicons name="location-outline" size={14} color={palette.muted} />
            <Txt size={13} color={palette.body} numberOfLines={1} style={{ flex: 1 }}>
              {restaurant.location}
            </Txt>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

/** A compact row card, for search results and lists. */
export function RestaurantRow({ restaurant, right }: { restaurant: Pick<Restaurant, "id" | "restaurantName" | "image" | "location" | "rate" | "cuisines"> & Partial<Restaurant>; right?: React.ReactNode }) {
  const router = useRouter();
  const state = restaurant.openingHours ? openState(restaurant as Restaurant) : { open: null, label: "" };
  const distance = distanceLabel(restaurant.distanceKm);
  return (
    <Pressable
      testID={`row-${restaurant.id}`}
      accessibilityRole="button"
      accessibilityLabel={restaurant.restaurantName}
      onPress={() => openRestaurant(router, restaurant.id)}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: palette.surface,
        borderRadius: radius.lg,
        padding: 10,
        borderWidth: 1,
        borderColor: palette.line,
        opacity: pressed ? 0.9 : 1,
      })}
    >
      <Picture uri={restaurant.image} style={{ width: 84, height: 84, borderRadius: 16 }} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Txt w="bold" size={15.5} numberOfLines={1}>
          {restaurant.restaurantName}
        </Txt>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
          <Ionicons name="star" size={12} color={palette.amber} />
          <Txt w="semibold" size={12.5}>
            {restaurant.rate > 0 ? restaurant.rate.toFixed(1) : "New"}
          </Txt>
          {restaurant.cuisines?.length ? (
            <Txt size={12.5} color={palette.muted} numberOfLines={1} style={{ flex: 1 }}>
              · {restaurant.cuisines.slice(0, 2).join(", ")}
            </Txt>
          ) : null}
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 5 }}>
          <Ionicons name="location-outline" size={13} color={palette.muted} />
          <Txt size={12.5} color={palette.muted} numberOfLines={1} style={{ flex: 1 }}>
            {distance ? `${distance} · ` : ""}
            {restaurant.location}
          </Txt>
        </View>
        {state.open !== null && (
          <Txt w="semibold" size={12} color={state.open ? palette.success : palette.danger} style={{ marginTop: 4 }}>
            {state.open ? "Open now" : state.label || "Closed"}
          </Txt>
        )}
      </View>
      {right ?? <Ionicons name="chevron-forward" size={18} color={palette.faint} style={{ marginLeft: 6 }} />}
    </Pressable>
  );
}
