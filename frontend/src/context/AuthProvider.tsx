import { useState } from "react";
import { AuthContext } from "./AuthContext";
import axiosInstance from "../lib/axios";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser({ name: "Admin", email });
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
}