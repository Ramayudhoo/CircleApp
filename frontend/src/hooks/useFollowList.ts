import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchFollowList,
  followUserAction,
  unfollowUserAction,
  setActiveTab,
} from "@/store/followSlice";
export const useFollowList = (
  initialTab: "followers" | "following" = "followers",
  userId?: string, // ← tambah parameter userId
) => {
  const dispatch = useAppDispatch();
  const { users, activeTab, loading, error } = useAppSelector(
    (state) => state.follow,
  );

  const changeTab = (tab: "followers" | "following") => {
    dispatch(setActiveTab(tab));
    dispatch(fetchFollowList({ type: tab, userId })); // ← kirim userId
  };

  useEffect(() => {
    dispatch(fetchFollowList({ type: initialTab, userId })); // ← kirim userId
  }, [dispatch, initialTab, userId]);

  const follow = (userId: string) => dispatch(followUserAction(userId));
  const unfollow = (userId: string) => dispatch(unfollowUserAction(userId));

  return { users, loading, error, activeTab, changeTab, follow, unfollow };
};
