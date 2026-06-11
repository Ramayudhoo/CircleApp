import api from "@/lib/axios";

export const createReply = async (threadId: number, formData: FormData) => {
  const res = await api.post(`/reply?thread_id=${threadId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data.reply;
};

export const toggleLikeReply = async (replyId: number) => {
  const res = await api.post(`/reply/${replyId}/like`);
  return res.data;
};

export const getThreadReplies = async (
  threadId: number,
  limit: number = 25,
) => {
  const res = await api.get(`/threads/${threadId}/replies?limit=${limit}`);
  return res.data.data.replies;
};
