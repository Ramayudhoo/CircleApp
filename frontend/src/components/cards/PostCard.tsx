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
      className="px-4 py-3 border-b border-border hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={() => navigate(`/thread/${id}`)}
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <Link to={`/user/${userId}`} onClick={(e) => e.stopPropagation()}>
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0 overflow-hidden hover:opacity-80 transition-opacity">
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
          <div className="w-0.5 flex-1 bg-border mt-2 mb-1 min-h-4" />
        </div>

        {/* Konten */}
        <div className="flex-1 pb-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Link
                to={`/user/${userId}`}
                onClick={(e) => e.stopPropagation()}
                className="font-semibold text-sm text-foreground hover:underline"
              >
                {name}
              </Link>
              <Link
                to={`/user/${userId}`}
                onClick={(e) => e.stopPropagation()}
                className="text-xs text-muted-foreground hover:underline"
              >
                @{username}
              </Link>
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
