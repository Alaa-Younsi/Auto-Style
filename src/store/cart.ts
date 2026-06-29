import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  slug: string;
  name_fr: string;
  name_ar: string;
  price: number;
  image: string;
  color: string | null;
  size: string | null;
  qty: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (productId: string, color: string | null, size: string | null) => void;
  updateQty: (productId: string, color: string | null, size: string | null, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
}

function itemKey(productId: string, color: string | null, size: string | null): string {
  return `${productId}|${color ?? ""}|${size ?? ""}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (incoming, qty = 1) => {
        const key = itemKey(incoming.productId, incoming.color, incoming.size);
        set((state) => {
          const existing = state.items.find(
            (i) => itemKey(i.productId, i.color, i.size) === key
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i.productId, i.color, i.size) === key
                  ? { ...i, qty: i.qty + qty }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...incoming, qty }] };
        });
      },

      removeItem: (productId, color, size) => {
        const key = itemKey(productId, color, size);
        set((state) => ({
          items: state.items.filter(
            (i) => itemKey(i.productId, i.color, i.size) !== key
          ),
        }));
      },

      updateQty: (productId, color, size, qty) => {
        const key = itemKey(productId, color, size);
        if (qty <= 0) {
          get().removeItem(productId, color, size);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            itemKey(i.productId, i.color, i.size) === key ? { ...i, qty } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      itemCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    {
      name: "auto-style-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
