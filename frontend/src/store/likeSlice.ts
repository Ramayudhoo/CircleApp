import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LikeState {
  likes: Record<number, { isLiked: boolean; likeCount: number }>;
}

const initialState: LikeState = {
  likes: {},
};

const likeSlice = createSlice({
  name: "Likes",
  initialState,
  reducers: {
    initLike: (
      state,
      action: PayloadAction<{
        threadId: number;
        isLiked: boolean;
        likeCount: number;
      }>,
    ) => {
      const { threadId, isLiked, likeCount } = action.payload;
      if (!state.likes[threadId]) {
        state.likes[threadId] = { isLiked, likeCount };
      }
    },

    toggleLike: (state, action: PayloadAction<number>) => {
      const threadId = action.payload;
      const current = state.likes[threadId];
      if (current) {
        if (current.isLiked) {
          // unlike
          current.isLiked = false;
          current.likeCount -= 1;
        } else {
          // like
          current.isLiked = true;
          current.likeCount += 1;
        }
      }
    },
  },
});

export const { initLike, toggleLike } = likeSlice.actions;
export default likeSlice.reducer;
