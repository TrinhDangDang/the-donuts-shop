// authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export interface AuthState {
  token: string | null;
  _persist?: { version: number; rehydrated: boolean }; // Add this for TypeScript
}

const initialState: AuthState = {
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.token = action.payload.accessToken;
    },
    logOut: (state) => {
      state.token = null;
      // Optional: Clear persisted state on logout
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("persist:auth");
      }
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentToken = (state: RootState) => state.auth.token;
