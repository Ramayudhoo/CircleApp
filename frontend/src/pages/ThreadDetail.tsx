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
    imageFile,
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

      <main className="w-full min-h-screen bg-background text-foreground">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <button
              onClick={() => navigate(-1)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-base font-semibold">Thread</h2>
          </div>
          <ModeToggle />
        </div>

        <div className="max-w-2xl ml-6 lg:ml-12 px-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-6 h-6 rounded-full border-2 border-muted border-t-primary animate-spin" />
            </div>
          ) : error ? (
            <p className="text-destructive text-sm text-center py-8">{error}</p>
          ) : thread ? (
            <>
              {/* Thread Detail Card */}
              <div className="px-4 py-4 border-b border-border">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold overflow-hidden">
                    {thread.user.profile_picture ? (
                      <img
                        src={thread.user.profile_picture}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      thread.user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">
                      {thread.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      @{thread.user.username}
                    </p>
                  </div>
                </div>

                <p className="text-foreground text-base leading-relaxed mb-3">
                  {thread.content}
                </p>

                {thread.image && (
                  <img
                    src={thread.image}
                    className="rounded-xl w-full object-cover max-h-80 mb-3"
                  />
                )}

                <p className="text-xs text-muted-foreground mb-3">
                  {new Date(thread.created_at).toLocaleString("id-ID")}
                </p>

                {/* Stats */}
                <div className="flex gap-4 py-3 border-y border-border text-sm">
                  <span>
                    <strong className="text-foreground">{likeCount}</strong>{" "}
                    <span className="text-muted-foreground">Likes</span>
                  </span>
                  <span>
                    <strong className="text-foreground">
                      {replies.length}
                    </strong>{" "}
                    <span className="text-muted-foreground">Replies</span>
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 -ml-2">
                  <button
                    onClick={handleLikeThread}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs transition-colors hover:bg-destructive/10 ${
                      isLiked
                        ? "text-red-500"
                        : "text-muted-foreground hover:text-red-500"
                    }`}
                  >
                    <Heart
                      size={16}
                      className={isLiked ? "fill-red-500" : ""}
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
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-colors"
                    >
                      <MessageCircle size={15} />
                      <span>{replies.length} Replies</span>
                    </DialogTrigger>

                    <DialogContent
                      className="sm:max-w-md"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DialogHeader>
                        <DialogTitle className="text-base">
                          Reply to @{thread.user.username}
                        </DialogTitle>
                      </DialogHeader>

                      {/* Preview thread */}
                      <div className="flex gap-3 p-3 rounded-xl bg-muted/40 border border-border">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0 overflow-hidden">
                          {thread.user.profile_picture ? (
                            <img
                              src={thread.user.profile_picture}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            thread.user.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-foreground">
                            {thread.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
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
                                resetReplyForm();
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
                </div>
              </div>

              {/* Replies List */}
              <div>
                {replies.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8">
                    Belum ada reply
                  </p>
                ) : (
                  replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="px-4 py-3 border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0 overflow-hidden">
                          {reply.user.profile_picture ? (
                            <img
                              src={reply.user.profile_picture}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            reply.user.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-foreground">
                              {reply.user.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              @{reply.user.username}
                            </span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {new Date(reply.created_at).toLocaleDateString(
                                "id-ID",
                              )}
                            </span>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">
                            {reply.content}
                          </p>
                          {reply.image && (
                            <img
                              src={reply.image}
                              alt="reply image"
                              className="w-full max-h-72 object-cover rounded-xl border border-border mb-3"
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                          <div className="flex items-center gap-1 mt-2">
                            <button
                              onClick={() => handleLikeReply(reply.id)}
                              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs transition-colors hover:bg-destructive/10 ${
                                reply.isLiked
                                  ? "text-red-500"
                                  : "text-muted-foreground hover:text-red-500"
                              }`}
                            >
                              <Heart
                                size={15}
                                className={reply.isLiked ? "fill-red-500" : ""}
                              />
                              <span>{reply.likes}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : null}
        </div>
      </main>
    </SidebarProvider>
  );
}
