import { useQuery } from "@tanstack/react-query";
// The admin API (and with it the Supabase SDK) is only loaded on demand,
// so public pages never download it.
const api = () => import("@/lib/adminApi");
import { SETTINGS_KEY, fetchPublicSettings } from "@/lib/siteSettings";
import * as pub from "@/lib/publicApi";

const SEC30 = 30 * 1000; // 30 seconds — quick enough to reflect admin changes
const MIN5 = 5 * 60 * 1000;
const OPTS = { staleTime: SEC30, refetchOnWindowFocus: true } as const;

/* ── Public-facing hooks (active-only) ── */
export const useCatalogueItems = () =>
  useQuery({ queryKey: ["catalogue", "all"], queryFn: pub.fetchCatalogue, ...OPTS });

export const useTestimonials = () =>
  useQuery({ queryKey: ["testimonials"], queryFn: pub.fetchTestimonials, ...OPTS });

export const useFaqItems = () => useQuery({ queryKey: ["faq"], queryFn: pub.fetchFaq, ...OPTS });

export const useStats = () => useQuery({ queryKey: ["stats"], queryFn: pub.fetchStats, ...OPTS });

export const useMarqueeTags = () =>
  useQuery({
    queryKey: ["marquee"],
    queryFn: () => api().then((a) => a.getMarqueeTags()),
    staleTime: MIN5,
  });

// One shared request (started in main.tsx) — see lib/siteSettings.ts
export const useSettings = () =>
  useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: fetchPublicSettings,
    staleTime: SEC30,
    refetchOnWindowFocus: true,
  });

export const useSustainabilityCards = () =>
  useQuery({ queryKey: ["sustainability"], queryFn: pub.fetchSustainability, ...OPTS });

export const useCollections = () =>
  useQuery({
    queryKey: ["collections"],
    queryFn: () => api().then((a) => a.getCollections()),
    ...OPTS,
  });

export const useHowItWorks = () =>
  useQuery({
    queryKey: ["how_it_works"],
    queryFn: () => api().then((a) => a.getHowItWorks()),
    ...OPTS,
  });

/* ── Admin hooks (include inactive) ── */
export const useAdminCatalogue = (category?: string) =>
  useQuery({
    queryKey: ["admin-catalogue", category],
    queryFn: () => api().then((a) => a.getCatalogueItems(category, true)),
  });

export const useAdminTestimonials = () =>
  useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: () => api().then((a) => a.getTestimonials(true)),
  });

export const useAdminFaq = () =>
  useQuery({ queryKey: ["admin-faq"], queryFn: () => api().then((a) => a.getFaqItems(true)) });

export const useEnquirySubmissions = () =>
  useQuery({
    queryKey: ["enquiries"],
    queryFn: () => api().then((a) => a.getEnquirySubmissions()),
  });

export const useFactoryVisitRequests = () =>
  useQuery({
    queryKey: ["factory-visits"],
    queryFn: () => api().then((a) => a.getFactoryVisitRequests()),
  });
