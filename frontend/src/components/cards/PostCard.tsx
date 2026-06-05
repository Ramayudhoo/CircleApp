import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
import api from "../../lib/axios";

interface PostCardProps {
  id: number;
  username: string;
  name: string;
  avatar?: string;
  content: string;
  createdAt: string;
  likes: number;
  replies: number;
  isLiked: boolean;
}

export default function PostCard({
  id, // ✅ tambah id
  username,
  name,
  avatar,
  content,
  createdAt,
  likes,
  replies,
  isLiked: initialIsLiked,
}: PostCardProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = async () => {
    try {
      await api.post(`/threads/${id}/like`);
      if (isLiked) {
        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (err) {
      console.log("Error toggling like:", err);
    }
  };

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold shrink-0">
            {avatar ? (
              <img
                src={avatar}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <p className="font-semibold text-sm text-white">{name}</p>
            <p className="text-xs text-zinc-500">
              @{username} · {createdAt}
            </p>
          </div>
        </div>

        <p className="text-sm text-zinc-200">{content}</p>

        <div className="flex gap-4 pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`gap-1 px-2 hover:text-red-500 ${isLiked ? "text-red-500" : "text-zinc-500"}`}
          >
            <Heart size={16} className={isLiked ? "fill-red-500" : ""} />
            <span className="text-xs">{likeCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-1 px-2 text-zinc-500 hover:text-green-500"
          >
            <MessageCircle size={16} />
            <span className="text-xs">{replies}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
