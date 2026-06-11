import { useState, useEffect } from "react";
import { fetchThreads } from "@/services/threadServices";
import socket from "@/lib/socket";
import { toast } from "sonner";

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

export const useThreads = (currentUsername?: string) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch awal
  useEffect(() => {
    const load = async () => {
      try {
        const raw = await fetchThreads(25);
        const mapped: Thread[] = raw.map((t: any) => ({
          id: t.id,
          userId: t.user.id,
          username: t.user.username,
          name: t.user.name,
          avatar: t.user.profile_picture,
          image: t.image,
          content: t.content,
          createdAt: new Date(t.created_at).toLocaleDateString("id-ID"),
          likes: t.likes,
          replies: t.reply,
          isLiked: t.isLiked,
        }));
        setThreads(mapped);
      } catch (err) {
        setError("Gagal memuat thread");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Listen socket new_thread
  useEffect(() => {
    const handler = (thread: any) => {
      const mapped: Thread = {
        id: thread.id,
        userId: thread.user.id,
        username: thread.user.username,
        name: thread.user.name,
        avatar: thread.user.profile_picture,
        content: thread.content,
        image: thread.image,
        createdAt: new Date(thread.created_at).toLocaleDateString("id-ID"),
        likes: thread.likes,
        replies: thread.reply,
        isLiked: thread.isLiked,
      };
      setThreads((prev) => [mapped, ...prev]);
      if (thread.user.username !== currentUsername) {
        toast(`@${thread.user.username} posted a new thread`, {
          description:
            thread.content.length > 50
              ? thread.content.substring(0, 50) + "..."
              : thread.content,
          duration: 4000,
        });
      }
    };

    socket.on("new_thread", handler);
    return () => {
      socket.off("new_thread", handler);
    };
  }, [currentUsername]);

  return { threads, loading, error, setThreads };
};
