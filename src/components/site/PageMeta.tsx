import { useEffect } from "react";

interface PageMetaProps {
  title: string;
  description: string;
  path: string; // e.g. "/catalogue" or "/" for home
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

function upsertCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/** Updates document title + meta description + canonical + OG/Twitter tags
 * for the current route. Renders nothing — pure side effect. Since this is a
 * client-rendered SPA, the very first static HTML byte still shows the
 * homepage's tags until this runs, but Google renders JS before indexing. */
export function PageMeta({ title, description, path }: PageMetaProps) {
  useEffect(() => {
    document.title = title;
    const canonicalUrl = `https://tajattire.in${path}`;

    upsertMeta("name", "description", description);
    upsertCanonical(canonicalUrl);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
  }, [title, description, path]);

  return null;
}
