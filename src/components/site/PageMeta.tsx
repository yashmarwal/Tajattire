import { useEffect } from "react";
import { canonicalFor, findRoute, routeSchema, OG_IMAGE } from "@/lib/seo";

interface PageMetaProps {
  /** Route path, e.g. "/catalogue". Title/description come from src/data/routes.json. */
  path: string;
  /** Optional overrides (e.g. the 404 page). */
  title?: string;
  description?: string;
  noindex?: boolean;
}

function upsertMeta(attrName: "name" | "property", attrValue: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string | null) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!href) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/** Keeps <head> in sync on client-side navigation. The first load already
 * has the right tags baked in by the prerender step, so this only matters
 * after the visitor moves between pages. */
export function PageMeta({ path, title, description, noindex }: PageMetaProps) {
  useEffect(() => {
    const route = findRoute(path);
    const t = title ?? route?.title ?? "TajAttire";
    const d = description ?? route?.description ?? "";
    const url = route ? canonicalFor(route.path) : null;

    document.title = t;
    upsertMeta("name", "description", d);
    upsertMeta(
      "name",
      "robots",
      noindex ? "noindex, follow" : "index, follow, max-image-preview:large",
    );
    setCanonical(noindex ? null : url);
    upsertMeta("property", "og:title", t);
    upsertMeta("property", "og:description", d);
    if (url) upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", OG_IMAGE);
    upsertMeta("name", "twitter:title", t);
    upsertMeta("name", "twitter:description", d);

    // Swap the page-specific JSON-LD (the site-wide graph stays put)
    document.head.querySelectorAll("script[data-route-schema]").forEach((n) => n.remove());
    if (route && !noindex) {
      for (const block of routeSchema(route)) {
        const s = document.createElement("script");
        s.type = "application/ld+json";
        s.dataset.routeSchema = "";
        s.textContent = JSON.stringify(block);
        document.head.appendChild(s);
      }
    }
  }, [path, title, description, noindex]);

  return null;
}
