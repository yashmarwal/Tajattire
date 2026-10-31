import type { QueryClient } from "@tanstack/react-query";

/**
 * Public site settings (hero image, section photos, catalogue PDFs …).
 *
 * Fetched with ONE plain REST request that starts in main.tsx before React or
 * the Supabase SDK load, and cached in localStorage so repeat visits paint the
 * right images on the very first frame — no "default photo, then swap".
 */
export const SETTINGS_KEY = ["settings"] as const;
const CACHE_KEY = "taj:settings:v1";

type Settings = Record<string, string>;

export async function fetchPublicSettings(): Promise<Settings> {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return {};
  const res = await fetch(`${url}/rest/v1/site_settings?select=key,value`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`settings ${res.status}`);
  const rows = (await res.json()) as { key: string; value: string | null }[];
  const out: Settings = {};
  for (const r of rows) if (r.value != null) out[r.key] = r.value;
  return out;
}

export function readCachedSettings(): Settings | undefined {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as Settings) : undefined;
  } catch {
    return undefined;
  }
}

function writeCachedSettings(s: Settings) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(s));
  } catch {
    /* private mode / quota — fine, we just won't have a warm cache */
  }
}

let client: QueryClient | null = null;

/** Seed from cache (marked stale) and start the network request immediately. */
export function primeSettings(qc: QueryClient) {
  client = qc;
  const cached = readCachedSettings();
  if (cached) qc.setQueryData(SETTINGS_KEY, cached, { updatedAt: 0 });
  qc.getQueryCache().subscribe((e) => {
    if (
      e.type === "updated" &&
      e.query.queryKey[0] === SETTINGS_KEY[0] &&
      e.query.state.status === "success"
    ) {
      writeCachedSettings(e.query.state.data as Settings);
    }
  });
  void qc.prefetchQuery({ queryKey: SETTINGS_KEY, queryFn: fetchPublicSettings });
}

/** Called when a settings-driven image fails to load: drop the cache and
 * refetch so a deleted/replaced file heals itself on the next render. */
let healing = false;
export function healDeadImage() {
  if (healing || !client) return;
  healing = true;
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    /* ignore */
  }
  void client.invalidateQueries({ queryKey: SETTINGS_KEY }).finally(() => {
    setTimeout(() => (healing = false), 10_000);
  });
}
