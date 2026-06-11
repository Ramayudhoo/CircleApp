import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setProfile } from "@/store/profileSlice";
import { updateProfile } from "@/services/userServices";

export const useEditProfile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.profile);

  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio || "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("full_name", name);
      formData.append("username", username);
      formData.append("bio", bio);
      if (avatar) {
        formData.append("image", avatar);
      }

      const updatedData = await updateProfile(formData);

      dispatch(
        setProfile({
          ...profile,
          name: updatedData.full_name || profile.name,
          username: updatedData.username || profile.username,
          bio: updatedData.bio || profile.bio,
          avatar: updatedData.photo_profile || profile.avatar,
        }),
      );

      setAvatarPreview(updatedData.photo_profile);
      return true; // sukses
    } catch (err) {
      console.error("Failed to update profile:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    setName,
    username,
    setUsername,
    bio,
    setBio,
    avatar,
    setAvatar,
    avatarPreview,
    setAvatarPreview,
    loading,
    handleSave,
  };
};
