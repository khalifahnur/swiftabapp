import { create } from "zustand";

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  cost: number;
  image: string;
  rate: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: MenuItem) => void;
  decreaseQuantity: (itemId: string) => void;
  removeFromCart: (itemId: string) => void;
  getTotalPrice: () => number;
  getItemQuantity: (itemId: string) => number;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addToCart: (product) => {
    set((state) => {
      const existingItem = state.items.find((item) => item._id === product._id);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      } else {
        return { items: [...state.items, { ...product, quantity: 1 }] };
      }
    });
  },

  // Use this for a "-" button
  decreaseQuantity: (itemId) => {
    set((state) => {
      const existingItem = state.items.find((item) => item._id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return {
          items: state.items.map((item) =>
            item._id === itemId
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          ),
        };
      } else {
        return {
          items: state.items.filter((item) => item._id !== itemId),
        };
      }
    });
  },

  removeFromCart: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item._id !== itemId),
    }));
  },

  getTotalPrice: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.cost * item.quantity, 0);
  },

  getItemQuantity: (itemId) => {
    const { items } = get();
    const item = items.find((i) => i._id === itemId);
    return item ? item.quantity : 0;
  },

  clearCart: () => set({ items: [] }),
}));
