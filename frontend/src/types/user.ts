export interface SearchUser {
  id: number;
  username: string;
  name: string;
  avatar: string;
  is_following: boolean | null; // null = diri sendiri
}
