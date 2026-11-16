import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { errorMessage } from "@/api/client";
import { RestaurantRow } from "@/components/RestaurantCard";
import { Chip, EmptyState, ErrorState, Skeleton } from "@/components/ui/Bits";
import { IconButton } from "@/components/ui/Button";
import { Txt } from "@/components/ui/Txt";
import { fonts, palette, radius } from "@/constants/theme";
import { useRestaurants } from "@/hooks/queries";
import { useLocation } from "@/hooks/useLocation";
import { applyFilters, NO_FILTERS } from "@/lib/filters";
import { cuisinesOf, hasCoordinates, haversineKm } from "@/lib/restaurant";
import { usePrefs } from "@/store/usePrefs";

function useDebounced<T>(value: T, delay = 300): T {
  const [settled, setSettled] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return settled;
}

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const location = useLocation();
  const { recentSearches, addSearch, clearSearches } = usePrefs();
  const [text, setText] = useState("");
  const [openNow, setOpenNow] = useState(false);
  const term = useDebounced(text.trim());

  // Search what is already on the phone straight away, and ask the server too
  // so matches on dishes and descriptions are found.
  const all = useRestaurants();
  const remote = useRestaurants(term.length >= 2 ? term : "");

  const withDistance = useMemo(() => {
    const byId = new Map((all.data ?? []).map((r) => [r.id, r]));
    (term.length >= 2 ? remote.data ?? [] : []).forEach((r) => byId.set(r.id, r));
    return [...byId.values()].map((r) =>
      location.coords && hasCoordinates(r) ? { ...r, distanceKm: haversineKm(location.coords, r) } : r,
    );
  }, [all.data, remote.data, term, location.coords]);

  const results = useMemo(() => {
    const remoteIds = term.length >= 2 ? new Set((remote.data ?? []).map((r) => r.id)) : null;
    const local = applyFilters([...withDistance], { filters: { ...NO_FILTERS, openNow }, text: term });
    if (!remoteIds) return local;
    // Keep server-only matches (found by dish or description) after the local ones.
    const seen = new Set(local.map((r) => r.id));
    const extra = applyFilters(
      withDistance.filter((r) => remoteIds.has(r.id) && !seen.has(r.id)),
      { filters: { ...NO_FILTERS, openNow } },
    );
    return [...local, ...extra];
  }, [withDistance, remote.data, term, openNow]);

  const cuisines = useMemo(() => cuisinesOf(all.data ?? []).slice(0, 8), [all.data]);
  const searching = term.length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: palette.canvas }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 12, flexDirection: "row", alignItems: "center", gap: 10 }}>
        <IconButton icon="chevron-back" label="Go back" bordered onPress={() => (router.canGoBack() ? router.back() : router.replace("/(tabs)"))} />
        <View
          style={{
            flex: 1,
            height: 50,
            borderRadius: radius.pill,
            backgroundColor: palette.surface,
            borderWidth: 1.5,
            borderColor: palette.brand,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            gap: 8,
          }}
        >
          <Ionicons name="search" size={18} color={palette.muted} />
          <TextInput
            testID="search-input"
            autoFocus
            value={text}
            onChangeText={setText}
            onSubmitEditing={() => addSearch(text)}
            placeholder="Restaurant, cuisine or area"
            placeholderTextColor={palette.faint}
            returnKeyType="search"
            autoCorrect={false}
            style={{ flex: 1, fontFamily: fonts.medium, fontSize: 15, color: palette.ink }}
          />
          {text ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Clear search" hitSlop={8} onPress={() => setText("")}>
              <Ionicons name="close-circle" size={18} color={palette.faint} />
            </Pressable>
          ) : null}
        </View>
        <IconButton icon="map-outline" label="Show on a map" bordered onPress={() => router.push("/screens/map")} testID="open-map" />
      </View>

      <FlatList
        data={all.isLoading ? [] : results}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 32, gap: 10 }}
        renderItem={({ item }) => (
          <View onTouchEnd={() => addSearch(term)}>
            <RestaurantRow restaurant={item} />
          </View>
        )}
        ListHeaderComponent={
          <View style={{ gap: 14, marginBottom: 6 }}>
            {!searching && recentSearches.length > 0 && (
              <View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
                  <Txt w="bold" size={14.5}>
                    Recent searches
                  </Txt>
                  <Pressable accessibilityRole="button" hitSlop={8} onPress={clearSearches}>
                    <Txt w="semibold" size={13} color={palette.brandDark}>
                      Clear
                    </Txt>
                  </Pressable>
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {recentSearches.map((recent) => (
                    <Chip key={recent} label={recent} icon="time-outline" onPress={() => setText(recent)} />
                  ))}
                </View>
              </View>
            )}
            {!searching && cuisines.length > 0 && (
              <View>
                <Txt w="bold" size={14.5} style={{ marginBottom: 8 }}>
                  Popular cuisines
                </Txt>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {cuisines.map((cuisine) => (
                    <Chip key={cuisine} label={cuisine} onPress={() => setText(cuisine)} />
                  ))}
                </ScrollView>
              </View>
            )}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Txt w="bold" size={14.5}>
                {searching ? `${results.length} ${results.length === 1 ? "result" : "results"}` : "All restaurants"}
              </Txt>
              <Chip label="Open now" icon="time-outline" selected={openNow} onPress={() => setOpenNow((v) => !v)} />
            </View>
          </View>
        }
        ListEmptyComponent={
          all.isLoading ? (
            <View style={{ gap: 10 }}>
              <Skeleton height={104} round={20} />
              <Skeleton height={104} round={20} />
              <Skeleton height={104} round={20} />
            </View>
          ) : all.isError ? (
            <ErrorState message={errorMessage(all.error)} onRetry={() => all.refetch()} />
          ) : (
            <EmptyState
              icon="search-outline"
              title={searching ? `Nothing found for "${term}"` : "No restaurants to show"}
              message={searching ? "Check the spelling, or try a cuisine or an area instead." : "Turn off Open now to see places that are closed."}
            />
          )
        }
      />
    </View>
  );
}
