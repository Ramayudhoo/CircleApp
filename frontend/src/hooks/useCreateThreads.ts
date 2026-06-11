import { useState } from "react";
import { createThread } from "@/services/threadServices";

export const useCreateThread = () => {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (imageFile) formData.append("image", imageFile);
      await createThread(formData);
      setContent("");
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error("Error posting thread:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    content,
    setContent,
    imageFile,
    setImageFile,
    imagePreview,
    setImagePreview,
    loading,
    handlePost,
  };
};
