import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ModeToggle } from "@/components/mode-togle";
import { Lock, Mail, Sparkles, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(identifier, password);
      navigate("/home");
    } catch (err) {
      setError("Login gagal, silakan periksa kembali email/username dan password Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 text-foreground relative overflow-hidden flex items-center justify-center px-4 py-12">
      {/* Background glowing shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Theme Toggle Top-Right */}
      <div className="absolute top-6 right-6 z-30">
        <ModeToggle />
      </div>

      <div className="w-full max-w-md p-8 border border-border/30 bg-card/25 backdrop-blur-xl rounded-3xl shadow-2xl shadow-black/10 hover:shadow-black/20 hover:border-primary/20 transition-all duration-300 relative z-10">
        {/* Brand/Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Dev<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Com</span>
          </h1>
          <p className="text-muted-foreground/80 text-sm font-medium">
            Say something. Connect with developers worldwide.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3 animate-shake">
              <p className="text-destructive text-sm text-center font-medium">{error}</p>
            </div>
          )}

          {/* Identifier Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground/90 ml-1">
              Email or Username
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 w-4 h-4" />
              <Input
                type="text"
                placeholder="you@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="pl-11 bg-input/40 border-border text-foreground placeholder:text-muted-foreground/50 rounded-xl h-12 w-full focus-visible:ring-primary focus-visible:border-primary/60 transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-semibold text-muted-foreground/90">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 w-4 h-4" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-11 pr-11 bg-input/40 border-border text-foreground placeholder:text-muted-foreground/50 rounded-xl h-12 w-full focus-visible:ring-primary focus-visible:border-primary/60 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !identifier || !password}
            className="w-full h-12 mt-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-20 disabled:pointer-events-none disabled:shadow-none transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
            ) : (
              <>
                Log in <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border/40" />
          <span className="text-muted-foreground/60 text-xs uppercase font-semibold tracking-wider">or</span>
          <div className="flex-1 h-px bg-border/40" />
        </div>

        {/* Footer Link */}
        <p className="text-center text-sm text-muted-foreground/90 font-medium">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-primary hover:text-primary/80 font-bold transition-colors underline-offset-4 hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
