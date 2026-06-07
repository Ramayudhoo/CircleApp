import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Heart, MessageCircle } from "lucide-react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/SideBar"
import { ModeToggle } from "@/components/mode-togle"
import api from "../lib/axios"

interface Thread {
  id: number
  content: string
  image?: string
  created_at: string
  user: {
    id: number
    username: string
    name: string
    profile_picture?: string
  }
  likes: number
  replies: number
  isLiked: boolean
}

interface Reply {
  id: number
  content: string
  created_at: string
  user: {
    id: number
    username: string
    name: string
    profile_picture?: string
  }
}

export default function ThreadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [thread, setThread] = useState<Thread | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch thread detail
        const threadRes = await api.get(`/threads/${id}`)
        const t = threadRes.data.data
        setThread(t)
        setIsLiked(t.isLiked)
        setLikeCount(t.likes)

        // fetch replies
        const repliesRes = await api.get(`/reply?thread_id=${id}`)
        console.log("REPLIES RESPONSE:", repliesRes.data)
        setReplies(repliesRes.data.data.replies)
      } catch (err) {
        setError("Gagal memuat thread")
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleLike = async () => {
    try {
      await api.post(`/threads/${id}/like`)
      if (isLiked) {
        setIsLiked(false)
        setLikeCount((prev) => prev - 1)
      } else {
        setIsLiked(true)
        setLikeCount((prev) => prev + 1)
      }
    } catch (err) {
      console.log(err)
    }
  }

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
                      <img src={thread.user.profile_picture} className="w-full h-full object-cover" />
                    ) : (
                      thread.user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{thread.user.name}</p>
                    <p className="text-xs text-muted-foreground">@{thread.user.username}</p>
                  </div>
                </div>

                <p className="text-foreground text-base leading-relaxed mb-3">{thread.content}</p>

                {thread.image && (
                  <img src={thread.image} className="rounded-xl w-full object-cover max-h-80 mb-3" />
                )}

                <p className="text-xs text-muted-foreground mb-3">
                  {new Date(thread.created_at).toLocaleString("id-ID")}
                </p>

                {/* Stats */}
                <div className="flex gap-4 py-3 border-y border-border text-sm">
                  <span><strong className="text-foreground">{likeCount}</strong> <span className="text-muted-foreground">Likes</span></span>
                  <span><strong className="text-foreground">{thread.replies}</strong> <span className="text-muted-foreground">Replies</span></span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 -ml-2">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs transition-colors hover:bg-destructive/10 ${
                      isLiked ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                    }`}
                  >
                    <Heart size={16} className={isLiked ? "fill-red-500" : ""} />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-full text-xs text-muted-foreground hover:text-secondary hover:bg-secondary/10 transition-colors">
                    <MessageCircle size={16} />
                    <span>Reply</span>
                  </button>
                </div>
              </div>

              {/* Replies */}
              <div>
                {replies.length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-8">Belum ada reply</p>
                ) : (
                  replies.map((reply) => (
                    <div key={reply.id} className="px-4 py-3 border-b border-border hover:bg-muted/30 transition-colors">
                      <div className="flex gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0 overflow-hidden">
                          {reply.user.profile_picture ? (
                            <img src={reply.user.profile_picture} className="w-full h-full object-cover" />
                          ) : (
                            reply.user.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm text-foreground">{reply.user.name}</span>
                            <span className="text-xs text-muted-foreground">@{reply.user.username}</span>
                            <span className="text-xs text-muted-foreground ml-auto">
                              {new Date(reply.created_at).toLocaleDateString("id-ID")}
                            </span>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">{reply.content}</p>
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
  )
}