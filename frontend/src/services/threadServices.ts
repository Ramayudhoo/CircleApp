import api from "@/lib/axios";

export const fetchThreads = async (limit: number = 25) => {
  const res = await api.get(`/threads?limit=${limit}`);
  return res.data.data.threads;
};

export const createThread = async (formData: FormData) => {
  const res = await api.post("/threads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data.thread;
};

export const getThreadDetail = async (threadId: number) => {
  const res = await api.get(`/threads/${threadId}`);
  return res.data.data;
};

export const toggleLikeThread = async (threadId: number) => {
  const res = await api.post(`/threads/${threadId}/like`);
  return res.data;
};
