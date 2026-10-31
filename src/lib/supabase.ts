import { createClient } from "@supabase/supabase-js";

// Only the admin panel loads this module. Placeholder values keep
// createClient from throwing when env vars are missing (the admin then shows
// a clear error instead of a blank screen).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Admin sign-in lasts for this browser tab only — closing the tab signs out.
    storage: typeof window !== "undefined" ? window.sessionStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
