import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/adminApi";

const MIN5 = 5 * 60 * 1000;
const MIN30 = 30 * 60 * 1000;

/* ── Public-facing hooks (active-only) ── */
export const useCatalogueItems = (category?: string) =>
  useQuery({ queryKey: ["catalogue", category], queryFn: () => api.getCatalogueItems(category), staleTime: MIN5 });

export const useTestimonials = () =>
  useQuery({ queryKey: ["testimonials"], queryFn: () => api.getTestimonials(), staleTime: MIN5 });

export const useFaqItems = () =>
  useQuery({ queryKey: ["faq"], queryFn: () => api.getFaqItems(), staleTime: MIN5 });

export const useStats = () =>
  useQuery({ queryKey: ["stats"], queryFn: () => api.getStats(), staleTime: MIN5 });

export const useMarqueeTags = () =>
  useQuery({ queryKey: ["marquee"], queryFn: () => api.getMarqueeTags(), staleTime: MIN30 });

export const useSettings = () =>
  useQuery({ queryKey: ["settings"], queryFn: () => api.getSettings(), staleTime: MIN5 });

export const useInstagramImages = () =>
  useQuery({ queryKey: ["instagram"], queryFn: () => api.getInstagramImages(), staleTime: MIN30 });

export const useSustainabilityCards = () =>
  useQuery({ queryKey: ["sustainability"], queryFn: () => api.getSustainabilityCards(), staleTime: MIN30 });

export const useCollections = () =>
  useQuery({ queryKey: ["collections"], queryFn: () => api.getCollections(), staleTime: MIN30 });

export const useHowItWorks = () =>
  useQuery({ queryKey: ["how_it_works"], queryFn: () => api.getHowItWorks(), staleTime: MIN30 });

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
