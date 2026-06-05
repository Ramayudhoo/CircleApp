import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import PostCard from "../components/cards/PostCard";
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
  const { logout } = useAuth();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await api.get("/threads?limit=25");
        const raw = res.data.data.threads;
        console.log(raw[0]);

        // mapping response BE ke format yang dipakai PostCard
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
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const [newThread, setNewThread] = useState("");

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
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-10 border-b border-zinc-800 bg-black/80 backdrop-blur px-6 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-green-500">Circle</h1>
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        >
          Logout
        </Button>
      </nav>

      <div className="max-w-5xl mx-auto grid grid-cols-12 gap-6 px-4 py-6">
        {/* Sidebar Kiri */}
        <aside className="col-span-3 space-y-4">
          <div className="border border-zinc-800 rounded-xl p-4 space-y-3">
            <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center text-white text-xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-zinc-500">@{user?.username}</p>
            </div>
            <div className="flex gap-4 text-sm text-zinc-400">
              <span>
                <strong className="text-white">120</strong> Following
              </span>
              <span>
                <strong className="text-white">340</strong> Followers
              </span>
            </div>
          </div>
        </aside>

        {/* Feed Tengah */}
        <main className="col-span-6 space-y-4">
          {/* Create Post */}
          <div className="border border-zinc-800 rounded-xl p-4 space-y-3">
            <textarea
              placeholder="What's on your mind?"
              className="w-full bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 resize-none outline-none"
              rows={3}
              value={newThread}
              onChange={(e) => setNewThread(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={handlePostThread}
                disabled={newThread.trim() === ""}
              >
                Post
              </Button>
            </div>
          </div>

          {/* loading / error / data */}
          {loading ? (
            <p className="text-zinc-500 text-sm text-center">
              Memuat thread...
            </p>
          ) : error ? (
            <p className="text-red-500 text-sm text-center">{error}</p>
          ) : threads.length === 0 ? (
            <p className="text-zinc-500 text-sm text-center">
              Belum ada thread
            </p>
          ) : (
            threads.map((thread) => <PostCard key={thread.id} {...thread} />)
          )}
        </main>

        {/* Sidebar Kanan */}
        <aside className="col-span-3 space-y-4">
          <div className="border border-zinc-800 rounded-xl p-4 space-y-3">
            <p className="font-semibold text-sm">Suggested for you</p>
            {["alice", "bob", "carol"].map((name) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <p className="text-sm">@{name}</p>
                </div>
                <button className="text-xs text-green-500 hover:underline">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
