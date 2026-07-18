/* ─────────── TypeScript Types for all Supabase tables ─────────── */

export interface CatalogueItem {
  id: string;
  name: string;
  category: "Kurtis" | "Gowns" | "Tops";
  image_url: string;
  label: string;
  price: string;
  position: number;
  active: boolean;
  created_at?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  stars: number;
  position: number;
  active: boolean;
  created_at?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  position: number;
  active: boolean;
  created_at?: string;
}

export interface Stat {
  id: string;
  stat_key: string;
  value: number;
  label: string;
  prefix: string;
  suffix: string;
  position: number;
}

export interface Collection {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  position: number;
}

export interface HowItWorksStep {
  id: string;
  step_no: number;
  title: string;
  description: string;
}

export interface SustainabilityCard {
  id: string;
  number: string;
  value: string;
  label: string;
  detail: string;
  position: number;
}

export interface MarqueeTag {
  id: string;
  text: string;
  position: number;
}

export interface InstagramImage {
  id: string;
  image_url: string;
  alt: string;
  position: number;
}

export interface EnquirySubmission {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  message?: string;
  product?: string;
  created_at: string;
}

export interface FactoryVisitRequest {
  id: string;
  name?: string;
  email?: string;
  business?: string;
  visit_date?: string;
  created_at: string;
}

export type SiteSettings = Record<string, string>;

/** A single photo or video in the "Inside Our Workspace" gallery — stored as JSON in site_settings.workspace_media_json */
export interface WorkspaceMediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  label: string;
}

export function parseWorkspaceMedia(json?: string): WorkspaceMediaItem[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
