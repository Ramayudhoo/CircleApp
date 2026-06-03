import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthUser {
  user_id: number;
  username: string;
  name: string;
  email: string;
  photo_profile?: string;
  token: string;
}

interface AuthState {
  user: AuthUser | null;
}

const initialState: AuthState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.setItem("token", action.payload.token);
    },
    clearUser(state) {
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
