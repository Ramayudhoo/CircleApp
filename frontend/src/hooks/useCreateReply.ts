import { useState } from "react";
import { createReply } from "@/services/replyServices";

export const useCreateReply = (threadId: number) => {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setContent("");
    setImageFile(null);
    setImagePreview(null);
  };

  const submitReply = async () => {
    if (!content.trim()) return null;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (imageFile) formData.append("image", imageFile);
      const newReply = await createReply(threadId, formData);
      resetForm();
      return newReply;
    } catch (err) {
      console.error("Error creating reply:", err);
      return null;
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
    handleImageChange,
    resetForm,
    submitReply,
  };
};
