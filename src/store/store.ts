// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import cartReducer, { CartState } from "./cartSlice";
import authReducer, { AuthState } from "./authSlice";
import { apiSlice } from "./apiSlice";

// Define persist configs with proper types
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token"],
};

const cartPersistConfig = {
  key: "cart",
  storage,
  // Add whitelist/blacklist if needed
};

// Create typed persisted reducers
const persistedAuthReducer = persistReducer<AuthState>(
  authPersistConfig,
  authReducer
);
const persistedCartReducer = persistReducer<CartState>(
  cartPersistConfig,
  cartReducer
);

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: persistedCartReducer,
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);

// Type definitions
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
