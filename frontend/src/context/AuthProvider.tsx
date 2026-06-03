import { useState, ReactNode } from "react";
import { useDispatch } from "react-redux";
import AuthContext, { AuthUser } from "./AuthContext";
import { setUser, clearUser } from "../store/authSlice";
import api from "../lib/axios";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const dispatch = useDispatch();

  const register = async (
    username: string,
    name: string,
    email: string,
    password: string,
  ) => {
    const res = await api.post("/auth/register", {
      username,
      name,
      email,
      password,
    });
    const data: AuthUser = res.data.data;
    setUserState(data);
    dispatch(setUser(data));
  };

  const login = async (identifier: string, password: string) => {
    const res = await api.post("/auth/login", { identifier, password });
    const data: AuthUser = res.data.data;
    setUserState(data);
    dispatch(setUser(data));
  };

  const logout = () => {
    setUserState(null);
    dispatch(clearUser());
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
