import { create } from "zustand";
import { persist } from "zustand/middleware";

import { deviceStorage } from "@/lib/storage";
import type { MenuItem } from "@/types";

export interface CartItem {
  _id: string;
  name: string;
  cost: number;
  image?: string;
  quantity: number;
  note?: string;
}

/** Which table the cart is for. A cart never mixes two bookings. */
export interface CartContext {
  restaurantId: string;
  restaurantName: string;
  reservationId: string;
  tableNumber: string;
}

interface CartState {
  context: CartContext | null;
  items: CartItem[];
  /** Points the cart at a booking, emptying it if it was for another one. */
  open: (context: CartContext) => void;
  add: (item: MenuItem) => void;
  decrease: (itemId: string) => void;
  remove: (itemId: string) => void;
  setNote: (itemId: string, note: string) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      context: null,
      items: [],
      open: (context) => {
        const current = get().context;
        const same = current?.reservationId === context.reservationId && current.restaurantId === context.restaurantId;
        set(same ? { context } : { context, items: [] });
      },
      add: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i._id === item._id);
          if (existing) {
            return { items: state.items.map((i) => (i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i)) };
          }
          return {
            items: [...state.items, { _id: item._id, name: item.name, cost: item.cost, image: item.image, quantity: 1 }],
          };
        }),
      decrease: (itemId) =>
        set((state) => ({
          items: state.items
            .map((i) => (i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i))
            .filter((i) => i.quantity > 0),
        })),
      remove: (itemId) => set((state) => ({ items: state.items.filter((i) => i._id !== itemId) })),
      setNote: (itemId, note) =>
        set((state) => ({ items: state.items.map((i) => (i._id === itemId ? { ...i, note } : i)) })),
      clear: () => set({ items: [] }),
    }),
    { name: "swiftab-cart", storage: deviceStorage },
  ),
);

export const cartCount = (items: CartItem[]) => items.reduce((sum, i) => sum + i.quantity, 0);
export const cartTotal = (items: CartItem[]) => items.reduce((sum, i) => sum + i.cost * i.quantity, 0);
