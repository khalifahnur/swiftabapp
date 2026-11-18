import type {
  AuthData,
  AuthResponse,
  AuthUser,
  CreateOrder,
  Floor,
  FloorTable,
  Layout,
  MenuSection,
  Order,
  PaymentMethod,
  Promotion,
  Reservation,
  ReservationCreated,
  ReservationRequest,
  Restaurant,
  RestaurantDoc,
  TableAvailability,
  TabInfo,
} from "@/types";

import { api } from "./client";
import { flattenRestaurants } from "@/lib/restaurant";

/**
 * Every call the app makes to the Swiftab API. Functions reject with an
 * ApiError whose message can be shown to the person using the app.
 */

type Message = { message: string };

// --- Account -----------------------------------------------------------------

export async function loginUser(data: AuthData): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/users/login", {
    email: data.email.trim(),
    password: data.password,
  });
  return res.data;
}

export async function signUpUser(data: AuthData): Promise<Message> {
  const res = await api.post<Message>("/users/signup", {
    name: data.name?.trim(),
    email: data.email.trim(),
    phoneNumber: data.phoneNumber?.trim(),
    password: data.password,
  });
  return res.data;
}

export async function forgotPassword(email: string): Promise<Message & { email: string }> {
  return (await api.post("/users/password/forgot", { email: email.trim() })).data;
}

export async function verifyCode(input: {
  email: string;
  verificationCode: string;
}): Promise<{ email: string; resetToken: string }> {
  return (await api.post("/users/password/verify", input)).data;
}

export async function resetPassword(input: { resetToken: string; newPassword: string }): Promise<Message> {
  return (await api.post<Message>("/users/password/reset", input)).data;
}

export async function updateProfile(
  userId: string,
  input: { name: string; phoneNumber: string },
): Promise<AuthUser> {
  const res = await api.put<{ user: AuthUser }>(`/users/${userId}/profile`, input);
  return res.data.user;
}

export async function registerPushToken(userId: string, token: string): Promise<void> {
  await api.post(`/users/${userId}/push-token`, { token });
}

export async function removePushToken(userId: string, token: string): Promise<void> {
  await api.delete(`/users/${userId}/push-token`, { data: { token } });
}

// --- Restaurants -------------------------------------------------------------

export async function fetchRestaurants(query?: string): Promise<Restaurant[]> {
  const res = await api.get<{ restaurants: RestaurantDoc[] }>("/users/restaurants", {
    params: query?.trim() ? { q: query.trim() } : undefined,
  });
  return flattenRestaurants(res.data.restaurants);
}

export async function fetchNearbyRestaurants(
  latitude: number,
  longitude: number,
  radiusKm = 25,
): Promise<Restaurant[]> {
  const res = await api.get<RestaurantDoc[]>("/users/restaurants/nearby", {
    params: { lat: latitude, lng: longitude, radiusKm },
  });
  return flattenRestaurants(res.data);
}

export async function fetchRestaurant(restaurantId: string): Promise<Restaurant> {
  const res = await api.get<{ restaurant: RestaurantDoc }>(`/restaurants/${restaurantId}`);
  const [restaurant] = flattenRestaurants([res.data.restaurant]);
  if (!restaurant) throw new Error("Restaurant not found");
  return restaurant;
}

export async function fetchMenuSections(restaurantId: string): Promise<MenuSection[]> {
  const res = await api.get<{ categories: MenuSection[] }>(`/restaurants/${restaurantId}/menu/sections`);
  return (res.data.categories ?? []).map((c) => ({ ...c, items: c.items ?? [] }));
}

export async function fetchRecentlyViewed(userId: string): Promise<Restaurant[]> {
  const res = await api.get<{ restaurants: RestaurantDoc[] }>(`/users/${userId}/recently-viewed`);
  return flattenRestaurants(res.data.restaurants);
}

export async function addRecentlyViewed(userId: string, restaurantId: string): Promise<void> {
  await api.post(`/users/${userId}/recently-viewed`, { restaurantId });
}

export async function fetchPromotions(restaurantId?: string): Promise<Promotion[]> {
  const res = await api.get<{ promotions: Promotion[] }>("/users/promotions", {
    params: restaurantId ? { restaurantId } : undefined,
  });
  return res.data.promotions ?? [];
}

export async function addReview(
  userId: string,
  restaurantId: string,
  input: { rating: number; reviewTxt: string },
): Promise<Message> {
  return (await api.post<Message>(`/users/${userId}/restaurants/${restaurantId}/reviews`, input)).data;
}

// --- Tables ------------------------------------------------------------------

export async function fetchLayout(restaurantId: string): Promise<Layout> {
  const res = await api.get<{
    restaurantLayoutData?: { floors?: Floor[]; diningAreas?: string[]; tablePosition?: FloorTable[] };
  }>(`/restaurants/${restaurantId}/tables`);
  const layout = res.data.restaurantLayoutData;
  const tables = (layout?.tablePosition ?? []).map((t) => ({ ...t, chairs: t.chairs ?? [] }));
  let floors = layout?.floors ?? [];
  if (floors.length === 0) {
    // Layouts saved before floors had ids: areas are numbered from 1.
    floors = (layout?.diningAreas ?? []).map((name, i) => ({ id: String(i + 1), name }));
  }
  return { floors, tables };
}

export async function fetchAvailability(input: {
  restaurantId: string;
  bookingFor: string;
  endTime: string;
}): Promise<TableAvailability[]> {
  const res = await api.post<{ availability: TableAvailability[] }>("/reservations/availability", input);
  return res.data.availability ?? [];
}

// --- Reservations ------------------------------------------------------------

export async function createReservation(
  userId: string,
  restaurantId: string,
  reservationInfo: ReservationRequest,
): Promise<ReservationCreated> {
  const res = await api.post<{ responseData: ReservationCreated }>(
    `/users/${userId}/restaurants/${restaurantId}/reservations`,
    { data: { reservationInfo } },
  );
  return res.data.responseData;
}

export type ReservationList = "active" | "completed" | "cancelled";

export async function fetchReservations(userId: string, list: ReservationList): Promise<Reservation[]> {
  const res = await api.get<Reservation[] | null>(`/users/${userId}/reservations/${list}`);
  return Array.isArray(res.data) ? res.data : [];
}

export async function cancelReservation(userId: string, id: string): Promise<Message> {
  return (await api.post<Message>(`/users/${userId}/reservations/cancel`, { id })).data;
}

// --- Orders ------------------------------------------------------------------

export async function fetchOrders(userId: string): Promise<Order[]> {
  const res = await api.get<Order[] | { orders: Order[] } | null>(`/users/${userId}/orders`);
  const data = res.data;
  if (Array.isArray(data)) return data;
  return data?.orders ?? [];
}

export async function createOrder(data: CreateOrder): Promise<Message> {
  return (await api.post<Message>("/users/orders", data)).data;
}

/** Tells the restaurant the diner is ready to pay, and how. */
export async function requestBill(orderId: string, paymentMethod: PaymentMethod): Promise<Message> {
  return (
    await api.put<Message>(`/users/orders/${orderId}/complete`, { status: "ready_to_pay", paymentMethod })
  ).data;
}

export async function cancelOrder(orderId: string): Promise<Message> {
  return (await api.put<Message>(`/users/orders/${orderId}/cancel`)).data;
}

// --- Shared tab ----------------------------------------------------------------

const tabPath = (userId: string, reservationId: string) => `/users/${userId}/reservations/${encodeURIComponent(reservationId)}/tab`;

/** Whether a booking's menu is shared, its link, and who joined. */
export async function fetchTab(userId: string, reservationId: string): Promise<TabInfo> {
  return (await api.get<TabInfo>(tabPath(userId, reservationId))).data;
}

/** Creates the booking's share link, or returns the one already shared. */
export async function shareTab(userId: string, reservationId: string): Promise<TabInfo> {
  return (await api.post<TabInfo>(tabPath(userId, reservationId))).data;
}

/** Stops sharing. The old link stops working; dishes already ordered stay on the bill. */
export async function stopTab(userId: string, reservationId: string): Promise<TabInfo> {
  return (await api.delete<TabInfo>(tabPath(userId, reservationId))).data;
}
