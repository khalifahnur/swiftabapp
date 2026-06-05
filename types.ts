import { RESULTS } from "react-native-permissions";

export type TUsePermissionsReturnType = {
  isError?: boolean;
  type: (typeof RESULTS)[keyof typeof RESULTS];
  errorMessage?: string;
};

export interface ICameraScannerProps {
  setIsCameraShown: (value: boolean) => void;
  onReadCode: (value: string) => void;
}

export interface AuthData {
  name?: string;
  email: string;
  phoneNumber?: string;
  password: string;
}

export interface AuthResponse {
  token?: string;
  user: {
    userId?: string;
    name?: string;
    email?: string;
    phoneNumber?: string;
  };
}

export interface ErrorResponse {
  message: string;
}

export type Restaurant = {
  _id: string;
  title: string;
  data: RestaurantData[];
  __v: number;
};

export type RestaurantData = {
  image: string;
  restaurantName: string;
  location: string;
  latitude: number;
  longitude: number;
  rate: number;
  about: {
    description: string;
    averagePrice: number;
    hrsOfOperation: string;
    phone: string;
    email: string;
  }[];
  menu: {
    _id: string;
    breakfast: MenuItem[];
    lunch: MenuItem[];
    dinner: MenuItem[];
  };
  _id: string;
  review: any[];
};

export type MenuItem = {
  image: string;
  name: string;
  description: string;
  cost: number;
  rate: number;
  _id: string;
};

export interface RestaurantTable {
  restauranId: string;
  diningAreas: string;
  totalTables: number;
  totalCapacity: number;
  tablePosition: Table[];
}

export interface Chair {
  id: string;
  position: string;
}

export interface Table {
  id: string;
  name: string;
  status: string;
  position: {
    x: number;
    y: number;
  };
  rotation: number;
  shape: string;
  size: {
    width: number;
    height: number;
  };
  chairs: Chair[];
  floorId: string;
}

interface RestaurantInfo {
  restaurantId: string;
  restaurantName: string;
  image?: string;
  location: string;
  longitude: string;
  latitude: string;
  rate: string;
}

interface ReservationInfo {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  bookingDate: string;
  bookingFor: string;
  endTime: string;
  guests: number;
  tableNumber: string | null;
  diningArea: string;
  restaurantName: string;
}

export interface Reservation {
  reservationInfo: ReservationInfo;
  status?: "active" | "cancelled" | "completed";
}

export interface ReservationResponse {
  name: string;
  date: Date;
  time: Date;
  duration: Date;
  guest: number;
  tableNumber: string;
  reservationId: string;
}

export interface ActiveReservation {
  date: string;
  time: number;
  location: string;
  rate: string;
  image: string;
  restaurantName: string;
  reservationId: string;
  restaurantId: string;
  id: string;
}

// param (detailScreen) @types
export interface About {
  description: string;
  averagePrice: number;
  hrsOfOperation: string;
  phone: string;
  email: string;
  _id: string;
}

export interface MenuParam {
  image: string;
  name: string;
  description: string;
  cost: number;
  rate: number;
  _id: string;
}

export interface Menu {
  _id: string;
  breakfast: MenuParam[];
  lunch: MenuParam[];
  dinner: MenuParam[];
}

export interface RestaurantParam {
  image: string;
  restaurantName: string;
  location: string;
  latitude: number;
  longitude: number;
  rate: number;
  about: About[];
  menu: Menu;
  _id: string;
  review: any[];
  restaurantId: string;
}

export interface RootData {
  data: string;
}

export interface ParsedRootData {
  data: RestaurantParam;
}

export interface NearbyRestaurantsResponse {
  _id: string;
  title: string;
  data: RestaurantData[];
  __v: number;
}

export interface paymentVariables {
  phone: string;
  amount: number;
  email: string;
}

export interface userCancelReservationParams {
  id: string;
  userId: string;
  restaurantId: string;
  reservationId: string;
}

export interface orderItem {
  _id: string;
  name: string;
  cost: number;
  quantity: number;
}

export interface CreateOrder {
  menu: orderItem[];
  userId: string;
  restaurantId: string;
  reservationId: string;
  restaurantName: string;
  tableNumber: string;
}

export interface OrderResponse {
  message: string;
}

export interface FetchOrder {
  __v: number;
  _id: string;
  createdAt: string;
  menu: MenuItem[];
  orderId: string;
  paid: "Paid" | "Unpaid";
  reservationId: string;
  restaurantId: string;
  status: "placed" | "served" | "ready_to_pay" | "completed" | "cancelled";
  tableNumber: string;
  takenBy: string;
  userId: string;
  restaurantName: string;
  totalAmount: number;
}

export interface MenuResponse {
  breakfast: MenuItem[];
  lunch: MenuItem[];
  dinner: MenuItem[];
}

export interface CompleteOrder {
  status: string;
  paymentMethod: string;
}
