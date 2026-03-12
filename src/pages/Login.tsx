import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music } from "lucide-react";
import { toast } from "sonner";

const FAKE_EMAIL = "musico@somlidario.com";
const FAKE_PASSWORD = "123456";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (email === FAKE_EMAIL && password === FAKE_PASSWORD) {
        localStorage.setItem("user", JSON.stringify({ email: FAKE_EMAIL, name: "Músico Demo" }));
        toast.success("Login realizado com sucesso!");
        navigate("/dashboard");
      } else {
        toast.error("Email ou senha incorretos. Use: musico@somlidario.com / 123456");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-md gradient-amber flex items-center justify-center">
              <Music className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">Somlidario</span>
          </Link>
          <h1 className="text-xl font-bold text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
        </div>

        <div className="mb-6 p-3 rounded-lg bg-muted border border-border text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">🔑 Credenciais de teste:</p>
          <p>Email: <span className="text-primary font-mono">musico@somlidario.com</span></p>
          <p>Senha: <span className="text-primary font-mono">123456</span></p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="musico@somlidario.com"
              className="h-11 bg-card border-border"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="123456"
              className="h-11 bg-card border-border"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 gradient-amber text-primary-foreground hover:opacity-90"
          >
            {loading ? "Entrando..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
