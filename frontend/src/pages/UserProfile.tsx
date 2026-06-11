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

      <main className="w-full min-h-screen bg-background text-foreground">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <button
              onClick={() => navigate(-1)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-base font-semibold">{profile.name}</h2>
          </div>
          <ModeToggle />
        </div>

        <div className="max-w-2xl ml-6 lg:ml-12">
          {/* Cover */}
          <div className="h-32 w-full bg-gradient-to-br from-primary/40 via-secondary/30 to-primary/20 relative" />

          {/* Profile Info */}
          <div className="px-4 pb-4">
            <div className="flex items-end justify-between -mt-8 mb-4">
              <div className="w-16 h-16 rounded-full border-4 border-background bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold overflow-hidden">
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
                    className="rounded-full"
                  >
                    {followLoading ? "..." : "Unfollow"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleFollow}
                    disabled={followLoading}
                    className="rounded-full"
                  >
                    {followLoading ? "..." : "Follow"}
                  </Button>
                )}
              </div>
            </div>

            {/* Name + username + bio */}
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
              {threads.length === 0 ? (
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
        userId={String(userId)}
      />
    </SidebarProvider>
  );
}
