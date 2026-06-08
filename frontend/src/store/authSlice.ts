import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthUser {
  user_id: number;
  username: string;
  name: string;
  email: string;
  bio?: string;
  photo_profile?: string;
  token: string;
}

interface AuthState {
  user: AuthUser | null;
}

const initialState: AuthState = {
  user: sessionStorage.getItem("user")
    ? JSON.parse(sessionStorage.getItem("user") as string)
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      sessionStorage.setItem("user", JSON.stringify(action.payload));
      sessionStorage.setItem("token", action.payload.token);
    },
    clearUser(state) {
      state.user = null;
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
