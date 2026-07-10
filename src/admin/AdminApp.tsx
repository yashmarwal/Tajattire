import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { AdminLogin } from "./AdminLogin";
import { AdminLayout } from "./AdminLayout";
import type { Session } from "@supabase/supabase-js";

export function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#C9A84C] text-[10px] uppercase tracking-[0.3em] animate-pulse">Loading…</div>
      </div>
    );
  }

  if (!session) return <AdminLogin />;
  return <AdminLayout session={session} />;
}
