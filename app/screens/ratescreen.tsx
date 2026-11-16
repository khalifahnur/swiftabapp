import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { errorMessage } from "@/api/client";
import { ScreenHeader, Stars } from "@/components/ui/Bits";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Txt } from "@/components/ui/Txt";
import { palette, radius } from "@/constants/theme";
import { useAddReview } from "@/hooks/queries";
import { useToast } from "@/lib/ToastContext";

const WORDS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

/** Leave a star rating and a few words about a restaurant. */
export default function RateScreen() {
  const { restaurantId, restaurantName } = useLocalSearchParams<{ restaurantId: string; restaurantName: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const review = useAddReview(restaurantId ?? "");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  const submit = () => {
    if (!restaurantId || rating === 0) return;
    review.mutate(
      { rating, reviewTxt: text.trim() },
      {
        onSuccess: () => {
          showToast("success", "Thanks! Your review has been posted.");
          router.back();
        },
        onError: (error) => showToast("error", errorMessage(error, "We could not post your review.")),
      },
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.canvas }}>
      <ScreenHeader title="Rate your visit" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 32 }}>
          <View style={{ alignItems: "center", backgroundColor: palette.surface, borderRadius: radius.xl, padding: 24, borderWidth: 1, borderColor: palette.line, marginBottom: 18 }}>
            <Txt size={13.5} color={palette.muted}>
              How was
            </Txt>
            <Txt w="extrabold" size={22} center style={{ marginTop: 2, marginBottom: 18 }}>
              {restaurantName || "the restaurant"}?
            </Txt>
            <Stars value={rating} size={40} onChange={setRating} />
            <Txt w="semibold" size={14} color={rating ? palette.brandDark : palette.muted} style={{ marginTop: 12 }}>
              {rating ? WORDS[rating] : "Tap a star to rate"}
            </Txt>
          </View>

          <Field
            label="Tell others about it (optional)"
            placeholder="What stood out? Food, service, atmosphere…"
            value={text}
            onChangeText={(value) => setText(value.slice(0, 500))}
            multiline
            autoCapitalize="sentences"
            autoCorrect
            hint={`${text.length}/500`}
            testID="review-text"
          />

          <Button label="Post review" disabled={rating === 0} loading={review.isPending} onPress={submit} testID="review-submit" />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
