import { createClient } from "@supabase/supabase-js";

/**
 * Checks — WITHOUT changing any data — whether a stranger (no login) can
 * write to the database.
 *
 * How: as an anonymous visitor we try to insert a row whose primary key is
 * NULL. Postgres evaluates row-level-security before table constraints, so:
 *   • 42501 (permission / RLS denied)  → locked, good
 *   • 23502 (NOT NULL violation)       → the write got past security → OPEN
 * Either way the insert fails, so nothing is ever written.
 */
export type ProbeStatus = "locked" | "open" | "unknown";
export interface ProbeResult {
  table: string;
  label: string;
  status: ProbeStatus;
  detail: string;
}

const TARGETS: { table: string; label: string; row: Record<string, null> }[] = [
  { table: "catalogue_items", label: "Products", row: { id: null } },
  { table: "site_settings", label: "Site settings & photos", row: { key: null, value: null } },
  { table: "testimonials", label: "Testimonials", row: { id: null } },
  { table: "faq_items", label: "FAQ", row: { id: null } },
  { table: "stats", label: "Stats", row: { id: null } },
  { table: "instagram_images", label: "Instagram grid", row: { id: null } },
];

export async function runSecurityProbe(): Promise<ProbeResult[]> {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return TARGETS.map((t) => ({
      table: t.table,
      label: t.label,
      status: "unknown",
      detail: "Supabase keys are not configured in this build.",
    }));
  }
  // A separate client with no stored session = exactly what a stranger has.
  const anon = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: "taj-probe",
    },
  });

  return Promise.all(
    TARGETS.map(async (t): Promise<ProbeResult> => {
      try {
        const { error } = await anon.from(t.table).insert(t.row);
        if (!error) {
          return {
            table: t.table,
            label: t.label,
            status: "open",
            detail: "Anonymous insert was accepted.",
          };
        }
        const code = error.code ?? "";
        if (code === "42501" || /row-level security|permission denied/i.test(error.message)) {
          return {
            table: t.table,
            label: t.label,
            status: "locked",
            detail: "Strangers cannot change this.",
          };
        }
        if (code === "23502" || code === "23505" || code === "22P02") {
          return {
            table: t.table,
            label: t.label,
            status: "open",
            detail: "A stranger's write reached the table (it was only stopped by a data check).",
          };
        }
        return { table: t.table, label: t.label, status: "unknown", detail: error.message };
      } catch (e) {
        return {
          table: t.table,
          label: t.label,
          status: "unknown",
          detail: e instanceof Error ? e.message : "Network error",
        };
      }
    }),
  );
}
