import { Button } from "@/components/ui/button"

interface SuggestUser {
  id: number
  name: string
  username: string
  avatar?: string
  bio?: string
}

interface SuggestCardProps {
  users?: SuggestUser[]
}

const DUMMY_SUGGESTIONS: SuggestUser[] = [
  { id: 1, name: "Alice Tanaka", username: "alicetan", bio: "UI/UX Designer 🎨" },
  { id: 2, name: "Bob Kimura", username: "bobkimura", bio: "Full Stack Dev ⚡" },
  { id: 3, name: "Carol Sato", username: "carolsato", bio: "Product Manager 🚀" },
]

export default function SuggestCard({ users = DUMMY_SUGGESTIONS }: SuggestCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-4">
      <p className="font-semibold text-sm text-foreground">Suggested for you</p>

      {users.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0 overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground leading-tight">{user.name}</p>
              <p className="text-xs text-muted-foreground">@{user.username}</p>
              {user.bio && (
                <p className="text-xs text-muted-foreground">{user.bio}</p>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs px-3 border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shrink-0"
          >
            Follow
          </Button>
        </div>
      ))}

    </div>
  )
}