import { create } from "zustand";

interface CartState {
  cart: any[];
  updateCart: () => void;
  clearCarat: () => void;
}

export const useCartState = create<CartState>((set) => ({
  cart: [],
  updateCart: () => {},
  clearCarat: () => {},
}));
