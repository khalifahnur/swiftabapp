import {
  Activity, AlarmClock, ArrowRight, Banknote, Bell, CalendarDays, Check, CheckCheck, ChevronDown, ChevronLeft, ChevronRight,
  ChevronUp, Circle, CircleAlert, CircleCheck, CircleDot, CircleHelp, CirclePlus, CircleUser, CircleX, Clock, CloudOff, CloudSun,
  CreditCard, ExternalLink, Eye, EyeOff, FileText, Globe, Hand, Heart, Hourglass, House, Info, KeyRound, Layers, LayoutGrid,
  LifeBuoy, Lock, LogOut, type LucideIcon, Mail, Map, MapPin, Megaphone, MessagesSquare, Minus, Moon, Navigation, Phone, Plus,
  ReceiptText, Search, Share2, ShieldCheck, ShoppingCart, SlidersHorizontal, Smartphone, SquarePen, Star, StarHalf, Sun, Tag,
  Trash2, TriangleAlert, User, Users, Utensils, UtensilsCrossed, Wallet, X,
} from "lucide-react-native";
import React from "react";
import type { StyleProp, ViewStyle } from "react-native";

/**
 * Every icon in the app, drawn as SVG (Lucide). Screens ask for an icon by
 * what it means; names ending in "-outline" and their plain twins share a
 * drawing, and the plain ones in SOLID are filled.
 */
const ICONS = {
  add: Plus,
  "add-circle-outline": CirclePlus,
  "alarm-outline": AlarmClock,
  "alert-circle": CircleAlert,
  "arrow-forward": ArrowRight,
  calendar: CalendarDays,
  "calendar-outline": CalendarDays,
  call: Phone,
  "call-outline": Phone,
  "card-outline": CreditCard,
  "cart-outline": ShoppingCart,
  "cash-outline": Banknote,
  "chatbubbles-outline": MessagesSquare,
  checkmark: Check,
  "checkmark-circle": CircleCheck,
  "checkmark-circle-outline": CircleCheck,
  "checkmark-done-outline": CheckCheck,
  "chevron-back": ChevronLeft,
  "chevron-down": ChevronDown,
  "chevron-forward": ChevronRight,
  "chevron-up": ChevronUp,
  close: X,
  "close-circle": CircleX,
  "close-circle-outline": CircleX,
  "cloud-offline": CloudOff,
  "cloud-offline-outline": CloudOff,
  "create-outline": SquarePen,
  "document-text-outline": FileText,
  "ellipse-outline": Circle,
  "eye-off-outline": EyeOff,
  "eye-outline": Eye,
  "fast-food-outline": UtensilsCrossed,
  "globe-outline": Globe,
  "grid-outline": LayoutGrid,
  "hand-left-outline": Hand,
  heart: Heart,
  "heart-outline": Heart,
  "help-buoy-outline": LifeBuoy,
  "help-circle-outline": CircleHelp,
  home: House,
  "home-outline": House,
  "hourglass-outline": Hourglass,
  "information-circle-outline": Info,
  "key-outline": KeyRound,
  "layers-outline": Layers,
  location: MapPin,
  "location-outline": MapPin,
  "lock-closed-outline": Lock,
  "log-out-outline": LogOut,
  mail: Mail,
  "mail-outline": Mail,
  "map-outline": Map,
  "megaphone-outline": Megaphone,
  "moon-outline": Moon,
  "navigate-outline": Navigation,
  notifications: Bell,
  "notifications-outline": Bell,
  "open-outline": ExternalLink,
  "options-outline": SlidersHorizontal,
  "partly-sunny-outline": CloudSun,
  "people-outline": Users,
  person: User,
  "person-circle-outline": CircleUser,
  "person-outline": User,
  "phone-portrait-outline": Smartphone,
  pricetag: Tag,
  "pulse-outline": Activity,
  "radio-button-off": Circle,
  "radio-button-on": CircleDot,
  "receipt-outline": ReceiptText,
  remove: Minus,
  restaurant: Utensils,
  "restaurant-outline": Utensils,
  search: Search,
  "search-outline": Search,
  "share-social-outline": Share2,
  "shield-checkmark-outline": ShieldCheck,
  star: Star,
  "star-half": StarHalf,
  "star-outline": Star,
  "sunny-outline": Sun,
  "time-outline": Clock,
  "trash-outline": Trash2,
  "wallet-outline": Wallet,
  "warning-outline": TriangleAlert,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

/** Shapes that read well filled in. */
const SOLID = new Set<IconName>(["heart", "star", "star-half", "notifications", "person"]);

export function Icon({
  name,
  size = 20,
  color = "#0F1F1D",
  style,
  strokeWidth = 1.9,
}: {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  strokeWidth?: number;
}) {
  const Glyph: LucideIcon = ICONS[name] ?? Circle;
  return <Glyph size={size} color={color} strokeWidth={strokeWidth} fill={SOLID.has(name) ? color : "none"} style={style} />;
}
