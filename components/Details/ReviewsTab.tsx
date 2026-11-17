import { pushOnce } from "@/lib/nav";
import { useRouter } from "expo-router";
import moment from "moment";
import React, { useState } from "react";
import { View } from "react-native";

import { EmptyState, Stars } from "@/components/ui/Bits";
import { Button } from "@/components/ui/Button";
import { Txt } from "@/components/ui/Txt";
import { palette, radius } from "@/constants/theme";
import { initials } from "@/lib/format";
import type { Restaurant } from "@/types";

const PAGE = 5;

export default function ReviewsTab({ restaurant }: { restaurant: Restaurant }) {
  const router = useRouter();
  const [shown, setShown] = useState(PAGE);
  const reviews = [...restaurant.review].sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
  const average = reviews.length ? reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length : 0;

  const write = (
    <Button
      label={reviews.length ? "Write a review" : "Be the first to review"}
      variant="soft"
      icon="create-outline"
      onPress={() =>
        pushOnce(router, { pathname: "/screens/ratescreen", params: { restaurantId: restaurant.id, restaurantName: restaurant.restaurantName } })
      }
      testID="write-review"
    />
  );

  if (reviews.length === 0) {
    return <EmptyState icon="chatbubbles-outline" title="No reviews yet" message="Dined here? Tell others how it went." action={write} />;
  }

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 18, padding: 16, borderRadius: radius.lg, backgroundColor: palette.canvas }}>
        <View style={{ alignItems: "center" }}>
          <Txt w="extrabold" size={36} style={{ lineHeight: 42 }}>
            {average.toFixed(1)}
          </Txt>
          <Stars value={average} size={13} />
          <Txt size={12} color={palette.muted} style={{ marginTop: 4 }}>
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </Txt>
        </View>
        <View style={{ flex: 1, gap: 5 }}>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => Math.round(r.rating) === star).length;
            return (
              <View key={star} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Txt w="medium" size={11.5} color={palette.muted} style={{ width: 8 }}>
                  {star}
                </Txt>
                <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: palette.line, overflow: "hidden" }}>
                  <View style={{ width: `${(count / reviews.length) * 100}%`, height: 6, borderRadius: 3, backgroundColor: palette.amber }} />
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <View style={{ marginVertical: 16 }}>{write}</View>

      <View style={{ gap: 12 }}>
        {reviews.slice(0, shown).map((review, index) => (
          <View key={`${review.userId ?? review.name}-${index}`} style={{ padding: 14, borderRadius: radius.lg, borderWidth: 1, borderColor: palette.line }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: palette.brandTint, alignItems: "center", justifyContent: "center" }}>
                <Txt w="bold" size={13} color={palette.pine}>
                  {initials(review.name)}
                </Txt>
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Txt w="semibold" size={14} numberOfLines={1}>
                  {review.name || "Swiftab diner"}
                </Txt>
                <Stars value={Number(review.rating) || 0} size={12} />
              </View>
              {review.createdAt ? (
                <Txt size={11.5} color={palette.muted}>
                  {moment(review.createdAt).fromNow()}
                </Txt>
              ) : null}
            </View>
            {review.reviewTxt ? (
              <Txt size={13.5} color={palette.body} style={{ marginTop: 9, lineHeight: 20 }}>
                {review.reviewTxt}
              </Txt>
            ) : null}
          </View>
        ))}
      </View>
      {reviews.length > shown && (
        <Button label={`Show more (${reviews.length - shown})`} variant="outline" size="md" style={{ marginTop: 14 }} onPress={() => setShown((n) => n + PAGE)} />
      )}
    </View>
  );
}
