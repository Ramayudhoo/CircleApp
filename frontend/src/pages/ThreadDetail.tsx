import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/SideBar";
import { ModeToggle } from "@/components/mode-togle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useThreadDetail } from "@/hooks/useThreadDetail";
import { useCreateReply } from "@/hooks/useCreateReply";
import { useState } from "react";

export default function ThreadDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const threadId = Number(id);

  const {
    thread,
    replies,
    loading,
    error,
    isLiked,
    likeCount,
    handleLikeThread,
    handleLikeReply,
    addReply,
  } = useThreadDetail(threadId);

  const {
    content: replyContent,
    setContent: setReplyContent,
    imagePreview: replyImagePreview,
    loading: replyLoading,
    handleImageChange: handleReplyImageChange,
    resetForm: resetReplyForm,
    submitReply,
    setImageFile,
    setImagePreview: setReplyImagePreview,
  } = useCreateReply(threadId);

  const [replyOpen, setReplyOpen] = useState(false);

  const handleReply = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newReply = await submitReply();
    if (newReply) {
      addReply(newReply);
      setReplyOpen(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar onNewThread={() => {}} />

      <main className="w-full min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 text-foreground relative overflow-hidden">
        {/* Decorative subtle background glowing shapes */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[140px] pointer-events-none" />

        {/* Header */}
        <div className="sticky top-0 z-20 bg-background/70 backdrop-blur-md border-b border-border/40 px-6 py-4 flex items-center justify-between transition-all duration-300">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors hover:scale-105 duration-200" />
            <button
              onClick={() => navigate(-1)}
              className="text-muted-foreground hover:text-foreground transition-all duration-200 p-1.5 hover:bg-muted/40 rounded-full"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="h-4 w-[1px] bg-border/60 mx-1" />
            <h2 className="text-lg font-bold tracking-tight">Thread</h2>
          </div>
          <ModeToggle />
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 relative z-10 space-y-6">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-7 h-7 rounded-full border-[3px] border-muted border-t-primary animate-spin" />
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-sm text-center">
              {error}
            </div>
          ) : thread ? (
            <>
              {/* Thread Detail Card */}
              <div className="p-5 border border-border/30 bg-card/25 backdrop-blur-md rounded-2xl shadow-xl shadow-black/5 hover:border-primary/20 transition-all duration-300">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold overflow-hidden ring-2 ring-background/60 shadow-sm">
                    {thread.user.profile_picture ? (
                      <img
                        src={thread.user.profile_picture}
                        className="w-full h-full object-cover"
                        alt={thread.user.name}
                      />
                    ) : (
                      thread.user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-foreground leading-tight hover:text-primary transition-colors cursor-pointer">
                      {thread.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground/90">
                      @{thread.user.username}
                    </p>
                  </div>
                </div>

                <p className="text-foreground/90 text-[15px] leading-relaxed mb-4 break-words">
                  {thread.content}
                </p>

                {thread.image && (
                  <div className="overflow-hidden rounded-xl border border-border/40 shadow-sm max-h-80 w-full mb-4 bg-muted/20">
                    <img
                      src={thread.image}
                      className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-500"
                      alt="thread content"
                    />
                  </div>
                )}

                <p className="text-xs text-muted-foreground/75 font-medium mb-4">
                  {new Date(thread.created_at).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" })}
                </p>

                {/* Stats */}
                <div className="flex gap-5 py-3 border-y border-border/35 text-xs font-semibold">
                  <span className="flex items-center gap-1">
                    <strong className="text-foreground">{likeCount}</strong>{" "}
                    <span className="text-muted-foreground/80">Likes</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <strong className="text-foreground">{replies.length}</strong>{" "}
                    <span className="text-muted-foreground/80">Replies</span>
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-3 -ml-2">
                  <button
                    onClick={handleLikeThread}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:bg-destructive/10 ${
                      isLiked
                        ? "text-red-500 scale-[1.03]"
                        : "text-muted-foreground hover:text-red-500"
                    }`}
                  >
                    <Heart
                      size={16}
                      className={`transition-transform duration-200 active:scale-125 ${isLiked ? "fill-red-500 text-red-500 animate-pulse" : ""}`}
                    />
                    <span>Like</span>
                  </button>

                  {/* Reply Dialog */}
                  <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
                    <DialogTrigger
                      onClick={(e) => {
                        e.stopPropagation();
                        setReplyOpen(true);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-all duration-200 cursor-pointer"
                    >
                      <MessageCircle size={15} />
                      <span>Reply</span>
                    </DialogTrigger>

                    <DialogContent
                      className="sm:max-w-md border border-border/40 bg-card/95 backdrop-blur-md shadow-2xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DialogHeader>
                        <DialogTitle className="text-base font-bold flex items-center gap-2">
                          <span>Reply to</span>
                          <span className="text-primary">@{thread.user.username}</span>
                        </DialogTitle>
                      </DialogHeader>

                      {/* Preview thread */}
                      <div className="flex gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/30 shadow-inner">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0 overflow-hidden shadow-sm">
                          {thread.user.profile_picture ? (
                            <img
                              src={thread.user.profile_picture}
                              className="w-full h-full object-cover"
                              alt="profile avatar"
                            />
                          ) : (
                            thread.user.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-foreground">
                            {thread.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground/90 line-clamp-2 mt-0.5 break-words">
                            {thread.content}
                          </p>
                        </div>
                      </div>

                      {/* Input reply */}
                      <div className="space-y-3">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder={`Reply to @${thread.user.username}...`}
                          className="w-full min-h-25 bg-muted/30 border border-border rounded-xl p-3 text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none focus:border-primary transition-colors"
                        />
                        {replyImagePreview && (
                          <div className="relative inline-block">
                            <img
                              src={replyImagePreview}
                              className="max-h-40 rounded-xl border object-cover"
                              alt="reply preview"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setImageFile(null);
                                setReplyImagePreview(null);
                              }}
                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white"
                            >
                              ✕
                            </button>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <label className="cursor-pointer text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-full">
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
                                resetReplyForm();
                              }}
                              className="px-4 py-1.5 rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                            >
                              Batal
                            </button>
                            <button
                              onClick={handleReply}
                              disabled={!replyContent.trim() || replyLoading}
                              className="px-5 py-2 rounded-full text-xs font-bold bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity cursor-pointer"
                            >
                              {replyLoading ? "Posting..." : "Reply"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Replies List */}
              <div className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground/80 px-2">Replies</h3>
                {replies.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-border/60 rounded-2xl bg-card/10">
                    <p className="text-muted-foreground text-sm font-medium">
                      Belum ada reply untuk thread ini
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/30 rounded-2xl border border-border/30 overflow-hidden bg-card/20 backdrop-blur-sm shadow-sm">
                    {replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="px-6 py-4 hover:bg-card/45 backdrop-blur-xs transition-all duration-300 border-b border-border/25"
                      >
                        <div className="flex gap-4">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0 overflow-hidden ring-2 ring-background/60 shadow-sm">
                            {reply.user.profile_picture ? (
                              <img
                                src={reply.user.profile_picture}
                                className="w-full h-full object-cover"
                                alt={reply.user.name}
                              />
                            ) : (
                              reply.user.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-sm text-foreground hover:text-primary transition-colors cursor-pointer truncate">
                                {reply.user.name}
                              </span>
                              <span className="text-xs text-muted-foreground/80 truncate">
                                @{reply.user.username}
                              </span>
                              <span className="text-xs text-muted-foreground/70 font-medium ml-auto shrink-0">
                                {new Date(reply.created_at).toLocaleDateString("id-ID")}
                              </span>
                            </div>
                            <p className="text-[13.5px] text-foreground/90 leading-relaxed mb-2.5 break-words">
                              {reply.content}
                            </p>
                            {reply.image && (
                              <div className="overflow-hidden rounded-xl border border-border/40 shadow-sm max-h-72 w-full mb-3 bg-muted/20">
                                <img
                                  src={reply.image}
                                  alt="reply image"
                                  className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-500"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleLikeReply(reply.id)}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 hover:bg-destructive/10 ${
                                  reply.isLiked
                                    ? "text-red-500"
                                    : "text-muted-foreground hover:text-red-500"
                                }`}
                              >
                                <Heart
                                  size={14}
                                  className={reply.isLiked ? "fill-red-500 text-red-500 animate-pulse" : ""}
                                />
                                <span>{reply.likes}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </main>
    </SidebarProvider>
  );
}
