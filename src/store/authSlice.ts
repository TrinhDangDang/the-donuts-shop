import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store"; // adjust path as needed

interface AuthState {
  token: string | null;
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
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;

// ✅ Typed selector
export const selectCurrentToken = (state: RootState) => state.auth.token;
