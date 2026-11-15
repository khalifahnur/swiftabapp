import { useRouter } from "expo-router";
import React from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RestaurantRow } from "@/components/RestaurantCard";
import { EmptyState } from "@/components/ui/Bits";
import { Button, IconButton } from "@/components/ui/Button";
import { Txt } from "@/components/ui/Txt";
import { palette, TAB_BAR_SPACE } from "@/constants/theme";
import { useToast } from "@/lib/ToastContext";
import { useWishlist } from "@/store/useWishlist";

/** Restaurants the diner has saved. Kept on the phone, so it works offline. */
export default function WishlistScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showToast } = useToast();
  const { saved, remove } = useWishlist();

  return (
    <View style={{ flex: 1, backgroundColor: palette.canvas }}>
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 20, paddingBottom: 12 }}>
        <Txt w="extrabold" size={26} style={{ letterSpacing: -0.4 }}>
          Saved places
        </Txt>
        <Txt size={13.5} color={palette.muted}>
          {saved.length ? `${saved.length} ${saved.length === 1 ? "restaurant" : "restaurants"} you want to come back to` : "Tap the heart on a restaurant to keep it here"}
        </Txt>
      </View>
      <FlatList
        data={saved}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: insets.bottom + TAB_BAR_SPACE, gap: 10, flexGrow: 1 }}
        renderItem={({ item }) => (
          <RestaurantRow
            restaurant={item}
            right={
              <IconButton
                icon="heart"
                label={`Remove ${item.restaurantName} from saved`}
                size={38}
                color={palette.danger}
                background={palette.dangerTint}
                style={{ marginLeft: 6 }}
                onPress={() => {
                  remove(item.id);
                  showToast("info", "Removed from saved");
                }}
              />
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="heart-outline"
            title="Nothing saved yet"
            message="Keep a list of places to try and you can book them in a couple of taps."
            action={<Button label="Explore restaurants" onPress={() => router.navigate("/(tabs)")} />}
          />
        }
      />
    </View>
  );
}
