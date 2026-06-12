import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSuggestedUsers } from "@/hooks/useSuggestUsers";

export default function SuggestCard() {
  const { users, loading, handleFollow } = useSuggestedUsers(5);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="rounded-2xl border border-border/30 bg-card/45 backdrop-blur-md p-5 space-y-4 shadow-lg shadow-black/5">
        <Skeleton className="h-4 w-24" />
        <div className="space-y-3.5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-8 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) return null; // Tidak ada saran

  return (
    <div className="rounded-2xl border border-border/30 bg-card/45 backdrop-blur-md p-5 space-y-4 shadow-lg shadow-black/5 hover:border-primary/20 transition-all duration-300">
      <p className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
        Suggested for you
      </p>

      <div className="space-y-3.5">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between gap-3 group/item"
          >
            {/* User info — klik ke profil */}
            <div
              onClick={() => navigate(`/user/${user.id}`)}
              className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0 overflow-hidden ring-2 ring-background/50 shadow-sm transition-transform duration-200 group-hover/item:scale-105">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    className="w-full h-full object-cover"
                    alt={user.name}
                  />
                ) : (
                  (user.name || "?").charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground leading-tight hover:text-primary transition-colors truncate">
                  {user.name || "No Name"}
                </p>
                <p className="text-xs text-muted-foreground/80 truncate">
                  @{user.username}
                </p>
                {user.bio && (
                  <p className="text-[11px] text-muted-foreground/75 truncate mt-0.5 max-w-[150px]">
                    {user.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Tombol Follow */}
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleFollow(user.id);
              }}
              className="rounded-full text-xs px-4 border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 shrink-0 font-semibold shadow-xs"
            >
              Follow
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
