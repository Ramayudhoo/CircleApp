import { Button } from "@/components/ui/button"

interface ProfileCardProps {
  name: string
  username: string
  bio?: string
  avatar?: string
  cover?: string
  followers: number
  following: number
  onEditProfile?: () => void
}

export default function ProfileCard({
  name,
  username,
  bio,
  avatar,
  cover,
  followers,
  following,
  onEditProfile,
}: ProfileCardProps) {
  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-card">

      {/* Cover */}
      <div className="h-24 w-full bg-gradient-to-br from-primary/40 via-secondary/30 to-primary/20 relative">
        {cover && (
          <img src={cover} className="w-full h-full object-cover" alt="cover" />
        )}
      </div>

      {/* Avatar + Edit Button */}
      <div className="px-4 pb-4">
        <div className="flex items-end justify-between -mt-6 mb-3">
          <div className="w-16 h-16 rounded-full border-4 border-card bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold overflow-hidden">
            {avatar ? (
              <img src={avatar} className="w-full h-full object-cover" alt="avatar" />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onEditProfile}
            className="rounded-full border-border text-foreground hover:bg-accent text-xs px-4"
          >
            Edit profile
          </Button>
        </div>

        {/* Info */}
        <div className="space-y-1 mb-3">
          <p className="font-bold text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">@{username}</p>
          {bio && (
            <p className="text-sm text-foreground pt-1 leading-relaxed">{bio}</p>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-sm">
          <button className="hover:underline">
            <span className="font-semibold text-foreground">{following}</span>
            <span className="text-muted-foreground ml-1">Following</span>
          </button>
          <button className="hover:underline">
            <span className="font-semibold text-foreground">{followers}</span>
            <span className="text-muted-foreground ml-1">Followers</span>
          </button>
        </div>
      </div>

    </div>
  )
}