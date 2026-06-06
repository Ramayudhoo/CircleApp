import { useState } from "react";
import { Heart, MessageCircle, Repeat2, Send } from "lucide-react";
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
    <div className="px-4 py-3 border-b border-zinc-800 hover:bg-zinc-900/30 transition-colors">
      <div className="flex gap-3">
        {/* Avatar + garis vertikal */}
        <div className="flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden">
            {avatar ? (
              <img src={avatar} className="w-full h-full object-cover" />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </div>
          {/* garis vertikal penghubung */}
          <div className="w-0.5 flex-1 bg-zinc-800 mt-2 mb-1 min-h-4" />
        </div>

        {/* Konten */}
        <div className="flex-1 pb-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-white">{name}</span>
              <span className="text-xs text-zinc-500">@{username}</span>
            </div>
            <span className="text-xs text-zinc-600">{createdAt}</span>
          </div>

          {/* Teks konten */}
          <p className="text-sm text-zinc-200 leading-relaxed mb-3">
            {content}
          </p>

          {/* Action buttons */}
          <div className="flex items-center gap-1 -ml-2">
            {/* Like */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs transition-colors hover:bg-red-500/10 ${
                isLiked ? "text-red-500" : "text-zinc-500 hover:text-red-500"
              }`}
            >
              <Heart size={15} className={isLiked ? "fill-red-500" : ""} />
              <span>{likeCount}</span>
            </button>

            {/* Reply */}
            <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
              <MessageCircle size={15} />
              <span>{replies}</span>
            </button>

            {/* Repost */}
            <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs text-zinc-500 hover:text-green-400 hover:bg-green-500/10 transition-colors">
              <Repeat2 size={15} />
            </button>

            {/* Share */}
            <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700/50 transition-colors">
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
