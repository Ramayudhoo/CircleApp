import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search as SearchIcon, X, ArrowLeft } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/SideBar";
import { ModeToggle } from "@/components/mode-togle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  // Fokus input saat halaman dibuka
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Debounce: cari setelah user berhenti ngetik 500ms
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
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border px-4 py-4 flex items-center gap-3">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground shrink-0" />
          <button
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Search Input */}
          <div className="relative flex-1">
            <SearchIcon
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users..."
              className="pl-9 pr-9 bg-muted/50 border-border rounded-full h-10 text-sm"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <ModeToggle />
        </div>

        {/* Hasil Pencarian */}
        <div className="max-w-2xl mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 rounded-full border-2 border-muted border-t-primary animate-spin" />
            </div>
          ) : query.trim() === "" ? (
            <p className="text-muted-foreground text-sm text-center py-12">
              Search for users by name or username
            </p>
          ) : users.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-12">
              No users found for "{query}"
            </p>
          ) : (
            <div className="divide-y divide-border">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between py-3 px-2 hover:bg-muted/30 rounded-lg transition-colors"
                >
                  <div
                    onClick={() => navigate(`/user/${user.id}`)}
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  >
                    <Avatar className="shrink-0">
                      <AvatarImage src={user.avatar || undefined} />
                      <AvatarFallback>
                        {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {user.name || "No Name"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        @{user.username}
                      </p>
                    </div>
                  </div>

                  {user.is_following !== null && (
                    <div className="shrink-0 ml-3">
                      {user.is_following ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUnfollow(user.id)}
                          className="rounded-full text-xs"
                        >
                          Unfollow
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleFollow(user.id)}
                          className="rounded-full text-xs"
                        >
                          Follow
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </SidebarProvider>
  );
}
