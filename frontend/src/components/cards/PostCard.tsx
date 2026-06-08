import { useState } from "react";
import { Heart, MessageCircle, Repeat2, Send } from "lucide-react";
import api from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface PostCardProps {
  id: number;
  username: string;
  name: string;
  avatar?: string;
  content: string;
  createdAt: string;
  likes: number;
  image?: string;
  replies: number;
  isLiked: boolean;
}

export default function PostCard({
  id,
  username,
  name,
  avatar,
  content,
  image,
  createdAt,
  likes,
  replies,
  isLiked: initialIsLiked,
}: PostCardProps) {
  console.log("image", image);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [replyContent, setReplyContent] = useState("");
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
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

  const handleReply = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!replyContent.trim()) return;
    setReplyLoading(true);

    try {
      await api.post("/reply", {
        thread_id: id,
        content: replyContent,
      });
      setReplyContent("");
      setReplyOpen(false);
      navigate(`/thread/${id}`);
    } catch (err) {
      console.log(err);
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <div
      className="px-4 py-3 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={() => navigate(`/thread/${id}`)}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0 overflow-hidden">
            {avatar ? (
              <img
                src={avatar}
                className="w-full h-full object-cover"
                alt="avatar"
              />
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
              <span className="font-semibold text-sm text-foreground">
                {name}
              </span>
              <span className="text-xs text-muted-foreground">@{username}</span>
            </div>
            <span className="text-xs text-muted-foreground">{createdAt}</span>
          </div>

          <p className="text-sm text-foreground leading-relaxed mb-3">
            {content}
          </p>
          {image && (
            <img
              src={image}
              alt="thread image"
              className="w-full max-h-72 object-cover rounded-xl border border-border mb-3"
              onClick={(e) => e.stopPropagation()}
            />
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-1 -ml-2">
            {/* Like */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs transition-colors hover:bg-destructive/10 ${
                isLiked
                  ? "text-red-500"
                  : "text-muted-foreground hover:text-red-500"
              }`}
            >
              <Heart size={15} className={isLiked ? "fill-red-500" : ""} />
              <span>{likeCount}</span>
            </button>

            {/* Reply — Dialog */}
            <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
              <DialogTrigger
                onClick={(e) => {
                  e.stopPropagation();
                  setReplyOpen(true);
                }}
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-colors"
              >
                <MessageCircle size={15} />
                <span>{replies}</span>
              </DialogTrigger>

              <DialogContent
                className="sm:max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <DialogHeader>
                  <DialogTitle className="text-base">
                    Reply to @{username}
                  </DialogTitle>
                </DialogHeader>

                {/* Preview thread yang di-reply */}
                <div className="flex gap-3 p-3 rounded-xl bg-muted/40 border border-border">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0 overflow-hidden">
                    {avatar ? (
                      <img
                        src={avatar}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      {name}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {content}
                    </p>
                  </div>
                </div>

                {/* Input reply */}
                <div className="space-y-3">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={`Reply to @${username}...`}
                    className="w-full min-h-25 bg-muted/30 border border-border rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none focus:border-primary transition-colors"
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {replyContent.length} karakter
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setReplyOpen(false);
                          setReplyContent("");
                        }}
                        className="px-4 py-1.5 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleReply}
                        disabled={!replyContent.trim() || replyLoading}
                        className="px-4 py-1.5 rounded-full text-sm font-semibold bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                      >
                        {replyLoading ? "Posting..." : "Reply"}
                      </button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Repost */}
            <button
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            >
              <Repeat2 size={15} />
            </button>

            {/* Share */}
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
