"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Layers, Loader2 } from "lucide-react";

type Mode = "sign_in" | "sign_up";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);
    const supabase = createClient();

    if (mode === "sign_in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else {
        router.push("/dashboard");
        router.refresh();
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) setError(error.message);
      else setNotice("Check your inbox to confirm your email, then sign in.");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm animate-rise-in">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="h-9 w-9 rounded-xl bg-accent flex items-center justify-center">
            <Layers size={18} className="text-accent-on" />
          </div>
          <span className="text-lg font-semibold tracking-tight">TrackSubs</span>
        </div>

        <div className="bg-surface-card rounded-card border border-edge-faint shadow-card p-6">
          <h1 className="text-xl font-semibold mb-1">
            {mode === "sign_in" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-content-muted mb-6">
            {mode === "sign_in"
              ? "Sign in to see what's coming due."
              : "Free — track every subscription in one place."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs font-medium text-content-secondary" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-edge bg-surface-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-content-secondary" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete={mode === "sign_in" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-edge bg-surface-input px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-danger bg-danger-soft rounded-lg px-3 py-2">{error}</p>
            )}
            {notice && (
              <p className="text-sm text-success bg-success-soft rounded-lg px-3 py-2">{notice}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-accent text-accent-on font-medium text-sm py-2.5 hover:bg-accent-hover transition-colors disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {mode === "sign_in" ? "Sign in" : "Sign up"}
            </button>
          </form>

          <button
            onClick={() => {
              setMode(mode === "sign_in" ? "sign_up" : "sign_in");
              setError(null);
              setNotice(null);
            }}
            className="mt-4 w-full text-center text-sm text-content-muted hover:text-content"
          >
            {mode === "sign_in" ? "New here? Create an account" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </main>
  );
}
