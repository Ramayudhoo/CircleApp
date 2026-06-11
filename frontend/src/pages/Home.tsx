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

export default function Home() {
  const user = useSelector((state: RootState) => state.auth.user);
  const profile = useSelector((state: RootState) => state.profile);
  const { threads, loading, error } = useThreads(user?.username);
  const {
    content: newThread,
    setContent: setNewThread,
    imageFile,
    setImageFile,
    imagePreview,
    setImagePreview,
    loading: posting,
    handlePost,
  } = useCreateThread();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar onNewThread={() => {}} />
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
                <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0 overflow-hidden">
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
                    placeholder="What's new?"
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none min-h-[60px]"
                    value={newThread}
                    onChange={(e) => setNewThread(e.target.value)}
                    rows={2}
                  />
                  {imagePreview && (
                    <div className="relative mt-2 inline-block">
                      <img
                        src={imagePreview}
                        className="max-h-48 rounded-xl object-cover border border-border"
                      />
                      <button
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center text-xs hover:bg-black/80"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <label className="cursor-pointer text-muted-foreground hover:text-primary transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                      {/* icon svg */}
                    </label>
                    <button
                      onClick={handlePost}
                      disabled={!newThread.trim() || posting}
                      className="px-4 py-1.5 rounded-full text-sm font-semibold bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                    >
                      {posting ? "Posting..." : "Post"}
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

          {/* Sidebar kanan */}
          <aside className="w-80 shrink-0 space-y-4 hidden lg:block">
            <ProfileCard onEditProfile={() => {}} />
            <SuggestCard />
          </aside>
        </div>
      </main>
    </SidebarProvider>
  );
}
