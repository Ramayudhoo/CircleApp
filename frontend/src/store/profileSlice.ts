import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProfileState {
  id: number | null;
  username: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  follower_count: number;
  following_count: number;
}

const initialState: ProfileState = {
  id: null,
  username: "",
  name: "",
  email: "",
  bio: "",
  avatar: "",
  follower_count: 0,
  following_count: 0,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<ProfileState>) => {
      return { ...state, ...action.payload };
    },
    clearProfile: () => initialState,
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
