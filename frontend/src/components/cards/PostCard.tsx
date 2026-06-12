import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { initLike, toggleLike as toggleLikeRedux } from "../../store/likeSlice";
import { Heart, MessageCircle, Repeat2, Send } from "lucide-react";
import api from "../../lib/axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface PostCardProps {
  id: number;
  userId: number;
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
  userId,
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
  const [replyContent, setReplyContent] = useState("");
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyImage, setReplyImage] = useState<File | null>(null);
  const [replyImagePreview, setReplyImagePreview] = useState<string | null>(
    null,
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      initLike({
        threadId: id,
        isLiked: initialIsLiked,
        likeCount: likes,
      }),
    );
  }, [id]);

  const likeData = useSelector((state: RootState) => state.likes.likes[id]);

  const isLiked = likeData?.isLiked ?? initialIsLiked;
  const likeCount = likeData?.likeCount ?? likes;

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      dispatch(toggleLikeRedux(id));
      await api.post(`/threads/${id}/like`);
    } catch (err) {
      dispatch(toggleLikeRedux(id));
      console.log("Error toggling like:", err);
    }
  };
  const handleReply = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!replyContent.trim()) return;

    setReplyLoading(true);

    try {
      const formData = new FormData();

      formData.append("content", replyContent);

      if (replyImage) {
        formData.append("image", replyImage);
      }

      await api.post(`/reply?thread_id=${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setReplyContent("");
      setReplyImage(null);
      setReplyOpen(false);

      navigate(`/thread/${id}`);
    } catch (err) {
      console.log("Error creating reply:", err);
    } finally {
      setReplyLoading(false);
    }
  };

  const handleReplyImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setReplyImage(file);
      setReplyImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div
      className="px-6 py-5 hover:bg-card/40 backdrop-blur-xs transition-all duration-300 cursor-pointer relative group/post border-b border-border/30"
      onClick={() => navigate(`/thread/${id}`)}
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <Link to={`/user/${userId}`} onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0 overflow-hidden ring-2 ring-background/60 shadow-sm hover:scale-105 active:scale-95 transition-all duration-200">
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
          </Link>
          <div className="w-0.5 flex-1 bg-border/25 mt-3 mb-1 min-h-6 group-hover/post:bg-primary/20 transition-colors duration-300" />
        </div>

        {/* Konten */}
        <div className="flex-1 pb-1">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <Link
                to={`/user/${userId}`}
                onClick={(e) => e.stopPropagation()}
                className="font-bold text-sm text-foreground hover:text-primary transition-colors hover:underline"
              >
                {name}
              </Link>
              <Link
                to={`/user/${userId}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-muted-foreground/80 hover:text-foreground transition-colors"
              >
                @{username}
              </Link>
            </div>
            <span className="text-xs text-muted-foreground/75 font-medium">{createdAt}</span>
          </div>

          <p className="text-[14px] text-foreground/90 leading-relaxed mb-3 break-words">
            {content}
          </p>
          {image && (
            <div className="overflow-hidden rounded-xl border border-border/40 shadow-sm max-h-80 w-full mb-4 bg-muted/20">
              <img
                src={image}
                alt="thread image"
                className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          {/* Action buttons */}
          <div className="flex items-center gap-3 -ml-2">
            {/* Like */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:bg-destructive/10 ${
                isLiked
                  ? "text-red-500 scale-[1.05]"
                  : "text-muted-foreground hover:text-red-500"
              }`}
            >
              <Heart size={15} className={`transition-transform duration-200 active:scale-125 ${isLiked ? "fill-red-500 text-red-500 animate-pulse" : ""}`} />
              <span>{likeCount}</span>
            </button>

            {/* Reply — Dialog */}
            <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
              <DialogTrigger
                onClick={(e) => {
                  e.stopPropagation();
                  setReplyOpen(true);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-all duration-200"
              >
                <MessageCircle size={15} className="active:rotate-12 transition-transform" />
                <span>{replies}</span>
              </DialogTrigger>

              <DialogContent
                className="sm:max-w-md border border-border/40 bg-card/95 backdrop-blur-md shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <DialogHeader>
                  <DialogTitle className="text-base font-bold flex items-center gap-2">
                    <span>Reply to</span>
                    <span className="text-primary">@{username}</span>
                  </DialogTitle>
                </DialogHeader>

                {/* Preview thread yang di-reply */}
                <div className="flex gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/30 shadow-inner">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0 overflow-hidden shadow-sm">
                    {avatar ? (
                      <img
                        src={avatar}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-foreground">
                      {name}
                    </p>
                    <p className="text-xs text-muted-foreground/90 line-clamp-2 mt-0.5 break-words">
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
                  {replyImagePreview && (
                    <div className="relative inline-block">
                      <img
                        src={replyImagePreview}
                        className="max-h-40 rounded-xl border object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => {
                          setReplyImage(null);
                          setReplyImagePreview(null);
                        }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    {/* Upload gambar */}
                    <label className="cursor-pointer text-muted-foreground hover:text-primary transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleReplyImageChange}
                      />

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          width="18"
                          height="18"
                          x="3"
                          y="3"
                          rx="2"
                          ry="2"
                        />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                    </label>

                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setReplyOpen(false);
                          setReplyContent("");
                          setReplyImage(null);
                          setReplyImagePreview(null);
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
