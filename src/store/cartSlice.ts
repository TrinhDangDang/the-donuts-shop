import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/types";

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.menuItemId === action.payload.menuItemId
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const item = state.items.find(
        (item) => item.menuItemId === action.payload
      );
      if (item) {
        if (item.quantity > 1) {
          item.quantity--; // Decrease quantity
        } else {
          state.items = state.items.filter(
            (item) => item.menuItemId !== action.payload
          ); // Remove if qty=1
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
      if (typeof window !== "undefined") {
        localStorage.removeItem("persist:cart"); // Clear redux-persist's cart data
        localStorage.removeItem("cart"); // Clear any manual cart backups (if they exist)
      }
    },
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;

// Selector
export const selectCurrentCart = (state: { cart: CartState }) =>
  state.cart.items;

export default cartSlice.reducer;
