import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import socket from "@/lib/socket";
import PostCard from "../components/cards/PostCard";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-togle";
import { AppSidebar } from "@/components/layout/SideBar";
import ProfileCard from "@/components/cards/ProfileCard";
import SuggestCard from "@/components/cards/SuggestCard";
import api from "../lib/axios";

interface Thread {
  id: number;
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

export default function Home() {
  const user = useSelector((state: RootState) => state.auth.user);

  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newThread, setNewThread] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageReview, setImageReview] = useState<string | null>(null);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const res = await api.get("/threads?limit=25");
        const raw = res.data.data.threads;
        console.log("raw[0]:", raw[0]);
        const mapped: Thread[] = raw.map((t: any) => ({
          id: t.id,
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
    fetchThreads();
  }, []);
  useEffect(() => {
    socket.on("new_thread", (thread: any) => {
      const mapped: Thread = {
        id: thread.id,
        username: thread.user.username,
        name: thread.user.name,
        avatar: thread.user.profile_picture,
        content: thread.content,
        createdAt: new Date(thread.created_at).toLocaleDateString("id-ID"),
        likes: thread.likes,
        replies: thread.reply,
        isLiked: thread.isLiked,
      };
      setThreads((prev) => [mapped, ...prev]);
    });

    return () => {
      socket.off("new_thread");
    };
  }, []);

  const handlePostThread = async () => {
    if (newThread.trim() === "") return;
    try {
      const formData = new FormData();
      formData.append("content", newThread);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // ✅ cukup satu post pakai formData
      await api.post("/threads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNewThread("");
      setImageFile(null);
      setImageReview(null);
    } catch (error) {
      console.error("Error posting thread:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImageReview(URL.createObjectURL(file));
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar onNewThread={() => {}} />

      {/*  App Sidebar */}
      <main className="w-full min-h-screen bg-background text-foreground">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <h2 className="text-base font-semibold">For You</h2>
          </div>
          <ModeToggle />
        </div>
        <div className="flex gap-8 max-w-9xl ml-6 lg:ml-12 px-4 py-6">
          {/* Feed kiri */}
          <div className="flex-1 min-w-0">
            {/* Compose */}
            <div className="px-4 py-4 border-b border-border">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="What's new?"
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none min-h-[60px]"
                    value={newThread}
                    onChange={(e) => setNewThread(e.target.value)}
                    rows={2}
                  />

                  {/* Preview image */}
                  {imageReview && (
                    <div className="relative mt-2 inline-block">
                      <img
                        src={imageReview}
                        className="max-h-48 rounded-xl object-cover border border-border"
                      />
                      <button
                        onClick={() => {
                          setImageFile(null);
                          setImageReview(null);
                        }}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center text-xs hover:bg-black/80"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    {/* Tombol upload image */}
                    <label className="cursor-pointer text-muted-foreground hover:text-primary transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          width="18"
                          height="18"
                          x="3"
                          y="3"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                    </label>

                    <button
                      onClick={handlePostThread}
                      disabled={newThread.trim() === ""}
                      className="px-4 py-1.5 rounded-full text-sm font-semibold bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
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
                <div className="w-6 h-6 rounded-full border-2 border-muted border-t-primary animate-spin" />
              </div>
            ) : error ? (
              <p className="text-destructive text-sm text-center py-8">
                {error}
              </p>
            ) : threads.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-12">
                Belum ada thread
              </p>
            ) : (
              threads.map((thread) => <PostCard key={thread.id} {...thread} />)
            )}
          </div>

          {/*Sidebar kanan — Profile dan suggest */}
          <aside className="w-80 shrink-0 space-y-4 hidden lg:block">
            <ProfileCard
              name={user?.name ?? ""}
              username={user?.username ?? ""}
              bio={user?.bio ?? ""}
              avatar={user?.photo_profile ?? ""}
              followers={0}
              following={0}
            />
            <SuggestCard />
          </aside>
        </div>
      </main>
    </SidebarProvider>
  );
}
