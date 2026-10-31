/**
 * Per-route SEO, shared by the browser (PageMeta) and the post-build
 * prerender script (scripts/prerender.ts), so crawlers that don't run
 * JavaScript get exactly the same title, canonical, Open Graph and
 * structured data as the live app.
 *
 * Only relative imports with explicit extensions here — Node imports this
 * file directly at build time.
 */
import routesJson from "../data/routes.json" with { type: "json" };
import faqJson from "../data/faq.json" with { type: "json" };
import termsJson from "../data/terms.json" with { type: "json" };
import {
  SITE_URL,
  BRAND,
  EMAIL,
  PHONE_E164,
  INSTAGRAM_URL,
  FOUNDED_YEAR,
  GSTIN,
} from "./contact.ts";

export interface RouteMeta {
  path: string;
  name: string;
  title: string;
  description: string;
  parent?: string;
  category?: string;
  source?: string[];
}

export const ROUTES = routesJson as RouteMeta[];
export const DEFAULT_FAQ = faqJson as { q: string; a: string }[];
export const OG_IMAGE = `${SITE_URL}/images/og.jpg`;

export const canonicalFor = (path: string) =>
  path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;

export function findRoute(path: string): RouteMeta | undefined {
  const clean = path.replace(/\/+$/, "") || "/";
  return ROUTES.find((r) => r.path === clean);
}

const ORG_ID = `${SITE_URL}/#organization`;

/** Site-wide identity graph, emitted on every page. */
export function globalSchema(): object[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": ORG_ID,
      name: BRAND,
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/logo.png`,
      image: OG_IMAGE,
      description:
        "Wholesale manufacturer of kurtis, gowns and contemporary tops based in Jaipur, India, established 2004.",
      foundingDate: String(FOUNDED_YEAR),
      taxID: GSTIN,
      email: EMAIL,
      telephone: PHONE_E164,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Jaipur",
        addressRegion: "Rajasthan",
        addressCountry: "IN",
      },
      sameAs: [INSTAGRAM_URL],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: EMAIL,
        telephone: PHONE_E164,
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: BRAND,
      inLanguage: "en-IN",
      publisher: { "@id": ORG_ID },
    },
  ];
}

function breadcrumb(route: RouteMeta): object | null {
  if (route.path === "/") return null;
  const trail: { name: string; path: string }[] = [{ name: "Home", path: "/" }];
  if (route.parent) {
    const parent = findRoute(route.parent);
    if (parent) trail.push({ name: parent.name, path: parent.path });
  }
  trail.push({ name: route.name, path: route.path });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: canonicalFor(t.path),
    })),
  };
}

/** Structured data specific to one route. `faq` lets the build pass the live
 * FAQ (from the database) so the schema always matches what is on screen. */
export function routeSchema(
  route: RouteMeta,
  faq: { q: string; a: string }[] = DEFAULT_FAQ,
): object[] {
  const out: object[] = [];
  const url = canonicalFor(route.path);
  const crumbs = breadcrumb(route);
  if (crumbs) out.push(crumbs);

  switch (route.path) {
    case "/":
      out.push({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#localbusiness`,
        name: BRAND,
        image: OG_IMAGE,
        url: `${SITE_URL}/`,
        telephone: PHONE_E164,
        email: EMAIL,
        priceRange: "₹₹",
        parentOrganization: { "@id": ORG_ID },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Jaipur",
          addressRegion: "Rajasthan",
          addressCountry: "IN",
        },
        areaServed: { "@type": "Country", name: "India" },
      });
      break;
    case "/catalogue":
      out.push({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: route.title,
        url,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: termsJson.categories.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: `Wholesale ${c.name}`,
            url: canonicalFor(`/catalogue/${c.slug}`),
          })),
        },
      });
      break;
    case "/custom-orders":
      out.push({
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Private-label garment manufacturing",
        serviceType: "Custom and private-label manufacturing of kurtis, gowns and tops",
        provider: { "@id": ORG_ID },
        areaServed: { "@type": "Country", name: "India" },
        url,
        description: `Custom prints, fabric selection, embroidery and branded packaging. Minimum ${termsJson.custom.moq} per design, ${termsJson.custom.leadTime} production.`,
      });
      break;
    case "/faq":
      out.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      });
      break;
    case "/contact":
      out.push({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: route.title,
        url,
        about: { "@id": ORG_ID },
      });
      break;
  }

  if (route.category) {
    out.push({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: route.title,
      url,
      about: `Wholesale ${route.category}`,
      isPartOf: { "@id": `${SITE_URL}/#website` },
    });
  }
  return out;
}
