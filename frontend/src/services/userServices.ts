import api from "@/lib/axios";

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
