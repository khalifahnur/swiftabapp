import { pushOnce } from "@/lib/nav";
import { Icon } from "@/components/ui/Icon";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, SectionList, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { errorMessage } from "@/api/client";
import { DishRow } from "@/components/Details/MenuTab";
import { Chip, EmptyState, ErrorState, Skeleton, Stepper } from "@/components/ui/Bits";
import { Button, IconButton, tapFeedback } from "@/components/ui/Button";
import { Txt } from "@/components/ui/Txt";
import { fonts, palette, radius, shadow } from "@/constants/theme";
import { useMenuSections } from "@/hooks/queries";
import { formatKes } from "@/lib/format";
import { cartCount, cartTotal, useCart } from "@/store/useCart";
import type { MenuItem } from "@/types";

/** The menu for a booking: pick dishes and quantities, then review the cart. */
export default function OrderMenuScreen() {
  const { restaurantId } = useLocalSearchParams<{ restaurantId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { context, items, add, decrease } = useCart();
  const { data: sections, isLoading, isError, error, refetch } = useMenuSections(restaurantId);
  const [category, setCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const quantities = useMemo(() => new Map(items.map((i) => [i._id, i.quantity])), [items]);
  const count = cartCount(items);
  const total = cartTotal(items);

  const filled = useMemo(() => (sections ?? []).filter((s) => s.items.length > 0), [sections]);
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return filled
      .filter((s) => !category || s.key === category)
      .map((s) => ({
        title: s.label,
        key: s.key,
        data: needle
          ? s.items.filter((i) => `${i.name} ${i.description ?? ""} ${(i.tags ?? []).join(" ")}`.toLowerCase().includes(needle))
          : s.items,
      }))
      .filter((s) => s.data.length > 0);
  }, [filled, category, query]);

  const close = () => (router.canGoBack() ? router.back() : router.replace("/(tabs)/bookings"));
  const forThisRestaurant = context && context.restaurantId === restaurantId;

  const control = (item: MenuItem) => {
    const quantity = quantities.get(item._id) ?? 0;
    if (item.available === false) return null;
    if (quantity > 0) {
      return <Stepper compact value={quantity} onMinus={() => decrease(item._id)} onPlus={() => add(item)} />;
    }
    return (
      <Pressable
        testID={`add-${item._id}`}
        accessibilityRole="button"
        accessibilityLabel={`Add ${item.name}`}
        hitSlop={6}
        onPress={() => {
          tapFeedback();
          add(item);
        }}
        style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: palette.pine, alignItems: "center", justifyContent: "center" }}
      >
        <Icon name="add" size={20} color={palette.white} />
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: palette.canvas }}>
      <View style={{ paddingTop: insets.top + 10, paddingHorizontal: 20, paddingBottom: 12, flexDirection: "row", alignItems: "center" }}>
        <IconButton icon="close" label="Close menu" bordered onPress={close} testID="menu-close" />
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <Txt w="bold" size={17} numberOfLines={1}>
            {context?.restaurantName || "Menu"}
          </Txt>
          <Txt size={12.5} color={palette.muted}>
            {forThisRestaurant ? `Ordering for table ${context.tableNumber}` : "Menu"}
          </Txt>
        </View>
      </View>

      <View style={{ paddingHorizontal: 20 }}>
        <View
          style={{
            height: 48,
            borderRadius: radius.pill,
            backgroundColor: palette.surface,
            borderWidth: 1,
            borderColor: palette.line,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            gap: 8,
          }}
        >
          <Icon name="search" size={17} color={palette.muted} />
          <TextInput
            testID="menu-search"
            value={query}
            onChangeText={setQuery}
            placeholder="Search the menu"
            placeholderTextColor={palette.faint}
            autoCorrect={false}
            returnKeyType="search"
            style={{ flex: 1, fontFamily: fonts.medium, fontSize: 14.5, color: palette.ink }}
          />
          {query ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Clear search" hitSlop={8} onPress={() => setQuery("")}>
              <Icon name="close-circle" size={18} color={palette.faint} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {filled.length > 1 && (
        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingVertical: 12 }}>
            <Chip label="All" selected={category === null} onPress={() => setCategory(null)} />
            {filled.map((section) => (
              <Chip key={section.key} label={section.label} selected={category === section.key} onPress={() => setCategory(section.key)} />
            ))}
          </ScrollView>
        </View>
      )}

      {isLoading ? (
        <View style={{ padding: 20, gap: 12 }}>
          <Skeleton height={96} />
          <Skeleton height={96} />
          <Skeleton height={96} />
        </View>
      ) : isError ? (
        <ErrorState message={errorMessage(error)} onRetry={() => refetch()} />
      ) : (
        <SectionList
          sections={visible}
          keyExtractor={(item) => item._id}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: filled.length > 1 ? 0 : 14, paddingBottom: insets.bottom + (count ? 120 : 32) }}
          renderSectionHeader={({ section }) => (
            <Txt w="bold" size={16} style={{ marginTop: 10, marginBottom: 10 }}>
              {section.title}
            </Txt>
          )}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 10 }}>
              <DishRow item={item} right={forThisRestaurant ? <View style={{ marginLeft: 8 }}>{control(item)}</View> : undefined} />
            </View>
          )}
          ListEmptyComponent={
            <EmptyState
              icon="restaurant-outline"
              title={filled.length ? "No dishes match" : "Menu coming soon"}
              message={filled.length ? "Try another word or category." : "This restaurant has not published its dishes yet."}
            />
          }
        />
      )}

      {count > 0 && forThisRestaurant && (
        <Pressable
          testID="view-cart"
          accessibilityRole="button"
          accessibilityLabel={`View cart, ${count} items, ${formatKes(total)}`}
          onPress={() => pushOnce(router, "/screens/cart")}
          style={[
            shadow.raised,
            {
              position: "absolute",
              left: 20,
              right: 20,
              bottom: Math.max(insets.bottom, 16) + 8,
              height: 62,
              borderRadius: 31,
              backgroundColor: palette.pine,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 10,
            },
          ]}
        >
          <View style={{ minWidth: 42, height: 42, borderRadius: 21, backgroundColor: "rgba(255,255,255,0.16)", alignItems: "center", justifyContent: "center", paddingHorizontal: 8 }}>
            <Txt w="bold" size={15} color={palette.white}>
              {count}
            </Txt>
          </View>
          <Txt w="semibold" size={16} color={palette.white} style={{ flex: 1, marginLeft: 12 }}>
            View cart
          </Txt>
          <Txt w="bold" size={15.5} color={palette.white} style={{ marginRight: 12 }}>
            {formatKes(total)}
          </Txt>
        </Pressable>
      )}

      {!forThisRestaurant && !isLoading && (
        <View style={{ position: "absolute", left: 20, right: 20, bottom: Math.max(insets.bottom, 16) + 8 }}>
          <Button label="Book a table to order" onPress={() => router.replace({ pathname: "/screens/reserve", params: { id: restaurantId } })} />
        </View>
      )}
    </View>
  );
}
