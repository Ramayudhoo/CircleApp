import { useState, useEffect } from "react";
import { fetchThreads, fetchFollowingThreads } from "@/services/threadServices";
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

const mapThread = (t: any): Thread => ({
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
});

export const useThreads = (currentUsername?: string) => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [followingThreads, setFollowingThreads] = useState<Thread[]>([]);
  const [followingLoading, setFollowingLoading] = useState(false);
  const [followingError, setFollowingError] = useState<string | null>(null);

  // Fetch awal — for you
  useEffect(() => {
    const load = async () => {
      try {
        const raw = await fetchThreads(25);
        setThreads(raw.map(mapThread));
      } catch (err) {
        setError("Gagal memuat thread");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Fetch following threads — dipanggil manual saat tab dibuka
  const loadFollowingThreads = async () => {
    setFollowingLoading(true);
    setFollowingError(null);
    try {
      const raw = await fetchFollowingThreads(25);
      setFollowingThreads(raw.map(mapThread));
    } catch (err) {
      setFollowingError("Gagal memuat thread following");
    } finally {
      setFollowingLoading(false);
    }
  };

  // Listen socket new_thread
  useEffect(() => {
    const handler = (thread: any) => {
      const mapped = mapThread(thread);
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

  return {
    threads,
    loading,
    error,
    setThreads,
    followingThreads,
    followingLoading,
    followingError,
    loadFollowingThreads,
  };
};
