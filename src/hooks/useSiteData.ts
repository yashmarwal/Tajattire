import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/adminApi";

const SEC30 = 30 * 1000;   // 30 seconds — quick enough to reflect admin changes
const MIN5  = 5 * 60 * 1000;
const OPTS  = { staleTime: SEC30, refetchOnWindowFocus: true } as const;

/* ── Public-facing hooks (active-only) ── */
export const useCatalogueItems = (category?: string) =>
  useQuery({ queryKey: ["catalogue", category], queryFn: () => api.getCatalogueItems(category), ...OPTS });

export const useTestimonials = () =>
  useQuery({ queryKey: ["testimonials"], queryFn: () => api.getTestimonials(), ...OPTS });

export const useFaqItems = () =>
  useQuery({ queryKey: ["faq"], queryFn: () => api.getFaqItems(), ...OPTS });

export const useStats = () =>
  useQuery({ queryKey: ["stats"], queryFn: () => api.getStats(), ...OPTS });

export const useMarqueeTags = () =>
  useQuery({ queryKey: ["marquee"], queryFn: () => api.getMarqueeTags(), staleTime: MIN5 });

// staleTime:0 so site_settings (images, logo etc.) always re-fetch after admin saves
export const useSettings = () =>
  useQuery({ queryKey: ["settings"], queryFn: () => api.getSettings(), staleTime: 0, refetchOnWindowFocus: true });

export const useInstagramImages = () =>
  useQuery({ queryKey: ["instagram"], queryFn: () => api.getInstagramImages(), ...OPTS });

export const useSustainabilityCards = () =>
  useQuery({ queryKey: ["sustainability"], queryFn: () => api.getSustainabilityCards(), ...OPTS });

export const useCollections = () =>
  useQuery({ queryKey: ["collections"], queryFn: () => api.getCollections(), ...OPTS });

export const useHowItWorks = () =>
  useQuery({ queryKey: ["how_it_works"], queryFn: () => api.getHowItWorks(), ...OPTS });

/* ── Admin hooks (include inactive) ── */
export const useAdminCatalogue = (category?: string) =>
  useQuery({ queryKey: ["admin-catalogue", category], queryFn: () => api.getCatalogueItems(category, true) });

export const useAdminTestimonials = () =>
  useQuery({ queryKey: ["admin-testimonials"], queryFn: () => api.getTestimonials(true) });

export const useAdminFaq = () =>
  useQuery({ queryKey: ["admin-faq"], queryFn: () => api.getFaqItems(true) });

export const useEnquirySubmissions = () =>
  useQuery({ queryKey: ["enquiries"], queryFn: () => api.getEnquirySubmissions() });

export const useFactoryVisitRequests = () =>
  useQuery({ queryKey: ["factory-visits"], queryFn: () => api.getFactoryVisitRequests() });
