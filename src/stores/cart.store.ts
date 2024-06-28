import { CartItem } from "@/@types/cart.type";
import { create } from "zustand";

interface CartState {
  cart: CartItem[];
  updateCart: (ordersItem: CartItem[]) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  updateCart: (ordersItem: CartItem[]) => {
    return set(() => ({ cart: ordersItem }));
  },
  clearCart: () => set(() => ({ cart: [] })),
}));
