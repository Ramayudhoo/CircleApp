import { useState, useEffect, useCallback } from "react";
import { getThreadDetail, toggleLikeThread } from "@/services/threadServices";
import { getThreadReplies, toggleLikeReply } from "@/services/replyServices";

interface ThreadData {
  id: number;
  content: string;
  image?: string;
  created_at: string;
  user: {
    id: number;
    username: string;
    name: string;
    profile_picture?: string;
  };
  likes: number;
  replies: number;
  isLiked: boolean;
}

interface ReplyData {
  id: number;
  content: string;
  created_at: string;
  image: string;
  user: {
    id: number;
    username: string;
    name: string;
    profile_picture?: string;
  };
  likes: number;
  isLiked: boolean;
}

export const useThreadDetail = (threadId: number) => {
  const [thread, setThread] = useState<ThreadData | null>(null);
  const [replies, setReplies] = useState<ReplyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Fetch thread + replies
  const fetchData = useCallback(async () => {
    if (!threadId) return;
    setLoading(true);
    setError(null);
    try {
      const [threadData, repliesData] = await Promise.all([
        getThreadDetail(threadId),
        getThreadReplies(threadId),
      ]);
      setThread(threadData);
      setIsLiked(threadData.isLiked);
      setLikeCount(threadData.likes);
      setReplies(repliesData);
    } catch (err) {
      setError("Gagal memuat thread");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [threadId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Like thread
  const handleLikeThread = async () => {
    if (!threadId) return;
    try {
      await toggleLikeThread(threadId);
      if (isLiked) {
        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error toggle like thread:", err);
    }
  };

  // Like reply
  const handleLikeReply = async (replyId: number) => {
    try {
      await toggleLikeReply(replyId);
      setReplies((prev) =>
        prev.map((reply) => {
          if (reply.id !== replyId) return reply;
          return {
            ...reply,
            isLiked: !reply.isLiked,
            likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
          };
        }),
      );
    } catch (err) {
      console.error("Error toggle like reply:", err);
    }
  };

  // Add new reply to list (setelah berhasil post)
  const addReply = (newReply: ReplyData) => {
    setReplies((prev) => [...prev, newReply]);
  };

  return {
    thread,
    replies,
    loading,
    error,
    isLiked,
    likeCount,
    handleLikeThread,
    handleLikeReply,
    addReply,
    refetch: fetchData,
  };
};
