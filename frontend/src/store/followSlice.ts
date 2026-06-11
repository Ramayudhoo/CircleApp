import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { FollowerUser } from "@/types/follow";
import * as followService from "@/services/followServices";
import api from "@/lib/axios";

interface FollowState {
  users: FollowerUser[];
  activeTab: "followers" | "following";
  loading: boolean;
  error: string | null;
}

const initialState: FollowState = {
  users: [],
  activeTab: "followers",
  loading: false,
  error: null,
};

export const fetchFollowList = createAsyncThunk(
  "follow/fetchList",
  async (
    { type, userId }: { type: "followers" | "following"; userId?: string },
    { rejectWithValue },
  ) => {
    try {
      const url = userId
        ? `/follows?type=${type}&user_id=${userId}`
        : `/follows?type=${type}`;
      const res = await api.get(url);
      return { users: res.data.data.followers, type };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch",
      );
    }
  },
);
export const followUserAction = createAsyncThunk(
  "follow/followUser",
  async (userId: string, { rejectWithValue }) => {
    try {
      await followService.followUser(userId);
      return { userId, is_following: true };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to follow",
      );
    }
  },
);

export const unfollowUserAction = createAsyncThunk(
  "follow/unfollowUser",
  async (userId: string, { rejectWithValue, getState }) => {
    try {
      await followService.unfollowUser(userId);
      const state = getState() as { follow: FollowState };
      return { userId, activeTab: state.follow.activeTab };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to unfollow",
      );
    }
  },
);

const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<"followers" | "following">) {
      state.activeTab = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFollowList.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchFollowList.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload.users;
      state.activeTab = action.payload.type;
    });
    builder.addCase(fetchFollowList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(followUserAction.fulfilled, (state, action) => {
      const { userId, is_following } = action.payload;
      const user = state.users.find((u) => u.id === userId);
      if (user) user.is_following = is_following;
    });

    builder.addCase(unfollowUserAction.fulfilled, (state, action) => {
      const { userId, activeTab } = action.payload;
      if (activeTab === "following") {
        state.users = state.users.filter((u) => u.id !== userId);
      } else {
        const user = state.users.find((u) => u.id === userId);
        if (user) user.is_following = false;
      }
    });
  },
});

export const { setActiveTab, clearError } = followSlice.actions;
export default followSlice.reducer;
