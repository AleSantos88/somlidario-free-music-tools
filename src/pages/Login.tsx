import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-11 bg-card border-border"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 bg-card border-border"
            />
          </div>
          <Button className="w-full h-11 gradient-amber text-primary-foreground hover:opacity-90">
            Sign In
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
