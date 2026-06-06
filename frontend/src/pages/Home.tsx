import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import PostCard from "../components/cards/PostCard";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/SideBar";
import api from "../lib/axios";

interface Thread {
  id: number;
  username: string;
  name: string;
  avatar?: string;
  content: string;
  createdAt: string;
  likes: number;
  replies: number;
  isLiked: boolean;
}

export default function Home() {
  const user = useSelector((state: RootState) => state.auth.user);

  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newThread, setNewThread] = useState("");

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await api.get("/threads?limit=25");
        const raw = res.data.data.threads;
        const mapped: Thread[] = raw.map((t: any) => ({
          id: t.id,
          username: t.user.username,
          name: t.user.name,
          avatar: t.user.profile_picture,
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
    fetchThreads();
  }, []);

  const handlePostThread = async () => {
    if (newThread.trim() === "") return;
    try {
      const res = await api.post("/threads", { content: newThread });
      const t = res.data.data.thread;
      setThreads((prev) => [
        {
          id: t.id,
          username: t.user.username,
          name: t.user.name,
          avatar: t.user.profile_picture,
          content: t.content,
          createdAt: new Date(t.created_at).toLocaleDateString("id-ID"),
          likes: 0,
          replies: 0,
          isLiked: false,
        },
        ...prev,
      ]);
      setNewThread("");
    } catch (error) {
      console.error("Error posting thread:", error);
    }
  };

  return (
    <SidebarProvider>
      {/* ✅ AppSidebar di luar div utama */}
      <AppSidebar onNewThread={() => {}} />

      {/* ✅ SidebarInset otomatis atur margin */}
      <main className="flex-1 max-w-2xl border-r border-zinc-800/50 bg-[#0a0a0a] text-white">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur border-b border-zinc-800/50 px-4 py-4 flex items-center gap-3">
          <SidebarTrigger className="text-zinc-500 hover:text-white" />
          <h2 className="text-base font-semibold">For You</h2>
        </div>

        {/* Compose */}
        <div className="px-4 py-4 border-b border-zinc-800/50">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-sm font-bold shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <textarea
                placeholder="What's new?"
                className="w-full bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 resize-none outline-none min-h-[60px]"
                value={newThread}
                onChange={(e) => setNewThread(e.target.value)}
                rows={2}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handlePostThread}
                  disabled={newThread.trim() === ""}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold bg-white text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-200 transition-colors"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Thread list */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 rounded-full border-2 border-zinc-700 border-t-green-500 animate-spin" />
          </div>
        ) : error ? (
          <p className="text-red-500 text-sm text-center py-8">{error}</p>
        ) : threads.length === 0 ? (
          <p className="text-zinc-600 text-sm text-center py-12">
            Belum ada thread
          </p>
        ) : (
          threads.map((thread) => <PostCard key={thread.id} {...thread} />)
        )}
      </main>
    </SidebarProvider>
  );
}
