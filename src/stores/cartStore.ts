import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/data/products";

export interface CartItem {
  priceId: string;
  name: string;
  priceCents: number;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (priceId: string, quantity: number) => void;
  removeItem: (priceId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.priceId === product.priceId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.priceId === product.priceId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                priceId: product.priceId,
                name: product.name,
                priceCents: product.priceCents,
                image: product.images[0],
                quantity,
              },
            ],
          };
        });
      },

      updateQuantity: (priceId, quantity) => {
        if (quantity <= 0) {
          set((state) => ({ items: state.items.filter((i) => i.priceId !== priceId) }));
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.priceId === priceId ? { ...i, quantity } : i
          ),
        }));
      },

      removeItem: (priceId) => {
        set((state) => ({ items: state.items.filter((i) => i.priceId !== priceId) }));
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "diva-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
