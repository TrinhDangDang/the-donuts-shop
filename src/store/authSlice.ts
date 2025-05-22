// authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

// Define JWT payload structure (adjust to match your backend)
interface JwtPayload {
  userRole?: string; // Optional to handle missing roles
  exp?: number;
  // Add other expected claims
}

export interface AuthState {
  token: string | null;
  role: string | null;
  _persist?: { version: number; rehydrated: boolean };
}

const initialState: AuthState = {
  token: null,
  role: null,
};

// Safe JWT decoder (frontend-only, no verification)
const decodeJwt = (token: string): JwtPayload | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch (error) {
    console.error("JWT decoding failed:", error);
    return null;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ accessToken: string }>) => {
      const { accessToken } = action.payload;
      state.token = accessToken;
      console.log("Access token:", accessToken);
      const decoded = decodeJwt(accessToken);
      console.log("Decoded JWT:", decoded);
      state.role = decoded?.userRole || null; // Fallback to null if role missing
    },
    logOut: (state) => {
      state.token = null;
      state.role = null;
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("persist:auth");
      }
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

// Selectors
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentRole = (state: RootState) => state.auth.role; // Add role selector

export default authSlice.reducer;
