import { useState, useCallback } from "react";
import { searchUsers } from "@/services/userServices";
import { SearchUser } from "@/types/user";
import { followUser, unfollowUser } from "@/services/followServices";
import { toast } from "sonner";

export const useSearchUsers = () => {
  const [users, setUsers] = useState<SearchUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const search = useCallback(async (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setUsers([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await searchUsers(q);
      setUsers(results);
    } catch (err) {
      setError("Gagal mencari user");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFollow = async (userId: number) => {
    try {
      await followUser(String(userId));
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_following: true } : u)),
      );
      toast.success("Followed successfully");
    } catch (err) {
      toast.error("Failed to follow");
    }
  };

  const handleUnfollow = async (userId: number) => {
    try {
      await unfollowUser(String(userId));
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, is_following: false } : u)),
      );
      toast.success("Unfollowed successfully");
    } catch (err) {
      toast.error("Failed to unfollow");
    }
  };

  return {
    query,
    setQuery: (q: string) => setQuery(q),
    users,
    loading,
    error,
    search,
    handleFollow,
    handleUnfollow,
  };
};
