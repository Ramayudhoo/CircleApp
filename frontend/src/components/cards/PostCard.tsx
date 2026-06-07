import { useState } from "react";
import { Heart, MessageCircle, Repeat2, Send } from "lucide-react";
import api from "../../lib/axios";
import { useNavigate } from "react-router-dom";

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
  id,
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
  const navigate = useNavigate();

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();  
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
    <div
      className="px-4 py-3 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={() => navigate(`/thread/${id}`)} 
    >
      <div className="flex gap-3">

        {/* Avatar + garis vertikal */}
        <div className="flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0 overflow-hidden">
            {avatar ? (
              <img src={avatar} className="w-full h-full object-cover" alt="avatar" />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="w-0.5 flex-1 bg-border mt-2 mb-1 min-h-4" />
        </div>

        {/* Konten */}
        <div className="flex-1 pb-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-foreground">{name}</span>
              <span className="text-xs text-muted-foreground">@{username}</span>
            </div>
            <span className="text-xs text-muted-foreground">{createdAt}</span>
          </div>

          <p className="text-sm text-foreground leading-relaxed mb-3">{content}</p>

          <div className="flex items-center gap-1 -ml-2">
            <button
              onClick={handleLike} 
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs transition-colors hover:bg-destructive/10 ${
                isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
              }`}
            >
              <Heart size={15} className={isLiked ? "fill-red-500" : ""} />
              <span>{likeCount}</span>
            </button>

            <button
              onClick={(e) => e.stopPropagation()}  // ✅ biar tidak trigger navigate
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-colors"
            >
              <MessageCircle size={15} />
              <span>{replies}</span>
            </button>

            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <Repeat2 size={15} />
            </button>

            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}