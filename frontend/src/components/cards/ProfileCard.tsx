import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { setProfile } from "@/store/profileSlice";
import api from "@/lib/axios";
import FollowListModal from "@/components/FollowListModal";
import { Camera, User, AtSign, FileText, Check, X } from "lucide-react";

interface ProfileCardProps {
  onEditProfile?: () => void;
}

export default function ProfileCard({ onEditProfile: _onEditProfile }: ProfileCardProps) {
  const profile = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch();

  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio || "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [followModalTab, setFollowModalTab] = useState<"followers" | "following">("followers");

  // Sync when profile changes in Redux
  useEffect(() => {
    setName(profile.name || "");
    setUsername(profile.username || "");
    setBio(profile.bio || "");
    setAvatarPreview(profile.avatar || "");
  }, [profile]);

  // Reset form when dialog opens
  useEffect(() => {
    if (editOpen) {
      setName(profile.name || "");
      setUsername(profile.username || "");
      setBio(profile.bio || "");
      setAvatar(null);
      setAvatarPreview(profile.avatar || "");
    }
  }, [editOpen, profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("full_name", name);
      formData.append("username", username);
      formData.append("bio", bio);
      if (avatar) formData.append("image", avatar);

      const res = await api.patch("/user/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = res.data.data;
      dispatch(
        setProfile({
          ...profile,
          name: data.full_name ?? profile.name,
          username: data.username ?? profile.username,
          bio: data.bio ?? profile.bio,
          avatar: data.photo_profile ?? profile.avatar,
        })
      );
      setEditOpen(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-border/30 bg-card/45 backdrop-blur-md shadow-lg shadow-black/5 hover:border-[var(--color-sakura)]/20 transition-all duration-300">
      {/* ── Cover ── */}
      <div className="relative h-24 w-full bg-gradient-to-tr from-primary/50 via-purple-500/30 to-secondary/50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-40" />
      </div>

      <div className="px-5 pb-5">
        {/* ── Avatar + Edit button ── */}
        <div className="flex items-end justify-between -mt-9 mb-4">
          {/* Avatar */}
          <div className="w-[72px] h-[72px] rounded-full border-[3px] border-background bg-gradient-to-br from-[var(--color-sakura)] to-[var(--color-neon-blue)] flex items-center justify-center text-white text-xl font-bold overflow-hidden z-10 relative shadow-md ring-2 ring-[var(--color-sakura)]/20">
            {profile.avatar ? (
              <img src={profile.avatar} className="w-full h-full object-cover" alt="avatar" />
            ) : (
              (profile.name || "?").charAt(0).toUpperCase()
            )}
          </div>

          {/* Edit dialog */}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger className="rounded-full border border-border/60 text-foreground hover:bg-[var(--color-sakura)] hover:text-background hover:border-[var(--color-sakura)] text-xs font-bold px-4 py-1.5 transition-all duration-200 shadow-sm cursor-pointer">
              Edit profile
            </DialogTrigger>

            <DialogContent className="sm:max-w-md border border-border/40 bg-card/95 backdrop-blur-xl p-0 overflow-hidden gap-0">
              {/* Modal header */}
              <div className="px-6 pt-6 pb-4 border-b border-border/30">
                <DialogHeader>
                  <DialogTitle className="text-base font-bold tracking-tight">
                    Edit Profile
                  </DialogTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Update your public information
                  </p>
                </DialogHeader>
              </div>

              <div className="px-6 py-5 space-y-5">
                {/* ── Avatar picker ── */}
                <div className="flex flex-col items-center gap-2">
                  <label className="cursor-pointer group relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-border/50 group-hover:ring-[var(--color-sakura)]/60 transition-all duration-300 shadow-md">
                      {avatarPreview ? (
                        <img src={avatarPreview} className="w-full h-full object-cover" alt="preview" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[var(--color-sakura)] to-[var(--color-neon-blue)] flex items-center justify-center text-white text-2xl font-bold">
                          {name.charAt(0).toUpperCase() || <User size={28} />}
                        </div>
                      )}
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 rounded-full bg-black/40 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Camera size={18} className="text-white" />
                      <span className="text-white text-[10px] font-semibold">Change</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setAvatar(file);
                          setAvatarPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>
                  <p className="text-[11px] text-muted-foreground">Click avatar to change photo</p>
                </div>

                {/* ── Name ── */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    <User size={11} />
                    Name
                  </label>
                  <div className="relative group">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your display name"
                      className="
                        w-full rounded-xl border border-border/60 bg-muted/40
                        px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50
                        outline-none focus:border-[var(--color-sakura)]/70 focus:bg-muted/60
                        transition-all duration-200
                      "
                    />
                    <span className="absolute inset-0 rounded-xl ring-0 focus-within:ring-2 focus-within:ring-[var(--color-sakura)]/20 pointer-events-none transition-all duration-200" />
                  </div>
                </div>

                {/* ── Username ── */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    <AtSign size={11} />
                    Username
                  </label>
                  <div className="relative group flex items-center">
                    <span className="absolute left-3.5 text-muted-foreground/60 text-sm select-none">@</span>
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="username"
                      className="
                        w-full rounded-xl border border-border/60 bg-muted/40
                        pl-8 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50
                        outline-none focus:border-[var(--color-sakura)]/70 focus:bg-muted/60
                        transition-all duration-200
                      "
                    />
                    <span className="absolute inset-0 rounded-xl ring-0 focus-within:ring-2 focus-within:ring-[var(--color-sakura)]/20 pointer-events-none transition-all duration-200" />
                  </div>
                </div>

                {/* ── Bio ── */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      <FileText size={11} />
                      Bio
                    </label>
                    <span className={`text-[10px] tabular-nums transition-colors ${bio.length > 130 ? "text-destructive" : "text-muted-foreground/50"}`}>
                      {bio.length}/150
                    </span>
                  </div>
                  <div className="relative group">
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value.slice(0, 150))}
                      rows={3}
                      placeholder="Write a short bio…"
                      className="
                        w-full rounded-xl border border-border/60 bg-muted/40
                        px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50
                        resize-none outline-none focus:border-[var(--color-sakura)]/70 focus:bg-muted/60
                        transition-all duration-200 leading-relaxed
                      "
                    />
                    <span className="absolute inset-0 rounded-xl ring-0 focus-within:ring-2 focus-within:ring-[var(--color-sakura)]/20 pointer-events-none transition-all duration-200" />
                  </div>
                </div>
              </div>

              {/* ── Footer actions ── */}
              <div className="px-6 py-4 border-t border-border/30 flex justify-end gap-2.5 bg-muted/10">
                <Button
                  variant="ghost"
                  onClick={() => setEditOpen(false)}
                  className="rounded-full h-9 px-5 text-xs font-semibold text-muted-foreground hover:text-foreground gap-1.5"
                >
                  <X size={13} />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="
                    rounded-full h-9 px-6 text-xs font-bold gap-1.5
                    bg-[var(--color-sakura)] hover:bg-[var(--color-sakura)]/85
                    text-background shadow-md shadow-[var(--color-sakura)]/30
                    transition-all duration-200 disabled:opacity-60
                  "
                >
                  <Check size={13} />
                  {saving ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* ── Info ── */}
        <div className="space-y-0.5 mb-4">
          <p className="font-bold text-foreground tracking-tight">
            {profile.name || "No Name"}
          </p>
          <p className="text-xs text-muted-foreground">
            @{profile.username || "unknown"}
          </p>
          {profile.bio && (
            <p className="text-sm text-foreground/80 pt-1.5 leading-relaxed">
              {profile.bio}
            </p>
          )}
        </div>

        {/* ── Stats ── */}
        <div className="flex gap-4 text-sm">
          <button
            onClick={() => { setFollowModalTab("following"); setFollowModalOpen(true); }}
            className="group hover:text-[var(--color-sakura)] transition-colors duration-150"
          >
            <span className="font-bold text-foreground group-hover:text-[var(--color-sakura)] transition-colors">
              {profile.following_count ?? 0}
            </span>
            <span className="text-muted-foreground ml-1 text-xs">Following</span>
          </button>
          <button
            onClick={() => { setFollowModalTab("followers"); setFollowModalOpen(true); }}
            className="group hover:text-[var(--color-sakura)] transition-colors duration-150"
          >
            <span className="font-bold text-foreground group-hover:text-[var(--color-sakura)] transition-colors">
              {profile.follower_count ?? 0}
            </span>
            <span className="text-muted-foreground ml-1 text-xs">Followers</span>
          </button>
        </div>
      </div>

      <FollowListModal
        open={followModalOpen}
        onOpenChange={setFollowModalOpen}
        initialTab={followModalTab}
      />
    </div>
  );
}
