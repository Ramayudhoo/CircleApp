import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/SideBar";
import { ModeToggle } from "@/components/mode-togle";
import PostCard from "../components/cards/PostCard";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUserThreads } from "@/hooks/useUserThreads";
import { useEditProfile } from "@/hooks/useEditProfile";
import FollowListModal from "@/components/FollowListModal";

type TabType = "threads" | "replies";

export default function Profile() {
  console.log("PROFILE PAGE RENDER");

  const profile = useSelector((state: RootState) => state.profile);
  const { threads, loading } = useUserThreads(profile.id);
  const {
    name,
    setName,
    username,
    setUsername,
    bio,
    setBio,
    setAvatar,
    avatarPreview,
    setAvatarPreview,
    handleSave,
  } = useEditProfile();

  const [activeTab, setActiveTab] = useState<TabType>("threads");
  const [editOpen, setEditOpen] = useState(false);
  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [followModalTab, setFollowModalTab] = useState<
    "followers" | "following"
  >("followers");

  // Sync form fields when profile changes
  useEffect(() => {
    setName(profile.name);
    setUsername(profile.username);
    setBio(profile.bio || "");
    setAvatarPreview(profile.avatar || "");
  }, [profile]);

  const onSave = async () => {
    const success = await handleSave();
    if (success) setEditOpen(false);
  };

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
            <h2 className="text-lg font-bold tracking-tight">Profile</h2>
          </div>
          <ModeToggle />
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 relative z-10 space-y-6">
          <div className="rounded-2xl border border-border/30 bg-card/25 backdrop-blur-md overflow-hidden shadow-xl shadow-black/5">
            {/* Cover */}
            <div className="h-36 w-full bg-gradient-to-tr from-primary/50 via-purple-500/30 to-secondary/50 overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-40" />
            </div>

            {/* Profile Info */}
            <div className="px-6 pb-6">
              {/* Avatar + Edit Button */}
              <div className="flex items-end justify-between -mt-9 mb-4">
                <div className="w-20 h-20 rounded-full border-4 border-background bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-2xl font-bold overflow-hidden z-10 relative shadow-md">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      className="w-full h-full object-cover"
                      alt="avatar"
                    />
                  ) : (
                    profile.name.charAt(0).toUpperCase() || "?"
                  )}
                </div>

                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                  <DialogTrigger className="rounded-full border border-border/60 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary text-xs font-bold px-5 py-2 transition-all duration-200 shadow-xs cursor-pointer">
                    Edit profile
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-lg border border-border/40 bg-card/95 backdrop-blur-md">
                    <DialogHeader>
                      <DialogTitle className="font-bold">Edit Profile</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                      {/* Avatar */}
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-24 h-24 rounded-full overflow-hidden border border-border/60 shadow-sm relative group">
                          {avatarPreview ? (
                            <img
                              src={avatarPreview}
                              className="w-full h-full object-cover"
                              alt="preview"
                            />
                          ) : (
                            <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                              {name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        <label className="cursor-pointer text-sm font-semibold text-primary hover:underline transition-colors">
                          Change Photo
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setAvatar(file);
                                setAvatarPreview(URL.createObjectURL(file));
                              }
                            }}
                          />
                        </label>
                      </div>

                      {/* Name */}
                      <div>
                        <label className="text-sm font-semibold">Name</label>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-border/60 bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary transition-all"
                        />
                      </div>

                      {/* Username */}
                      <div>
                        <label className="text-sm font-semibold">Username</label>
                        <input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="mt-1 w-full rounded-xl border border-border/60 bg-background/50 px-3 py-2 text-sm outline-none focus:border-primary transition-all"
                        />
                      </div>

                      {/* Bio */}
                      <div>
                        <label className="text-sm font-semibold">Bio</label>
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={4}
                          className="mt-1 w-full rounded-xl border border-border/60 bg-background/50 px-3 py-2 text-sm resize-none outline-none focus:border-primary transition-all"
                        />
                      </div>

                      <div className="flex justify-end gap-2.5 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => setEditOpen(false)}
                          className="rounded-full"
                        >
                          Cancel
                        </Button>
                        <Button onClick={onSave} className="rounded-full font-bold">Save</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Nama + username */}
              <div className="space-y-1 mb-4">
                <h1 className="text-xl font-extrabold text-foreground tracking-tight">
                  {profile.name}
                </h1>
                <p className="text-sm text-muted-foreground/90 font-medium">
                  @{profile.username}
                </p>
                {profile.bio && (
                  <p className="text-sm text-foreground/90 pt-2 leading-relaxed">
                    {profile.bio}
                  </p>
                )}
              </div>

              {/* Follower / Following */}
              <div className="flex gap-5 text-sm pt-2">
                <button
                  onClick={() => {
                    setFollowModalTab("following");
                    setFollowModalOpen(true);
                  }}
                  className="hover:underline transition-all group"
                >
                  <span className="font-bold text-foreground group-hover:text-primary">
                    {profile.following_count}
                  </span>
                  <span className="text-muted-foreground/80 ml-1">Following</span>
                </button>
                <button
                  onClick={() => {
                    setFollowModalTab("followers");
                    setFollowModalOpen(true);
                  }}
                  className="hover:underline transition-all group"
                >
                  <span className="font-bold text-foreground group-hover:text-primary">
                    {profile.follower_count}
                  </span>
                  <span className="text-muted-foreground/80 ml-1">Followers</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs Selector */}
          <div className="flex border-b border-border/40 bg-card/25 backdrop-blur-sm rounded-xl p-1 gap-1">
            <button
              onClick={() => setActiveTab("threads")}
              className={`flex-1 py-2.5 text-xs font-bold relative transition-all duration-300 rounded-lg ${
                activeTab === "threads"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              Threads
            </button>
            <button
              onClick={() => setActiveTab("replies")}
              className={`flex-1 py-2.5 text-xs font-bold relative transition-all duration-300 rounded-lg ${
                activeTab === "replies"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              Replies
            </button>
          </div>

          {/* Thread List */}
          <div className="space-y-4">
            {activeTab === "threads" && (
              <>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-7 h-7 rounded-full border-[3px] border-muted border-t-primary animate-spin" />
                  </div>
                ) : threads.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-border/60 rounded-2xl bg-card/10">
                    <p className="text-muted-foreground text-sm font-medium">
                      Belum ada thread untuk ditampilkan
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/30 rounded-2xl border border-border/30 overflow-hidden bg-card/20 backdrop-blur-sm shadow-sm">
                    {threads.map((thread) => (
                      <PostCard key={thread.id} {...thread} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Replies tab */}
            {activeTab === "replies" && (
              <div className="text-center py-16 border border-dashed border-border/60 rounded-2xl bg-card/10">
                <p className="text-muted-foreground text-sm font-medium">
                  Belum ada replies untuk ditampilkan
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Follow Modal */}
      <FollowListModal
        open={followModalOpen}
        onOpenChange={setFollowModalOpen}
        initialTab={followModalTab}
      />
    </SidebarProvider>
  );
}
