import { createContext } from "react";

export interface AuthUser {
  user_id: number;
  username: string;
  name: string;
  email: string;
  photo_profile?: string;
  token: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (identifier: string, password: string) => Promise<void>;
  register: (
    username: string,
    name: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default AuthContext;
