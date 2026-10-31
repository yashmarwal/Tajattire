import { useMemo } from "react";
import terms from "@/data/terms.json";
import { useSettings, useCatalogueItems } from "@/hooks/useSiteData";
import type { CatalogueItem } from "./siteData";

export type Badge = "Best seller" | "New";
export const BADGES: Badge[] = ["Best seller", "New"];

export interface Category {
  name: string;
  slug: string;
  moq: string;
  leadTime: string;
  blurb?: string;
}

export interface ProductMeta {
  badge?: Badge | "";
  home?: boolean;
}

export interface Product {
  id: string;
  name: string;
  label: string;
  category: string;
  image: string;
  price: string;
  position: number;
  badge?: Badge;
  home: boolean;
  moq: string;
  leadTime: string;
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-");

const STATIC_CATEGORIES: Category[] = terms.categories.map((c) => ({
  name: c.name,
  slug: c.slug,
  moq: c.moq,
  leadTime: c.leadTime,
  blurb: c.blurb,
}));

function parseJson<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Categories = the built-in three merged with any the owner added in the
 * admin (stored in site_settings.categories_json). Adding one there makes it
 * appear in filters, cards, forms and the minimum-order table everywhere. */
export function mergeCategories(raw?: string): Category[] {
  const extra = parseJson<Partial<Category>[]>(raw, []);
  const out = [...STATIC_CATEGORIES];
  for (const e of extra) {
    if (!e?.name) continue;
    const name = e.name.trim();
    const existing = out.findIndex((c) => c.name.toLowerCase() === name.toLowerCase());
    const merged: Category = {
      name,
      slug: slugify(name),
      moq: e.moq?.trim() || terms.defaultCategory.moq,
      leadTime: e.leadTime?.trim() || terms.defaultCategory.leadTime,
      blurb: e.blurb,
    };
    if (existing >= 0) out[existing] = { ...out[existing], ...merged, slug: out[existing].slug };
    else out.push(merged);
  }
  return out;
}

export const parseProductMeta = (raw?: string) => parseJson<Record<string, ProductMeta>>(raw, {});

export function useCategories(): Category[] {
  const { data: settings } = useSettings();
  return useMemo(() => mergeCategories(settings?.categories_json), [settings?.categories_json]);
}

export function termsFor(category: string, categories: Category[]) {
  const c = categories.find((x) => x.name.toLowerCase() === category.toLowerCase());
  return {
    moq: c?.moq ?? terms.defaultCategory.moq,
    leadTime: c?.leadTime ?? terms.defaultCategory.leadTime,
  };
}

export function toProduct(
  it: CatalogueItem,
  meta: Record<string, ProductMeta>,
  categories: Category[],
): Product {
  const m = meta[it.id] ?? {};
  const t = termsFor(it.category, categories);
  return {
    id: it.id,
    name: it.name,
    label: it.label || it.name,
    category: it.category,
    image: it.image_url,
    price: it.price,
    position: it.position,
    badge: m.badge || undefined,
    home: !!m.home,
    moq: t.moq,
    leadTime: t.leadTime,
  };
}

/** All active products (one request, cached), with labels/homepage flags and
 * per-category terms attached. Static terms keep working if the DB is down. */
export function useProducts() {
  const categories = useCategories();
  const { data: settings } = useSettings();
  const q = useCatalogueItems();
  const meta = useMemo(
    () => parseProductMeta(settings?.product_meta_json),
    [settings?.product_meta_json],
  );
  const products = useMemo(
    () =>
      (q.data ?? [])
        .map((it) => toProduct(it, meta, categories))
        .sort((a, b) => a.position - b.position),
    [q.data, meta, categories],
  );
  return { products, categories, isLoading: q.isLoading, isError: q.isError };
}
