import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react"; // ← tambah useEffect
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
  const [saving, setSaving] = useState(false); // ← loading state

  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [followModalTab, setFollowModalTab] = useState<
    "followers" | "following"
  >("followers");

  // ✅ Sync form fields when Redux profile changes
  useEffect(() => {
    setName(profile.name || "");
    setUsername(profile.username || "");
    setBio(profile.bio || "");
    setAvatarPreview(profile.avatar || "");
  }, [profile]);

  // ✅ Sync form fields when dialog opens (reset ke data terbaru)
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
      if (avatar) {
        formData.append("image", avatar);
      }

      const res = await api.patch("/user/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = res.data.data;

      // ✅ Gunakan field yang benar dari response backend
      dispatch(
        setProfile({
          ...profile,
          name: data.full_name ?? profile.name,
          username: data.username ?? profile.username,
          bio: data.bio ?? profile.bio,
          avatar: data.photo_profile ?? profile.avatar,
        }),
      );

      setEditOpen(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-border/30 bg-card/45 backdrop-blur-md shadow-lg shadow-black/5 hover:border-primary/20 transition-all duration-300">
      {/* Cover */}
      <div className="relative h-24 w-full bg-gradient-to-tr from-primary/50 via-purple-500/30 to-secondary/50 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-40" />
      </div>

      {/* Avatar + Edit Button */}
      <div className="px-5 pb-5">
        <div className="flex items-end justify-between -mt-9 mb-4">
          <div className="w-18 h-18 rounded-full border-4 border-background bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground text-xl font-bold overflow-hidden z-10 relative shadow-md">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                className="w-full h-full object-cover"
                alt="avatar"
              />
            ) : (
              (profile.name || "?").charAt(0).toUpperCase()
            )}
          </div>

          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger className="rounded-full border border-border/60 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary text-xs font-bold px-4.5 py-1.5 transition-all duration-200 shadow-xs cursor-pointer">
              Edit profile
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-24 h-24 rounded-full overflow-hidden border">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        className="w-full h-full object-cover"
                        alt="preview"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                        {name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <label className="cursor-pointer text-sm text-primary hover:underline">
                    Change Photo
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
                </div>

                {/* Name */}
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Username */}
                <div>
                  <label className="text-sm font-medium">Username</label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="text-sm font-medium">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm resize-none outline-none focus:border-primary"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setEditOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Info */}
        <div className="space-y-1 mb-3">
          <p className="font-bold text-foreground">
            {profile.name || "No Name"}
          </p>
          <p className="text-sm text-muted-foreground">
            @{profile.username || "unknown"}
          </p>
          {profile.bio && (
            <p className="text-sm text-foreground pt-1 leading-relaxed">
              {profile.bio}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-sm mb-4">
          <button
            onClick={() => {
              setFollowModalTab("following");
              setFollowModalOpen(true);
            }}
            className="hover:underline"
          >
            <span className="font-semibold text-foreground">
              {profile.following_count ?? 0}
            </span>
            <span className="text-muted-foreground ml-1">Following</span>
          </button>
          <button
            onClick={() => {
              setFollowModalTab("followers");
              setFollowModalOpen(true);
            }}
            className="hover:underline"
          >
            <span className="font-semibold text-foreground">
              {profile.follower_count ?? 0}
            </span>
            <span className="text-muted-foreground ml-1">Followers</span>
          </button>
        </div>

        <FollowListModal
          open={followModalOpen}
          onOpenChange={setFollowModalOpen}
          initialTab={followModalTab}
        />
      </div>
    </div>
  );
}
