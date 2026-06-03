import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
      <Button
        onClick={handleLogout}
        className="bg-green-600 hover:bg-green-700"
      >
        Logout
      </Button>
    </div>
  );
}
