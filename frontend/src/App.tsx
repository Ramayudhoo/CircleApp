import Router from "./routes";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
// import { useDispatch } from "react-redux";
// import { useEffect } from "react";
// import api from "./lib/axios";
// import { setProfile } from "./store/profileSlice";

function App() {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   const token = sessionStorage.getItem("token");

  //   if (!token) return;

  //   const fetchProfile = async () => {
  //     try {
  //       const res = await api.get("/user/profile");
  //       dispatch(setProfile(res.data.data));
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   fetchProfile();
  // }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router />
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}

export default App;
