import { pushOnce } from "@/lib/nav";
import { Icon } from "@/components/ui/Icon";
import { useRouter } from "expo-router";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { FlatList, Pressable, RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import FilterSheet from "@/components/Home/FilterSheet";
import Promotions from "@/components/Home/Promotions";
import { openRestaurant, RestaurantCard } from "@/components/RestaurantCard";
import { Chip, EmptyState, ErrorState, Picture, Skeleton } from "@/components/ui/Bits";
import { IconButton } from "@/components/ui/Button";
import { Txt } from "@/components/ui/Txt";
import { palette, radius, shadow, TAB_BAR_SPACE } from "@/constants/theme";
import { usePromotions, useRecentlyViewed, useReservations, useRestaurants } from "@/hooks/queries";
import { useLocation } from "@/hooks/useLocation";
import { errorMessage } from "@/api/client";
import { useUser } from "@/lib/authStore";
import { activeFilterCount, applyFilters, Filters, NO_FILTERS } from "@/lib/filters";
import { firstName, initials } from "@/lib/format";
import { cuisinesOf, hasCoordinates, haversineKm } from "@/lib/restaurant";
import { formatDayTime, untilLabel } from "@/lib/time";
import { useUnreadCount } from "@/store/useInbox";

const OFFERS = "__offers";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useUser();
  const unread = useUnreadCount();
  const location = useLocation();

  const restaurantsQuery = useRestaurants();
  const promotionsQuery = usePromotions();
  const recentQuery = useRecentlyViewed();
  const upcomingQuery = useReservations("active");

  const [category, setCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Distance is worked out on the phone once we know where the diner is.
  const restaurants = useMemo(() => {
    const list = restaurantsQuery.data ?? [];
    if (!location.coords) return list;
    return list.map((r) => (hasCoordinates(r) ? { ...r, distanceKm: haversineKm(location.coords!, r) } : r));
  }, [restaurantsQuery.data, location.coords]);

  const promotions = useMemo(() => promotionsQuery.data ?? [], [promotionsQuery.data]);
  const cuisines = useMemo(() => cuisinesOf(restaurants).slice(0, 10), [restaurants]);
  const amenities = useMemo(
    () => [...new Set(restaurants.flatMap((r) => r.amenities ?? []))].slice(0, 12),
    [restaurants],
  );

  const visible = useMemo(() => {
    const offerIds = category === OFFERS ? new Set(promotions.map((p) => p.restaurantId)) : null;
    return applyFilters([...restaurants], {
      filters,
      cuisine: category && category !== OFFERS ? category : null,
      onlyIds: offerIds,
    });
  }, [restaurants, promotions, category, filters]);

  const nextBooking = useMemo(
    () => [...(upcomingQuery.data ?? [])].sort((a, b) => a.bookingFor.localeCompare(b.bookingFor))[0],
    [upcomingQuery.data],
  );
  const recent = (recentQuery.data ?? []).slice(0, 8);
  const filterCount = activeFilterCount(filters);

  const refresh = async () => {
    setRefreshing(true);
    await Promise.allSettled([
      restaurantsQuery.refetch(),
      promotionsQuery.refetch(),
      recentQuery.refetch(),
      upcomingQuery.refetch(),
      location.load(true),
    ]);
    setRefreshing(false);
  };

  const header = (
    <View>
      {/* Greeting */}
      <View style={{ paddingHorizontal: 20, paddingTop: insets.top + 10, flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <Txt size={13} color={palette.muted}>
            {moment().format("dddd, D MMMM")}
          </Txt>
          <Txt w="extrabold" size={26} style={{ lineHeight: 32, letterSpacing: -0.4 }} numberOfLines={1}>
            Hi, {firstName(user?.name)} 👋
          </Txt>
        </View>
        <IconButton
          icon="notifications-outline"
          label={unread ? `Notifications, ${unread} unread` : "Notifications"}
          bordered
          badge={unread > 0 ? unread : false}
          onPress={() => pushOnce(router, "/screens/notifications")}
          testID="open-notifications"
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Your profile"
          onPress={() => pushOnce(router, "/(tabs)/settings")}
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: palette.pine, alignItems: "center", justifyContent: "center", marginLeft: 10 }}
        >
          <Txt w="bold" size={15} color={palette.white}>
            {initials(user?.name)}
          </Txt>
        </Pressable>
      </View>

      {/* Location */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Update your location"
        onPress={() => location.load(true)}
        style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 20, marginTop: 10 }}
      >
        <Icon name="location" size={15} color={palette.brand} />
        <Txt w="medium" size={13} color={palette.body} numberOfLines={1} style={{ flexShrink: 1 }}>
          {location.status === "loading"
            ? "Finding where you are…"
            : location.label || (location.status === "denied" ? "Turn on location to see what is near you" : "Nairobi, Kenya")}
        </Txt>
        <Icon name="chevron-down" size={13} color={palette.muted} />
      </Pressable>

      {/* Search and filters */}
      <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: 20, marginTop: 16 }}>
        <Pressable
          testID="open-search"
          accessibilityRole="search"
          accessibilityLabel="Search restaurants"
          onPress={() => pushOnce(router, "/screens/search")}
          style={{
            flex: 1,
            height: 48,
            borderRadius: radius.pill,
            backgroundColor: palette.surface,
            borderWidth: 1,
            borderColor: palette.line,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 18,
            gap: 10,
          }}
        >
          <Icon name="search" size={19} color={palette.muted} />
          <Txt size={14.5} color={palette.faint} numberOfLines={1} style={{ flex: 1 }}>
            Search restaurants
          </Txt>
        </Pressable>
        <Pressable
          testID="open-filters"
          accessibilityRole="button"
          accessibilityLabel={filterCount ? `Filters, ${filterCount} active` : "Filters"}
          onPress={() => setFiltersOpen(true)}
          style={{
            height: 48,
            paddingHorizontal: 18,
            borderRadius: radius.pill,
            backgroundColor: filterCount ? palette.pine : palette.surface,
            borderWidth: 1,
            borderColor: filterCount ? palette.pine : palette.line,
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
          }}
        >
          <Icon name="options-outline" size={18} color={filterCount ? palette.white : palette.ink} />
          <Txt w="semibold" size={13.5} color={filterCount ? palette.white : palette.ink}>
            {filterCount ? `Filters · ${filterCount}` : "Filters"}
          </Txt>
        </Pressable>
      </View>

      {/* Next booking */}
      {nextBooking && (
        <Pressable
          testID="next-booking"
          accessibilityRole="button"
          accessibilityLabel={`Your next booking at ${nextBooking.restaurantName}`}
          onPress={() => pushOnce(router, "/(tabs)/bookings")}
          style={[
            shadow.card,
            {
              marginHorizontal: 20,
              marginTop: 18,
              borderRadius: radius.lg,
              backgroundColor: palette.pine,
              padding: 14,
              flexDirection: "row",
              alignItems: "center",
            },
          ]}
        >
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(255,255,255,0.14)", alignItems: "center", justifyContent: "center" }}>
            <Icon name="calendar" size={20} color={palette.white} />
          </View>
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Txt w="bold" size={14.5} color={palette.white} numberOfLines={1}>
              {nextBooking.restaurantName} · {untilLabel(nextBooking.bookingFor)}
            </Txt>
            <Txt size={12.5} color="rgba(255,255,255,0.78)" numberOfLines={1}>
              {formatDayTime(nextBooking.bookingFor)} · Table {nextBooking.table}
            </Txt>
          </View>
          <Icon name="chevron-forward" size={18} color={palette.white} />
        </Pressable>
      )}

      <Promotions promotions={promotions} restaurants={restaurants} />

      {/* Recently viewed */}
      {recent.length > 0 && (
        <View style={{ marginTop: 22 }}>
          <Txt w="bold" size={17} style={{ paddingHorizontal: 20, marginBottom: 12 }}>
            Jump back in
          </Txt>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}>
            {recent.map((r) => (
              <Pressable
                key={r.id}
                accessibilityRole="button"
                accessibilityLabel={r.restaurantName}
                onPress={() => openRestaurant(router, r.id)}
                style={{ width: 132 }}
              >
                <Picture uri={r.image} style={{ width: 132, height: 96, borderRadius: 18 }} />
                <Txt w="semibold" size={13.5} numberOfLines={1} style={{ marginTop: 7 }}>
                  {r.restaurantName}
                </Txt>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Icon name="star" size={11} color={palette.amber} />
                  <Txt size={12} color={palette.muted}>
                    {r.rate > 0 ? r.rate.toFixed(1) : "New"}
                  </Txt>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Categories */}
      <View style={{ marginTop: 24 }}>
        <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 12 }}>
          <Txt w="bold" size={19}>
            {location.coords ? "Restaurants near you" : "Restaurants"}
          </Txt>
          {restaurantsQuery.data ? (
            <Txt size={13} color={palette.muted}>
              {visible.length} {visible.length === 1 ? "place" : "places"}
            </Txt>
          ) : null}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}>
          <Chip label="All" selected={category === null} onPress={() => setCategory(null)} />
          {promotions.length > 0 && (
            <Chip label="Offers" icon="pricetag" selected={category === OFFERS} onPress={() => setCategory(category === OFFERS ? null : OFFERS)} />
          )}
          {cuisines.map((cuisine) => (
            <Chip key={cuisine} label={cuisine} selected={category === cuisine} onPress={() => setCategory(category === cuisine ? null : cuisine)} />
          ))}
        </ScrollView>
      </View>
      <View style={{ height: 16 }} />
    </View>
  );

  const empty = restaurantsQuery.isLoading ? (
    <View style={{ paddingHorizontal: 20, gap: 16 }}>
      <Skeleton height={300} round={28} />
      <Skeleton height={300} round={28} />
    </View>
  ) : restaurantsQuery.isError ? (
    <ErrorState message={errorMessage(restaurantsQuery.error)} onRetry={() => restaurantsQuery.refetch()} />
  ) : (
    <EmptyState
      icon="restaurant-outline"
      title={restaurants.length ? "Nothing matches those filters" : "No restaurants yet"}
      message={restaurants.length ? "Try a different cuisine or clear the filters." : "New places are joining Swiftab. Pull down to check again."}
      action={
        restaurants.length ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setFilters(NO_FILTERS);
              setCategory(null);
            }}
            style={{ alignSelf: "center", height: 44, paddingHorizontal: 22, borderRadius: 22, backgroundColor: palette.pine, justifyContent: "center" }}
          >
            <Txt w="semibold" color={palette.white}>
              Clear filters
            </Txt>
          </Pressable>
        ) : undefined
      }
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: palette.canvas }}>
      <FlatList
        testID="home-list"
        data={restaurantsQuery.isLoading || restaurantsQuery.isError ? [] : visible}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RestaurantCard restaurant={item} style={{ marginHorizontal: 20, marginBottom: 18 }} />}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_SPACE }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={palette.brand} colors={[palette.brand]} />}
        initialNumToRender={4}
        windowSize={7}
      />
      <FilterSheet visible={filtersOpen} value={filters} amenities={amenities} onApply={setFilters} onClose={() => setFiltersOpen(false)} />
    </View>
  );
}
