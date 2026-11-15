import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Pressable, useWindowDimensions, View } from "react-native";

import { openRestaurant } from "@/components/RestaurantCard";
import { Picture } from "@/components/ui/Bits";
import { Txt } from "@/components/ui/Txt";
import { palette, radius } from "@/constants/theme";
import { fromApi } from "@/lib/time";
import type { Promotion, Restaurant } from "@/types";

/** A swipeable strip of current offers. Tapping one opens the restaurant running it. */
export default function Promotions({ promotions, restaurants }: { promotions: Promotion[]; restaurants: Restaurant[] }) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const cardWidth = width - 40;

  if (promotions.length === 0) return null;

  return (
    <View style={{ marginTop: 20 }}>
      <FlatList
        horizontal
        data={promotions}
        keyExtractor={(p) => p._id}
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + 12}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
        onMomentumScrollEnd={(event) => setIndex(Math.round(event.nativeEvent.contentOffset.x / (cardWidth + 12)))}
        renderItem={({ item }) => {
          const restaurant = restaurants.find((r) => r.id === item.restaurantId);
          const headline = item.discountPercentage ? `${Math.round(item.discountPercentage)}% off` : item.title;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${item.title}${restaurant ? ` at ${restaurant.restaurantName}` : ""}`}
              disabled={!restaurant}
              onPress={() => restaurant && openRestaurant(router, restaurant.id)}
              style={{ width: cardWidth, height: 148, borderRadius: radius.xl, overflow: "hidden", backgroundColor: palette.pine }}
            >
              <Picture uri={item.image || restaurant?.image} style={{ position: "absolute", width: "100%", height: "100%" }} />
              <LinearGradient
                colors={["rgba(11,59,54,0.96)", "rgba(11,59,54,0.78)", "rgba(11,59,54,0.15)"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
              />
              <View style={{ flex: 1, padding: 18, justifyContent: "center", maxWidth: "78%" }}>
                <View style={{ alignSelf: "flex-start", backgroundColor: palette.amber, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, marginBottom: 8 }}>
                  <Txt w="bold" size={11} color={palette.ink} style={{ lineHeight: 15 }}>
                    OFFER
                  </Txt>
                </View>
                <Txt w="extrabold" size={22} color={palette.white} numberOfLines={1}>
                  {headline}
                </Txt>
                <Txt size={13} color="rgba(255,255,255,0.86)" numberOfLines={2} style={{ marginTop: 3 }}>
                  {item.discountPercentage ? item.title : item.description}
                  {restaurant ? ` · ${restaurant.restaurantName}` : ""}
                </Txt>
                <Txt size={11.5} color="rgba(255,255,255,0.66)" style={{ marginTop: 6 }}>
                  Until {fromApi(item.endDate).format("D MMM")}
                </Txt>
              </View>
            </Pressable>
          );
        }}
      />
      {promotions.length > 1 && (
        <View style={{ flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 10 }}>
          {promotions.map((p, i) => (
            <View
              key={p._id}
              style={{ width: i === index ? 18 : 6, height: 6, borderRadius: 3, backgroundColor: i === index ? palette.pine : palette.line }}
            />
          ))}
        </View>
      )}
    </View>
  );
}
