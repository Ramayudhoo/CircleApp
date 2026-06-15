export interface ThreadData {
  id: number;
  content: string;
  image?: string;
  created_at: string;
  user: {
    id: number;
    username: string;
    name: string;
    profile_picture?: string;
  };
  likes: number;
  replies: number;
  isLiked: boolean;
}
