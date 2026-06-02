import { createContext } from "react";

interface User {
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;      
  login: (email: string, password: string) => Promise<boolean>;  // 
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);