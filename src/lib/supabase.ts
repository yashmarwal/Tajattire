import { createClient } from "@supabase/supabase-js";

// Fallback to empty strings so createClient never throws when env vars aren't set
// (e.g. Vercel deployment without env vars configured — site shows fallback content)
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || "https://placeholder.supabase.co";
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
