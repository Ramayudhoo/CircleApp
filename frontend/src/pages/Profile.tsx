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
    avatar,
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

      <main className="w-full min-h-screen bg-background text-foreground">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <h2 className="text-base font-semibold">Profile</h2>
          </div>
          <ModeToggle />
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Cover */}
          <div className="h-32 w-full bg-gradient-to-br from-primary/40 via-secondary/30 to-primary/20 relative" />

          {/* Profile Info */}
          <div className="px-4 pb-4">
            {/* Avatar + Edit Button */}
            <div className="flex items-end justify-between -mt-8 mb-4">
              <div className="w-16 h-16 rounded-full border-4 border-background bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold overflow-hidden">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile.name.charAt(0).toUpperCase() || "?"
                )}
              </div>

              <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogTrigger className="rounded-full border-border text-foreground hover:bg-accent text-xs px-4">
                  Edit profile
                </DialogTrigger>

                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    {/* Avatar */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-24 h-24 rounded-full overflow-hidden border">
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                            {name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <label className="cursor-pointer text-sm text-primary hover:underline">
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
                      <label className="text-sm font-medium">Name</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                    </div>

                    {/* Username */}
                    <div>
                      <label className="text-sm font-medium">Username</label>
                      <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="text-sm font-medium">Bio</label>
                      <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm resize-none outline-none focus:border-primary"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setEditOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={onSave}>Save</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Nama + username */}
            <div className="space-y-1 mb-4">
              <h1 className="text-xl font-bold text-foreground">
                {profile.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                @{profile.username}
              </p>
              {profile.bio && (
                <p className="text-sm text-foreground pt-1 leading-relaxed">
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Follower / Following */}
            <div className="flex gap-4 text-sm mb-4">
              <button
                onClick={() => {
                  setFollowModalTab("following");
                  setFollowModalOpen(true);
                }}
                className="hover:underline"
              >
                <span className="font-semibold text-foreground">
                  {profile.following_count}
                </span>
                <span className="text-muted-foreground ml-1">Following</span>
              </button>
              <button
                onClick={() => {
                  setFollowModalTab("followers");
                  setFollowModalOpen(true);
                }}
                className="hover:underline"
              >
                <span className="font-semibold text-foreground">
                  {profile.follower_count}
                </span>
                <span className="text-muted-foreground ml-1">Followers</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab("threads")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === "threads"
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Threads
            </button>
            <button
              onClick={() => setActiveTab("replies")}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                activeTab === "replies"
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Replies
            </button>
          </div>

          {/* Thread List */}
          {activeTab === "threads" && (
            <>
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-6 h-6 rounded-full border-2 border-muted border-t-primary animate-spin" />
                </div>
              ) : threads.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-12">
                  Belum ada thread
                </p>
              ) : (
                threads.map((thread) => (
                  <PostCard key={thread.id} {...thread} />
                ))
              )}
            </>
          )}

          {/* Replies tab */}
          {activeTab === "replies" && (
            <p className="text-muted-foreground text-sm text-center py-12">
              Belum ada replies
            </p>
          )}
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
