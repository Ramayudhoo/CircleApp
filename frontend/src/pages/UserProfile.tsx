import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/SideBar";
import { ModeToggle } from "@/components/mode-togle";
import PostCard from "@/components/cards/PostCard";
import { Button } from "@/components/ui/button";
import { getUserProfile } from "@/services/userServices";
import { getUserThreads } from "@/services/userServices";
import { followUser, unfollowUser } from "@/services/followServices";
import { toast } from "sonner";
import FollowListModal from "@/components/FollowListModal";

interface UserProfileData {
  id: number;
  username: string;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  follower_count: number;
  following_count: number;
  is_following: boolean;
}

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

type TabType = "threads" | "replies";

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  console.log("User ID from URL:", id);
  const navigate = useNavigate();
  const userId = Number(id);
  console.log("Parsed userId:", userId);

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("threads");
  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [followModalTab, setFollowModalTab] = useState<
    "followers" | "following"
  >("followers");
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileData, threadsData] = await Promise.all([
          getUserProfile(userId),
          getUserThreads(userId),
        ]);

        setProfile(profileData);
        setIsFollowing(profileData.is_following);

        const mapped: Thread[] = threadsData.map((t: any) => ({
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
        setError("Gagal memuat profil");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleFollow = async () => {
    if (!profile) return;
    setFollowLoading(true);
    try {
      await followUser(String(profile.id));
      setIsFollowing(true);
      setProfile((prev) =>
        prev ? { ...prev, follower_count: prev.follower_count + 1 } : null,
      );
      toast.success(`Followed @${profile.username}`);
    } catch (err) {
      toast.error("Failed to follow");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUnfollow = async () => {
    if (!profile) return;
    setFollowLoading(true);
    try {
      await unfollowUser(String(profile.id));
      setIsFollowing(false);
      setProfile((prev) =>
        prev ? { ...prev, follower_count: prev.follower_count - 1 } : null,
      );
      toast.success(`Unfollowed @${profile.username}`);
    } catch (err) {
      toast.error("Failed to unfollow");
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar onNewThread={() => {}} />
        <main className="w-full min-h-screen bg-background flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-muted border-t-primary animate-spin" />
        </main>
      </SidebarProvider>
    );
  }

  if (error || !profile) {
    return (
      <SidebarProvider>
        <AppSidebar onNewThread={() => {}} />
        <main className="w-full min-h-screen bg-background flex items-center justify-center">
          <p className="text-destructive">{error || "User not found"}</p>
        </main>
      </SidebarProvider>
    );
  }

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
            <button
              onClick={() => navigate(-1)}
              className="text-muted-foreground hover:text-foreground transition-all duration-200 p-1.5 hover:bg-muted/40 rounded-full"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="h-4 w-[1px] bg-border/60 mx-1" />
            <h2 className="text-lg font-bold tracking-tight">{profile.name}</h2>
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
              <div className="flex items-end justify-between -mt-9 mb-4">
                <div className="w-20 h-20 rounded-full border-4 border-background bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-2xl font-bold overflow-hidden z-10 relative shadow-md">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      className="w-full h-full object-cover"
                      alt={profile.name}
                    />
                  ) : (
                    profile.name.charAt(0).toUpperCase()
                  )}
                </div>

                {/* Tombol Follow/Unfollow */}
                <div>
                  {isFollowing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleUnfollow}
                      disabled={followLoading}
                      className="rounded-full font-bold px-5 py-2 border-border/60 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all duration-200 shadow-xs cursor-pointer"
                    >
                      {followLoading ? "..." : "Unfollow"}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={handleFollow}
                      disabled={followLoading}
                      className="rounded-full font-bold px-6 py-2 bg-primary text-primary-foreground hover:scale-105 active:scale-95 shadow-md shadow-primary/20 transition-all duration-200 cursor-pointer"
                    >
                      {followLoading ? "..." : "Follow"}
                    </Button>
                  )}
                </div>
              </div>

              {/* Name + username + bio */}
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
                {threads.length === 0 ? (
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
        userId={String(userId)}
      />
    </SidebarProvider>
  );
}
