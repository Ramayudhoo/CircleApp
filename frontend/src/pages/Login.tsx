import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(identifier, password);
      navigate("/home");
    } catch (err) {
      setError("Login gagal, silahkan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-black tracking-tight">
            Circ<span className="text-green-500">le</span>
          </h1>
          <p className="text-zinc-500 text-sm">Say something.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-3">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <Input
            placeholder="Email / Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 rounded-xl h-12 px-4 focus-visible:ring-green-500"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 rounded-xl h-12 px-4 focus-visible:ring-green-500"
          />

          <button
            type="submit"
            disabled={loading || !identifier || !password}
            className="w-full h-12 rounded-xl bg-white text-black text-sm font-semibold hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-zinc-600 text-xs">or</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-zinc-500">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-white font-semibold hover:text-green-400 transition-colors"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
