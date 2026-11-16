import { create } from "zustand";
import { persist } from "zustand/middleware";

import { deviceStorage } from "@/lib/storage";

export interface InboxItem {
  id: string;
  title: string;
  body: string;
  /** "order" | "reservation" | "reminder" | "promo". */
  kind: string;
  /** Where tapping the item goes. */
  orderId?: string;
  reservationId?: string;
  at: number;
  read: boolean;
}

interface InboxState {
  items: InboxItem[];
  add: (item: Omit<InboxItem, "at" | "read" | "id"> & { id?: string }) => void;
  markAllRead: () => void;
  clear: () => void;
}

const KEEP = 60;

/** Notifications the app has shown, so they can be read again later. */
export const useInbox = create<InboxState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        const id = item.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        if (get().items.some((i) => i.id === id)) return;
        set({ items: [{ ...item, id, at: Date.now(), read: false }, ...get().items].slice(0, KEEP) });
      },
      markAllRead: () => set({ items: get().items.map((i) => ({ ...i, read: true })) }),
      clear: () => set({ items: [] }),
    }),
    { name: "swiftab-inbox", storage: deviceStorage },
  ),
);

export const useUnreadCount = () => useInbox((s) => s.items.reduce((n, i) => n + (i.read ? 0 : 1), 0));
