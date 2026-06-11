import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useFollowList } from "@/hooks/useFollowList";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: "followers" | "following";
  userId?: string;
}

export default function FollowListModal({
  open,
  onOpenChange,
  initialTab = "followers",
  userId,
}: Props) {
  const { users, loading, activeTab, changeTab, follow, unfollow } =
    useFollowList(initialTab, userId);

  const handleFollow = async (userId: string) => {
    try {
      await follow(userId).unwrap();
      toast.success("Followed successfully");
    } catch (err: any) {
      toast.error(err || "Failed to follow");
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      await unfollow(userId).unwrap();
      toast.success("Unfollowed successfully");
    } catch (err: any) {
      toast.error(err || "Failed to unfollow");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {activeTab === "followers" ? "Followers" : "Following"}
          </DialogTitle>
        </DialogHeader>

        {/* Tab Switch */}
        <div className="flex gap-2 mb-4">
          <Button
            size="sm"
            variant={activeTab === "followers" ? "default" : "outline"}
            onClick={() => changeTab("followers")}
          >
            Followers
          </Button>
          <Button
            size="sm"
            variant={activeTab === "following" ? "default" : "outline"}
            onClick={() => changeTab("following")}
          >
            Following
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm">
            No users yet.
          </p>
        ) : (
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      @{user.username}
                    </p>
                  </div>
                </div>
                {activeTab === "followers" &&
                  (user.is_following ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUnfollow(user.id)}
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => handleFollow(user.id)}>
                      Follow
                    </Button>
                  ))}
                {activeTab === "following" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUnfollow(user.id)}
                  >
                    Unfollow
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
