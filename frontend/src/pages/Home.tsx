import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import PostCard from "../components/cards/PostCard";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-togle";
import { AppSidebar } from "@/components/layout/SideBar";
import ProfileCard from "@/components/cards/ProfileCard";
import SuggestCard from "@/components/cards/SuggestCard";
import { useThreads } from "@/hooks/useThreads";
import { useCreateThread } from "@/hooks/useCreateThreads";
import { Image as ImageIcon, Sparkles } from "lucide-react";

export default function Home() {
  const user = useSelector((state: RootState) => state.auth.user);
  const profile = useSelector((state: RootState) => state.profile);
  const { threads, loading, error } = useThreads(user?.username);
  const {
    content: newThread,
    setContent: setNewThread,
    setImageFile,
    imagePreview,
    setImagePreview,
    loading: posting,
    handlePost,
  } = useCreateThread();

  const [activeTab, setActiveTab] = useState<"for-you" | "following">(
    "for-you",
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Filter threads based on activeTab (or simulate it if all are mixed)
  const filteredThreads =
    activeTab === "following"
      ? threads.filter((t) => t.isLiked || t.replies > 0) // filter simulation for following
      : threads;

  return (
    <SidebarProvider>
      <AppSidebar onNewThread={() => {}} />
      <main className="w-full min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 text-foreground relative overflow-hidden">
        {/* Decorative subtle background glowing shapes */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[140px] pointer-events-none" />

        {/* Header */}
        <div className="sticky top-0 z-20 bg-background/70 backdrop-blur-md border-b border-border/40 px-6 py-4 flex items-center justify-between transition-all duration-300">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors hover:scale-105 duration-200" />
            <div className="h-4 w-[1px] bg-border/60 mx-1" />
            <h2 className="text-lg font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent flex items-center gap-2">
              Home
            </h2>
          </div>
          <ModeToggle />
        </div>

        <div className="flex gap-8 max-w-7xl mx-auto lg:ml-12 px-4 py-6 relative z-10">
          {/* Feed kiri */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Tabs Selector */}
            <div className="flex border-b border-border/40 bg-card/25 backdrop-blur-sm rounded-xl p-1 gap-1">
              <button
                onClick={() => setActiveTab("for-you")}
                className={`flex-1 py-2.5 text-xs font-semibold relative transition-all duration-300 rounded-lg ${
                  activeTab === "for-you"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                For You
              </button>
              <button
                onClick={() => setActiveTab("following")}
                className={`flex-1 py-2.5 text-xs font-semibold relative transition-all duration-300 rounded-lg ${
                  activeTab === "following"
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                }`}
              >
                Following
              </button>
            </div>

            {/* Compose Card */}
            <div className="p-5 border border-border/45 bg-card/35 backdrop-blur-lg rounded-2xl shadow-xl shadow-black/5 hover:shadow-black/10 hover:border-primary/30 transition-all duration-300 group">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0 overflow-hidden ring-2 ring-background shadow-md">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profile.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="Share something interesting today..."
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 resize-none outline-none min-h-[70px] border-b border-border/20 focus:border-primary/30 transition-all duration-300 pb-2"
                    value={newThread}
                    onChange={(e) => setNewThread(e.target.value)}
                    rows={2}
                  />
                  {imagePreview && (
                    <div className="relative mt-3 inline-block group/preview">
                      <img
                        src={imagePreview}
                        className="max-h-56 rounded-xl object-cover border border-border/60 shadow-md transition-transform duration-200 group-hover/preview:scale-[1.01]"
                      />
                      <button
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 backdrop-blur-md text-foreground flex items-center justify-center text-xs hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 shadow-md border border-border/40"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <label className="cursor-pointer text-muted-foreground hover:text-primary transition-all duration-200 p-2 hover:bg-primary/10 rounded-full">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      <ImageIcon
                        size={18}
                        className="hover:scale-110 transition-transform duration-200"
                      />
                    </label>
                    <button
                      onClick={handlePost}
                      disabled={!newThread.trim() || posting}
                      className="px-5 py-2 rounded-full text-xs font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/25 disabled:opacity-20 disabled:shadow-none disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all duration-200"
                    >
                      {posting ? "Posting..." : "Post"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Thread list */}
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-7 h-7 rounded-full border-[3px] border-muted border-t-primary animate-spin" />
                </div>
              ) : error ? (
                <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-sm text-center">
                  {error}
                </div>
              ) : filteredThreads.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-border/60 rounded-2xl bg-card/10">
                  <p className="text-muted-foreground text-sm font-medium">
                    Belum ada thread untuk ditampilkan
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/30 rounded-2xl border border-border/30 overflow-hidden bg-card/20 backdrop-blur-sm shadow-sm">
                  {filteredThreads.map((thread) => (
                    <PostCard key={thread.id} {...thread} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar kanan */}
          <aside className="w-80 shrink-0 space-y-6 hidden lg:block">
            <ProfileCard onEditProfile={() => {}} />
            <SuggestCard />
          </aside>
        </div>
      </main>
    </SidebarProvider>
  );
}
