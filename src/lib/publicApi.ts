/**
 * Read-only data for the public site over plain REST — no Supabase SDK in the
 * visitor's download (the SDK is only loaded by the admin panel).
 */
import type { CatalogueItem, Testimonial, FaqItem, Stat, SustainabilityCard } from "./siteData";

const URL_ = import.meta.env.VITE_SUPABASE_URL;
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const headers = (): Record<string, string> => ({
  apikey: KEY ?? "",
  Authorization: `Bearer ${KEY ?? ""}`,
});

async function rest<T>(table: string, query: string): Promise<T[]> {
  if (!URL_ || !KEY) return []; // not configured → static fallbacks render
  const res = await fetch(`${URL_}/rest/v1/${table}?${query}`, { headers: headers() });
  if (!res.ok) throw new Error(`${table}: ${res.status}`);
  return (await res.json()) as T[];
}

export const fetchCatalogue = () =>
  rest<CatalogueItem>("catalogue_items", "select=*&active=eq.true&order=position.asc");
export const fetchTestimonials = () =>
  rest<Testimonial>("testimonials", "select=*&active=eq.true&order=position.asc");
export const fetchFaq = () =>
  rest<FaqItem>("faq_items", "select=*&active=eq.true&order=position.asc");
export const fetchStats = () => rest<Stat>("stats", "select=*&order=position.asc");
export const fetchSustainability = () =>
  rest<SustainabilityCard>("sustainability_cards", "select=*&order=position.asc");

/** Insert one enquiry row (visitors may insert, never read). */
export async function insertEnquiry(row: Record<string, string | null>) {
  if (!URL_ || !KEY) return;
  await fetch(`${URL_}/rest/v1/enquiry_submissions`, {
    method: "POST",
    headers: { ...headers(), "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(row),
    keepalive: true,
  });
}
