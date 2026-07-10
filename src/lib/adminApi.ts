import { supabase } from "./supabase";
import type {
  CatalogueItem, Testimonial, FaqItem, Stat, Collection,
  HowItWorksStep, SustainabilityCard, MarqueeTag, InstagramImage,
  EnquirySubmission, FactoryVisitRequest,
} from "./siteData";

/* ─────────── IMAGE UPLOAD ─────────── */
export async function uploadImage(
  file: File,
  bucket: "product-images" | "site-images" = "product-images"
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(data.path);
  return publicUrl;
}

/* ─────────── CATALOGUE ─────────── */
export async function getCatalogueItems(category?: string, includeInactive = false) {
  let q = supabase.from("catalogue_items").select("*").order("position");
  if (category) q = q.eq("category", category);
  if (!includeInactive) q = q.eq("active", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as CatalogueItem[];
}

export async function createCatalogueItem(item: Omit<CatalogueItem, "id" | "created_at">) {
  const { data, error } = await supabase.from("catalogue_items").insert(item).select().single();
  if (error) throw error;
  return data as CatalogueItem;
}

export async function updateCatalogueItem(id: string, updates: Partial<CatalogueItem>) {
  const { data, error } = await supabase.from("catalogue_items").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data as CatalogueItem;
}

export async function deleteCatalogueItem(id: string) {
  const { error } = await supabase.from("catalogue_items").delete().eq("id", id);
  if (error) throw error;
}

/* ─────────── TESTIMONIALS ─────────── */
export async function getTestimonials(includeInactive = false) {
  let q = supabase.from("testimonials").select("*").order("position");
  if (!includeInactive) q = q.eq("active", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Testimonial[];
}

export async function createTestimonial(item: Omit<Testimonial, "id" | "created_at">) {
  const { data, error } = await supabase.from("testimonials").insert(item).select().single();
  if (error) throw error;
  return data as Testimonial;
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>) {
  const { data, error } = await supabase.from("testimonials").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data as Testimonial;
}

export async function deleteTestimonial(id: string) {
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw error;
}

/* ─────────── FAQ ─────────── */
export async function getFaqItems(includeInactive = false) {
  let q = supabase.from("faq_items").select("*").order("position");
  if (!includeInactive) q = q.eq("active", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as FaqItem[];
}

export async function createFaqItem(item: Omit<FaqItem, "id" | "created_at">) {
  const { data, error } = await supabase.from("faq_items").insert(item).select().single();
  if (error) throw error;
  return data as FaqItem;
}

export async function updateFaqItem(id: string, updates: Partial<FaqItem>) {
  const { data, error } = await supabase.from("faq_items").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data as FaqItem;
}

export async function deleteFaqItem(id: string) {
  const { error } = await supabase.from("faq_items").delete().eq("id", id);
  if (error) throw error;
}

/* ─────────── STATS ─────────── */
export async function getStats() {
  const { data, error } = await supabase.from("stats").select("*").order("position");
  if (error) throw error;
  return (data ?? []) as Stat[];
}

export async function updateStat(id: string, updates: Partial<Stat>) {
  const { data, error } = await supabase.from("stats").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data as Stat;
}

/* ─────────── SETTINGS ─────────── */
export async function getSettings(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from("site_settings").select("*");
  if (error) throw error;
  const out: Record<string, string> = {};
  (data ?? []).forEach((row: { key: string; value: string }) => { out[row.key] = row.value; });
  return out;
}

export async function updateSetting(key: string, value: string) {
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  if (error) throw error;
}

/* ─────────── COLLECTIONS ─────────── */
export async function getCollections() {
  const { data, error } = await supabase.from("collections").select("*").order("position");
  if (error) throw error;
  return (data ?? []) as Collection[];
}

export async function updateCollection(id: string, updates: Partial<Collection>) {
  const { data, error } = await supabase.from("collections").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data as Collection;
}

/* ─────────── HOW IT WORKS ─────────── */
export async function getHowItWorks() {
  const { data, error } = await supabase.from("how_it_works").select("*").order("step_no");
  if (error) throw error;
  return (data ?? []) as HowItWorksStep[];
}

export async function updateHowItWorksStep(id: string, updates: Partial<HowItWorksStep>) {
  const { data, error } = await supabase.from("how_it_works").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data as HowItWorksStep;
}

/* ─────────── SUSTAINABILITY ─────────── */
export async function getSustainabilityCards() {
  const { data, error } = await supabase.from("sustainability_cards").select("*").order("position");
  if (error) throw error;
  return (data ?? []) as SustainabilityCard[];
}

export async function updateSustainabilityCard(id: string, updates: Partial<SustainabilityCard>) {
  const { data, error } = await supabase.from("sustainability_cards").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data as SustainabilityCard;
}

/* ─────────── MARQUEE ─────────── */
export async function getMarqueeTags() {
  const { data, error } = await supabase.from("marquee_tags").select("*").order("position");
  if (error) throw error;
  return (data ?? []) as MarqueeTag[];
}

export async function createMarqueeTag(text: string, position = 0) {
  const { data, error } = await supabase.from("marquee_tags").insert({ text, position }).select().single();
  if (error) throw error;
  return data as MarqueeTag;
}

export async function deleteMarqueeTag(id: string) {
  const { error } = await supabase.from("marquee_tags").delete().eq("id", id);
  if (error) throw error;
}

/* ─────────── INSTAGRAM ─────────── */
export async function getInstagramImages() {
  const { data, error } = await supabase.from("instagram_images").select("*").order("position");
  if (error) throw error;
  return (data ?? []) as InstagramImage[];
}

export async function updateInstagramImage(id: string, updates: Partial<InstagramImage>) {
  const { data, error } = await supabase.from("instagram_images").update(updates).eq("id", id).select().single();
  if (error) throw error;
  return data as InstagramImage;
}

/* ─────────── SUBMISSIONS ─────────── */
export async function getEnquirySubmissions() {
  const { data, error } = await supabase
    .from("enquiry_submissions").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as EnquirySubmission[];
}

export async function getFactoryVisitRequests() {
  const { data, error } = await supabase
    .from("factory_visit_requests").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as FactoryVisitRequest[];
}

export async function createEnquirySubmission(submission: Omit<EnquirySubmission, "id" | "created_at">) {
  const { error } = await supabase.from("enquiry_submissions").insert(submission);
  if (error) throw error;
}
