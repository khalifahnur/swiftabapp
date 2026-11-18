/**
 * Shapes exchanged with the Swiftab API (see swiftab-server). Fields added
 * after the first release are optional so older data still renders.
 */

export interface AuthData {
  name?: string;
  email: string;
  phoneNumber?: string;
  password: string;
}

export interface AuthUser {
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface AuthResponse {
  token?: string;
  user: AuthUser;
}

// --- Restaurants -------------------------------------------------------------

export interface OpeningHour {
  /** "Monday" … "Sunday". */
  day: string;
  open: boolean;
  /** 24-hour "HH:MM". Empty when closed. */
  from: string;
  to: string;
}

export interface About {
  description: string;
  averagePrice: number;
  hrsOfOperation: string;
  phone: string;
  email: string;
}

export interface MenuItem {
  _id: string;
  image?: string;
  name: string;
  description?: string;
  cost: number;
  rate?: number;
  quantity?: number;
  /** Missing on older dishes, which are available. */
  available?: boolean;
  tags?: string[];
  /** Minutes. */
  prepTime?: number;
  note?: string;
}

export interface MenuCategory {
  key: string;
  label: string;
}

export interface MenuSection extends MenuCategory {
  items: MenuItem[];
}

export interface Review {
  userId?: string;
  name: string;
  image?: string;
  reviewTxt: string;
  rating: number;
  createdAt?: string;
}

/** A restaurant as the API stores it: a document wrapping one profile. */
export interface RestaurantData {
  image: string;
  logo?: string;
  restaurantName: string;
  location: string;
  latitude: number;
  longitude: number;
  rate: number;
  cuisines?: string[];
  amenities?: string[];
  paymentMethods?: string[];
  openingHours?: OpeningHour[];
  acceptingReservations?: boolean;
  about: About[];
  menu: Record<string, MenuItem[]>;
  menuCategories?: MenuCategory[];
  review: Review[];
}

export interface RestaurantDoc {
  _id: string;
  title?: string;
  data: RestaurantData[];
  distanceKm?: number;
}

/** A restaurant flattened for the screens: one object, id included. */
export interface Restaurant extends RestaurantData {
  id: string;
  distanceKm?: number;
}

export interface Promotion {
  _id: string;
  restaurantId: string;
  title: string;
  description: string;
  type: string;
  discountPercentage?: number;
  paymentMethod?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  termsAndConditions?: string;
  image?: string;
}

// --- Floor plan --------------------------------------------------------------

export interface Floor {
  id: string;
  name: string;
}

export interface Chair {
  id: string;
  position: string;
}

export type TableShape = "round" | "square" | "rectangle" | string;

export interface FloorTable {
  id: string;
  name: string;
  floorId: string;
  shape: TableShape;
  position: { x: number; y: number };
  rotation?: number;
  size: { width: number; height: number };
  chairs: Chair[];
}

export interface Layout {
  floors: Floor[];
  tables: FloorTable[];
}

export interface TableAvailability {
  tableNumber: string;
  isAvailable: boolean;
  seats: number;
  floorId: string;
}

// --- Reservations ------------------------------------------------------------

export type ReservationStatus = "active" | "seated" | "completed" | "cancelled" | "no_show";

export interface ReservationRequest {
  name: string;
  email: string;
  phoneNumber: string;
  /** ISO timestamps. */
  bookingFor: string;
  endTime: string;
  guests: number;
  tableNumber: string;
  diningArea: string;
  restaurantName: string;
  notes?: string;
}

export interface ReservationCreated {
  id: string;
  reservationId: string;
  date: string;
  time: string;
  bookingFor: string;
  endTime: string;
  duration?: string;
  guests: number;
  tableNumber: string;
  floor?: string;
  restaurantId: string;
}

export interface Reservation {
  id: string;
  reservationId: string;
  status: ReservationStatus;
  date: string;
  timeLabel?: string;
  /** ISO timestamps. */
  bookingFor: string;
  endTime: string;
  guests: number;
  table: string;
  diningArea?: string;
  restaurantName: string;
  image: string;
  location: string;
  latitude?: number;
  longitude?: number;
  rate?: number;
  restaurantId: string;
  hasOrder?: boolean;
  /** The menu is shared: friends can add dishes to this booking's bill. */
  sharing?: boolean;
  /** Friends who joined the shared tab. */
  tabGuests?: number;
}

/** A friend who joined a shared tab, with what they have ordered so far. */
export interface TabGuest {
  id: string;
  name: string;
  joinedAt: string;
  items: number;
  total: number;
}

/** A booking's share link and who joined through it. */
export interface TabInfo {
  open: boolean;
  canShare: boolean;
  url?: string;
  code?: string;
  openedAt?: string;
  guests: TabGuest[];
  maxGuests: number;
}

// --- Orders ------------------------------------------------------------------

export type OrderStatus = "placed" | "served" | "ready_to_pay" | "completed" | "cancelled";

export type PaymentMethod = "mpesa" | "cash" | "card" | "airtel_money";

export interface OrderLine {
  _id: string;
  name: string;
  cost: number;
  quantity: number;
  image?: string;
  note?: string;
  /** The friend who ordered this line on your shared tab. */
  addedBy?: string;
}

export interface Order {
  _id: string;
  orderId?: string;
  reservationId?: string;
  tableNumber: string;
  menu: OrderLine[];
  status: OrderStatus;
  paid?: string;
  paymentStatus?: string;
  paymentMethod?: PaymentMethod | "";
  totalAmount: number;
  createdAt: string;
  updatedAt?: string;
  servedAt?: string;
  paidAt?: string;
  takenBy?: string;
  restaurantName: string;
  restaurantImage?: string;
  restaurantLocation?: string;
  restaurantId: string;
}

export interface CreateOrder {
  menu: { _id: string; quantity: number; note?: string }[];
  userId: string;
  restaurantId: string;
  reservationId: string;
  tableNumber: string;
  restaurantName: string;
}
