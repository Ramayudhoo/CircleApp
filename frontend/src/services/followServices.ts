import api from "@/lib/axios";
import { FollowerUser } from "@/types/follow";

export const fetchFollowList = async (
  type: "followers" | "following",
): Promise<FollowerUser[]> => {
  const response = await api.get(`/follows?type=${type}`);
  return response.data.data.followers;
};

export const followUser = async (followed_user_id: string) => {
  const response = await api.post("/follows", { followed_user_id });
  return response.data;
};

export const unfollowUser = async (followed_id: string) => {
  const response = await api.delete("/follows", { data: { followed_id } });
  return response.data;
};
