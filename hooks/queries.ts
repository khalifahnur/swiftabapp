import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as API from "@/api/api";
import { useAuthStore, useUser } from "@/lib/authStore";
import { isOpenOrder } from "@/lib/format";
import { noteOwnChange } from "@/lib/ownChanges";
import type { CreateOrder, PaymentMethod, ReservationRequest } from "@/types";

/** Cache keys, in one place so writes can refresh exactly what they change. */
export const keys = {
  restaurants: (query = "") => ["restaurants", query] as const,
  nearby: (lat: number, lng: number) => ["restaurants", "nearby", lat.toFixed(3), lng.toFixed(3)] as const,
  restaurant: (id: string) => ["restaurant", id] as const,
  menu: (id: string) => ["menu", id] as const,
  layout: (id: string) => ["layout", id] as const,
  availability: (id: string, from: string, to: string) => ["availability", id, from, to] as const,
  reservations: (userId: string, list: API.ReservationList) => ["reservations", userId, list] as const,
  allReservations: ["reservations"] as const,
  orders: (userId: string) => ["orders", userId] as const,
  promotions: (restaurantId = "all") => ["promotions", restaurantId] as const,
  recentlyViewed: (userId: string) => ["recentlyViewed", userId] as const,
  tab: (userId: string, reservationId: string) => ["tab", userId, reservationId] as const,
};

const MINUTE = 60 * 1000;

// --- Restaurants -------------------------------------------------------------

export function useRestaurants(query = "") {
  return useQuery({
    queryKey: keys.restaurants(query),
    queryFn: () => API.fetchRestaurants(query),
    staleTime: 5 * MINUTE,
  });
}

export function useNearbyRestaurants(coords: { latitude: number; longitude: number } | null) {
  return useQuery({
    queryKey: coords ? keys.nearby(coords.latitude, coords.longitude) : ["restaurants", "nearby", "none"],
    queryFn: () => API.fetchNearbyRestaurants(coords!.latitude, coords!.longitude),
    enabled: Boolean(coords),
    staleTime: 5 * MINUTE,
  });
}

export function useRestaurant(id: string | undefined) {
  const client = useQueryClient();
  return useQuery({
    queryKey: keys.restaurant(id ?? ""),
    queryFn: () => API.fetchRestaurant(id!),
    enabled: Boolean(id),
    staleTime: 2 * MINUTE,
    // Show what the list already knows while the full profile loads.
    placeholderData: () => {
      const lists = client.getQueriesData<Awaited<ReturnType<typeof API.fetchRestaurants>>>({ queryKey: ["restaurants"] });
      for (const [, list] of lists) {
        const match = list?.find?.((r) => r.id === id);
        if (match) return match;
      }
      return undefined;
    },
  });
}

export function useMenuSections(restaurantId: string | undefined) {
  return useQuery({
    queryKey: keys.menu(restaurantId ?? ""),
    queryFn: () => API.fetchMenuSections(restaurantId!),
    enabled: Boolean(restaurantId),
    staleTime: MINUTE,
  });
}

export function usePromotions(restaurantId?: string) {
  return useQuery({
    queryKey: keys.promotions(restaurantId),
    queryFn: () => API.fetchPromotions(restaurantId),
    staleTime: 10 * MINUTE,
  });
}

export function useRecentlyViewed() {
  const user = useUser();
  return useQuery({
    queryKey: keys.recentlyViewed(user?.userId ?? ""),
    queryFn: () => API.fetchRecentlyViewed(user!.userId),
    enabled: Boolean(user?.userId),
    staleTime: MINUTE,
  });
}

export function useMarkViewed() {
  const user = useUser();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (restaurantId: string) =>
      user?.userId ? API.addRecentlyViewed(user.userId, restaurantId) : Promise.resolve(),
    onSuccess: () => {
      if (user?.userId) client.invalidateQueries({ queryKey: keys.recentlyViewed(user.userId) });
    },
  });
}

export function useAddReview(restaurantId: string) {
  const user = useUser();
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { rating: number; reviewTxt: string }) => API.addReview(user!.userId, restaurantId, input),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: keys.restaurant(restaurantId) });
      client.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });
}

// --- Tables ------------------------------------------------------------------

export function useLayout(restaurantId: string | undefined) {
  return useQuery({
    queryKey: keys.layout(restaurantId ?? ""),
    queryFn: () => API.fetchLayout(restaurantId!),
    enabled: Boolean(restaurantId),
    staleTime: MINUTE,
  });
}

/** Which tables are free for a time window. Refreshes so a table taken by someone else shows up. */
export function useAvailability(restaurantId: string | undefined, bookingFor: string | null, endTime: string | null) {
  return useQuery({
    queryKey: keys.availability(restaurantId ?? "", bookingFor ?? "", endTime ?? ""),
    queryFn: () => API.fetchAvailability({ restaurantId: restaurantId!, bookingFor: bookingFor!, endTime: endTime! }),
    enabled: Boolean(restaurantId && bookingFor && endTime),
    staleTime: 0,
    refetchInterval: 30 * 1000,
  });
}

// --- Reservations ------------------------------------------------------------

export function useReservations(list: API.ReservationList) {
  const user = useUser();
  return useQuery({
    queryKey: keys.reservations(user?.userId ?? "", list),
    queryFn: () => API.fetchReservations(user!.userId, list),
    enabled: Boolean(user?.userId),
    staleTime: 30 * 1000,
  });
}

export function useCreateReservation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { restaurantId: string; info: ReservationRequest }) => {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error("Please sign in to book a table.");
      return API.createReservation(user.userId, input.restaurantId, input.info);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: keys.allReservations });
      client.invalidateQueries({ queryKey: ["availability"] });
    },
  });
}

export function useCancelReservation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error("Please sign in again.");
      return API.cancelReservation(user.userId, id);
    },
    onSuccess: () => client.invalidateQueries({ queryKey: keys.allReservations }),
  });
}

// --- Orders ------------------------------------------------------------------

/** The diner's orders, newest first. Polls while any order is still open so progress shows up. */
export function useOrders() {
  const user = useUser();
  return useQuery({
    queryKey: keys.orders(user?.userId ?? ""),
    queryFn: () => API.fetchOrders(user!.userId),
    enabled: Boolean(user?.userId),
    staleTime: 10 * 1000,
    refetchInterval: (query) => (query.state.data?.some((o) => isOpenOrder(o.status)) ? 15 * 1000 : 60 * 1000),
  });
}

export function useCreateOrder() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (order: CreateOrder) => API.createOrder(order),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["orders"] });
      client.invalidateQueries({ queryKey: keys.allReservations });
    },
  });
}

export function useRequestBill() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: { orderId: string; paymentMethod: PaymentMethod }) =>
      API.requestBill(input.orderId, input.paymentMethod),
    onSuccess: (_result, input) => {
      noteOwnChange(input.orderId, "ready_to_pay");
      return client.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

export function useCancelOrder() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => API.cancelOrder(orderId),
    onSuccess: (_result, orderId) => {
      noteOwnChange(orderId, "cancelled");
      return client.invalidateQueries({ queryKey: ["orders"] });
    },
  });
}

// --- Account -----------------------------------------------------------------

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (input: { name: string; phoneNumber: string }) => {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error("Please sign in again.");
      return API.updateProfile(user.userId, input);
    },
    onSuccess: (user) => {
      const current = useAuthStore.getState().user;
      if (current) useAuthStore.getState().setUser({ ...current, ...user, userId: current.userId });
    },
  });
}

// --- Shared tab ----------------------------------------------------------------

/** A booking's shared tab. Polls while shown so friends appear as they join. */
export function useTab(reservationId: string | undefined, live: boolean) {
  const user = useUser();
  return useQuery({
    queryKey: keys.tab(user?.userId ?? "", reservationId ?? ""),
    queryFn: () => API.fetchTab(user!.userId, reservationId!),
    enabled: Boolean(user?.userId && reservationId && live),
    refetchInterval: (query) => (live && query.state.data?.open ? 15 * 1000 : false),
  });
}

/** Starts (open = true) or stops sharing a booking's menu. */
export function useShareTab(reservationId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (open: boolean) => {
      const user = useAuthStore.getState().user;
      if (!user) throw new Error("Please sign in again.");
      return open ? API.shareTab(user.userId, reservationId) : API.stopTab(user.userId, reservationId);
    },
    onSuccess: (tab) => {
      const user = useAuthStore.getState().user;
      if (user) client.setQueryData(keys.tab(user.userId, reservationId), tab);
      client.invalidateQueries({ queryKey: keys.allReservations });
    },
  });
}
