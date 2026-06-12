import { useState, useEffect } from "react";
import { getSuggestedUsers } from "@/services/userServices";
import { SuggestedUser } from "@/types/suggest";
import { followUser, unfollowUser } from "@/services/followServices";
import { toast } from "sonner";

export const useSuggestedUsers = (limit: number = 5) => {
  const [users, setUsers] = useState<SuggestedUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const data = await getSuggestedUsers(limit);
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [limit]);

  const handleFollow = async (userId: number) => {
    try {
      await followUser(String(userId));
      // Hapus user dari list setelah di-follow
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success("Followed successfully");
    } catch (err) {
      toast.error("Failed to follow");
    }
  };

  return { users, loading, handleFollow, refetch: fetchSuggestions };
};
