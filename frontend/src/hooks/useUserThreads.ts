import { useState, useEffect } from "react";
import { getUserThreads } from "@/services/userServices";

interface Thread {
  id: number;
  userId: number;
  username: string;
  name: string;
  avatar?: string;
  image?: string;
  content: string;
  createdAt: string;
  likes: number;
  replies: number;
  isLiked: boolean;
}

export const useUserThreads = (userId: number | null | undefined) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetch = async () => {
      setLoading(true);
      try {
        const raw = await getUserThreads(userId);
        const mapped: Thread[] = raw.map((t: any) => ({
          id: t.id,
          userId: t.user.id,
          username: t.user.username,
          name: t.user.name,
          avatar: t.user.profile_picture,
          content: t.content,
          image: t.image,
          createdAt: new Date(t.created_at).toLocaleDateString("id-ID"),
          likes: t.likes,
          replies: t.reply,
          isLiked: t.isLiked,
        }));
        setThreads(mapped);
      } catch (err) {
        console.error("Failed to fetch user threads:", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [userId]);

  return { threads, loading };
};
