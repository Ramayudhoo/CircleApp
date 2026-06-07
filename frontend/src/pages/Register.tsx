import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(username, name, email, password);
      navigate("/login");
    } catch (err) {
      setError("Registrasi gagal, silahkan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-1">
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Dev<span className="text-primary">Com</span>
          </h1>
          <p className="text-muted-foreground text-sm">Join the conversation.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
              <p className="text-destructive text-sm text-center">{error}</p>
            </div>
          )}

          <Input placeholder="Username" value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-12 px-4 focus-visible:ring-primary"
          />
          <Input placeholder="Full Name" value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-12 px-4 focus-visible:ring-primary"
          />
          <Input placeholder="Email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-12 px-4 focus-visible:ring-primary"
          />
          <Input type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-input border-border text-foreground placeholder:text-muted-foreground rounded-xl h-12 px-4 focus-visible:ring-primary"
          />

          <button
            type="submit"
            disabled={loading || !username || !name || !email || !password}
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-muted-foreground text-xs">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="text-foreground font-semibold hover:text-primary transition-colors">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}