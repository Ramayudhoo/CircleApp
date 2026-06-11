import { useState, ReactNode, useEffect } from "react";
import { useDispatch } from "react-redux";
import AuthContext, { AuthUser } from "./AuthContext";
import { setUser, clearUser } from "../store/authSlice";
import { setProfile } from "../store/profileSlice";
import api from "../lib/axios";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<AuthUser | null>(() => {
    const stored = sessionStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const dispatch = useDispatch();

  // Helper: fetch profile dan dispatch ke Redux
  const fetchAndSetProfile = async () => {
    try {
      const res = await api.get("/user/profile");
      const data = res.data.data;
      dispatch(
        setProfile({
          id: data.id,
          username: data.username,
          name: data.name,
          email: data.email,
          bio: data.bio || "",
          avatar: data.avatar || "",
          follower_count: data.follower_count || 0,
          following_count: data.following_count || 0,
        }),
      );
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      throw err;
    }
  };

  // Saat mount: restore user dari sessionStorage + fetch profile
  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (stored) {
      const parsedUser: AuthUser = JSON.parse(stored);
      dispatch(setUser(parsedUser));
      fetchAndSetProfile(); // ← fetch profile saat refresh
    }
  }, [dispatch]);

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
    sessionStorage.setItem("user", JSON.stringify(data));
    sessionStorage.setItem("token", data.token);

    // Fetch profile setelah register
    await fetchAndSetProfile();
  };

  const login = async (identifier: string, password: string) => {
    const res = await api.post("/auth/login", { identifier, password });
    const data: AuthUser = res.data.data;
    setUserState(data);
    dispatch(setUser(data));
    sessionStorage.setItem("user", JSON.stringify(data));
    sessionStorage.setItem("token", data.token);

    // ✅ FETCH PROFILE SETELAH LOGIN
    await fetchAndSetProfile();
  };

  const logout = () => {
    setUserState(null);
    dispatch(clearUser());
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
