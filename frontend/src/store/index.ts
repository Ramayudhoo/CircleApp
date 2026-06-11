import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import likeReducer from "./likeSlice";
import profileReducer from "./profileSlice";
import followReducer from "./followSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    likes: likeReducer,
    profile: profileReducer,
    follow: followReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
