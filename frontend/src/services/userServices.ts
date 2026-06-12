import api from "@/lib/axios";
import type { SuggestedUser } from "@/types/suggest";
import type { SearchUser } from "@/types/user";

// Get profile user yang sedang login
export const getProfile = async () => {
  const res = await api.get("/user/profile");
  return res.data.data;
};

// Get threads by user ID
export const getUserThreads = async (userId: number) => {
  const res = await api.get(`/user/${userId}/threads`);
  return res.data.data.threads;
};

// Update profile (pakai FormData untuk upload avatar)
export const updateProfile = async (formData: FormData) => {
  const res = await api.patch("/user/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

// Get profile user lain
export const getUserProfile = async (userId: number) => {
  const res = await api.get(`/user/${userId}`);
  return res.data.data;
};

export const searchUsers = async (query: string): Promise<SearchUser[]> => {
  const res = await api.get(`/user/search?q=${encodeURIComponent(query)}`);
  return res.data.data.users;
};

export const getSuggestedUsers = async (
  limit: number = 5,
): Promise<SuggestedUser[]> => {
  const res = await api.get(`/user/suggestions?limit=${limit}`);
  return res.data.data.users;
};
