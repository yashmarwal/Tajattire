import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Detect if running with placeholder/missing Supabase config
    const url = import.meta.env.VITE_SUPABASE_URL as string;
    if (!url || url.includes("placeholder")) {
      setError("Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Vercel environment variables, then redeploy.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message?.includes("Failed to fetch") || error.message?.includes("NetworkError")) {
        setError("Cannot reach Supabase. Check that VITE_SUPABASE_URL is correctly set in Vercel → Project Settings → Environment Variables.");
      } else {
        setError(error.message);
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1A5C38] opacity-[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-[380px]">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 border border-[#C9A84C]/40 flex items-center justify-center">
              <span className="text-[#C9A84C] text-lg">✦</span>
            </div>
          </div>
          <h1 className="font-display text-[#F8F6F1] text-3xl font-light mb-1">TajAttire</h1>
          <p className="text-[#C9A84C] text-[10px] uppercase tracking-[0.35em]">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-[#141414] border border-[rgba(201,168,76,0.15)] p-8">
          {/* Gold top accent */}
          <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent -mt-px" />

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] mb-2">Email</label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@tajattire.com"
                className="w-full bg-[#0A0A0A] border border-[rgba(201,168,76,0.2)] text-[#F8F6F1] px-4 py-3 text-sm placeholder:text-[rgba(248,246,241,0.2)] focus:outline-none focus:border-[#C9A84C] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-[#C9A84C] mb-2">Password</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full bg-[#0A0A0A] border border-[rgba(201,168,76,0.2)] text-[#F8F6F1] px-4 py-3 text-sm placeholder:text-[rgba(248,246,241,0.2)] focus:outline-none focus:border-[#C9A84C] transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400 text-xs border border-red-900 bg-red-900/10 px-3 py-2">
                {error}
              </p>
            )}

            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="w-full bg-[#C9A84C] text-[#0A0A0A] py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] disabled:opacity-50 hover:bg-[#D4B55A] transition-colors"
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>
        </div>

        <p className="text-center text-[rgba(248,246,241,0.2)] text-[10px] mt-6 tracking-wider">
          TAJATTIRE CMS · ADMIN ACCESS ONLY
        </p>
      </div>
    </div>
  );
}
