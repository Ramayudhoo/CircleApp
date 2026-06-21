import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, X, Users, SearchX } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/SideBar";
import { ModeToggle } from "@/components/mode-togle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSearchUsers } from "@/hooks/useSearchUser";

export default function Search() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    query,
    setQuery,
    users,
    loading,
    search,
    handleFollow,
    handleUnfollow,
  } = useSearchUsers();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      search(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query, search]);

  return (
    <SidebarProvider>
      <AppSidebar onNewThread={() => {}} />

      <main className="w-full min-h-screen bg-background text-foreground">
        {/* ── Header ── */}
        <div className="sticky top-0 z-20 bg-background/70 backdrop-blur-xl border-b border-border/50 px-4 py-3 flex items-center gap-3">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground shrink-0 transition-colors" />

          {/* Search bar */}
          <div className="relative flex-1 group">
            {/* glow ring on focus */}
            <span
              className="
                pointer-events-none absolute inset-0 rounded-full
                opacity-0 group-focus-within:opacity-100
                transition-opacity duration-300
                ring-2 ring-[var(--color-sakura)]/40
              "
            />
            <SearchIcon
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-[var(--color-sakura)] transition-colors duration-200 z-10"
            />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users…"
              className="
                w-full h-10 pl-9 pr-9 rounded-full text-sm
                bg-muted/60 border border-border/60
                text-foreground placeholder:text-muted-foreground/60
                outline-none focus:border-[var(--color-sakura)]/50
                transition-all duration-200
              "
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <ModeToggle />
        </div>

        {/* ── Body ── */}
        <div className="max-w-2xl mx-auto px-4 py-6">

          {/* ── Loading Skeleton ── */}
          {loading && (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-card/40 animate-pulse"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="w-10 h-10 rounded-full bg-muted/70 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-32 rounded-full bg-muted/70" />
                    <div className="h-2.5 w-20 rounded-full bg-muted/50" />
                  </div>
                  <div className="h-7 w-20 rounded-full bg-muted/70" />
                </div>
              ))}
            </div>
          )}

          {/* ── Empty query state ── */}
          {!loading && query.trim() === "" && (
            <div className="flex flex-col items-center justify-center py-24 gap-5 select-none">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-[var(--color-sakura)]/10 flex items-center justify-center ring-1 ring-[var(--color-sakura)]/20">
                  <Users size={34} className="text-[var(--color-sakura)]/70" />
                </div>
              </div>
              <div className="text-center space-y-1.5">
                <p className="text-sm font-medium text-foreground/80">Find People</p>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
                  Type a name or username to discover users
                </p>
              </div>
            </div>
          )}

          {/* ── No results ── */}
          {!loading && query.trim() !== "" && users.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-5 select-none">
              <div className="w-20 h-20 rounded-full bg-muted/40 flex items-center justify-center ring-1 ring-border/50">
                <SearchX size={34} className="text-muted-foreground/60" />
              </div>
              <div className="text-center space-y-1.5">
                <p className="text-sm font-medium text-foreground/80">No results</p>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-[220px]">
                  No users found for{" "}
                  <span className="text-[var(--color-sakura)] font-medium">
                    "{query}"
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* ── Results list ── */}
          {!loading && users.length > 0 && (
            <>
              <p className="text-xs text-muted-foreground mb-3 px-1">
                {users.length} result{users.length !== 1 ? "s" : ""} for{" "}
                <span className="text-[var(--color-sakura)]">"{query}"</span>
              </p>

              <div className="space-y-1.5">
                {users.map((user, idx) => (
                  <div
                    key={user.id}
                    className="
                      group flex items-center justify-between
                      px-3 py-3 rounded-2xl
                      bg-card/30 hover:bg-card/70
                      border border-transparent hover:border-border/50
                      transition-all duration-200 cursor-default
                    "
                    style={{
                      animationDelay: `${idx * 40}ms`,
                      animation: "fadeSlideIn 0.25s ease both",
                    }}
                  >
                    {/* Avatar + info */}
                    <div
                      onClick={() => navigate(`/user/${user.id}`)}
                      className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                    >
                      <div className="relative shrink-0">
                        <Avatar className="w-10 h-10 ring-2 ring-transparent group-hover:ring-[var(--color-sakura)]/30 transition-all duration-200">
                          <AvatarImage src={user.avatar || undefined} />
                          <AvatarFallback className="bg-[var(--color-sakura)]/20 text-[var(--color-sakura)] text-sm font-semibold">
                            {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                          </AvatarFallback>
                        </Avatar>
                        {/* online-ish dot decoration */}
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-background border-2 border-background" />
                      </div>

                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate text-foreground group-hover:text-[var(--color-sakura)] transition-colors duration-150">
                          {user.name || "No Name"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          @{user.username}
                        </p>
                      </div>
                    </div>

                    {/* Follow / Unfollow */}
                    {user.is_following !== null && (
                      <div className="shrink-0 ml-3">
                        {user.is_following ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUnfollow(user.id)}
                            className="
                              h-7 px-4 rounded-full text-xs font-medium
                              border-border/60 hover:border-destructive/60
                              hover:text-destructive hover:bg-destructive/10
                              transition-all duration-200
                            "
                          >
                            Unfollow
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleFollow(user.id)}
                            className="
                              h-7 px-4 rounded-full text-xs font-semibold
                              bg-[var(--color-sakura)] hover:bg-[var(--color-sakura)]/85
                              text-background shadow-sm shadow-[var(--color-sakura)]/30
                              transition-all duration-200
                            "
                          >
                            Follow
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* keyframe animation */}
        <style>{`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </main>
    </SidebarProvider>
  );
}
