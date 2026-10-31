/**
 * Post-build step: clone dist/index.html once per route with that route's
 * own <title>, description, canonical, Open Graph/Twitter tags and JSON-LD,
 * so crawlers and link previews that don't run JavaScript see the right
 * page. Also writes 404.html, admin.html and sitemap.xml, and fails the
 * build if vercel.json or the CSP would leave a route broken.
 *
 * Run with: node scripts/prerender.ts   (Node ≥ 22.18 strips TS types)
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";
import {
  ROUTES,
  DEFAULT_FAQ,
  OG_IMAGE,
  canonicalFor,
  globalSchema,
  routeSchema,
  type RouteMeta,
} from "../src/lib/seo.ts";
import { SITE_URL } from "../src/lib/contact.ts";

const DIST = "dist";
const template = readFileSync(join(DIST, "index.html"), "utf8");
const errors: string[] = [];

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const jsonLd = (obj: object, routeScoped: boolean) =>
  `<script type="application/ld+json"${routeScoped ? " data-route-schema" : ""}>${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

/* ── Live FAQ from the database, so FAQPage schema matches the screen ── */
async function loadFaq(): Promise<{ q: string; a: string }[]> {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key || process.env.PRERENDER_OFFLINE) return DEFAULT_FAQ;
  try {
    const res = await fetch(
      `${url}/rest/v1/faq_items?select=question,answer&active=eq.true&order=position`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(6000),
      },
    );
    if (!res.ok) return DEFAULT_FAQ;
    const rows = (await res.json()) as { question: string; answer: string }[];
    return rows.length ? rows.map((r) => ({ q: r.question, a: r.answer })) : DEFAULT_FAQ;
  } catch {
    return DEFAULT_FAQ;
  }
}

function headFor(opts: {
  title: string;
  description: string;
  canonical: string | null;
  robots: string;
}) {
  const { title, description, canonical, robots } = opts;
  return [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<meta name="robots" content="${robots}" />`,
    canonical ? `<link rel="canonical" href="${canonical}" />` : "",
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    canonical ? `<meta property="og:url" content="${canonical}" />` : "",
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
  ]
    .filter(Boolean)
    .join("\n    ");
}

/** Visually hidden text summary for non-JS crawlers; React replaces it on mount. */
function bodyFor(route: RouteMeta | null, heading: string, description: string) {
  const hidden =
    "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0";
  const links = ROUTES.map((r) => `<li><a href="${r.path}">${esc(r.name)}</a></li>`).join("");
  return `<div style="${hidden}"><h1>${esc(heading)}</h1><p>${esc(description)}</p><nav aria-label="Site"><ul>${links}</ul></nav></div>`;
}

function render(head: string, body: string, routeLd: object[]) {
  const global = globalSchema()
    .map((o) => jsonLd(o, false))
    .join("\n    ");
  const route = routeLd.map((o) => jsonLd(o, true)).join("\n    ");
  const out = template
    .replace(/<!--route-head-->[\s\S]*?<!--\/route-head-->/, head)
    .replace("<!--global-schema-->", [global, route].filter(Boolean).join("\n    "))
    .replace("<!--route-body-->", body);
  if (out.includes("<!--route-head-->") || out.includes("<!--global-schema-->")) {
    errors.push("index.html markers not found — template changed?");
  }
  return out;
}

const outFile = (path: string) => (path === "/" ? "index.html" : `${path.slice(1)}.html`);

function write(rel: string, html: string) {
  const full = join(DIST, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html);
}

function lastmod(files: string[] = []): string {
  try {
    const iso = execFileSync("git", ["log", "-1", "--format=%cs", "--", ...files], {
      encoding: "utf8",
    }).trim();
    if (iso) return iso;
  } catch {
    /* not a git checkout (e.g. some CI) */
  }
  return new Date().toISOString().slice(0, 10);
}

/* ── Safety checks against vercel.json ── */
const vercel = JSON.parse(readFileSync("vercel.json", "utf8")) as {
  rewrites: { source: string; destination: string }[];
  headers: { source: string; headers: { key: string; value: string }[] }[];
};
for (const r of ROUTES) {
  if (r.path === "/") continue;
  const rw = vercel.rewrites.find((x) => x.source === r.path);
  if (!rw) errors.push(`vercel.json has no rewrite for ${r.path}`);
  else if (rw.destination !== `/${outFile(r.path)}`)
    errors.push(`rewrite for ${r.path} points to ${rw.destination}`);
}
const csp =
  vercel.headers.flatMap((h) => h.headers).find((h) => h.key === "Content-Security-Policy")
    ?.value ?? "";
const sbUrl = process.env.VITE_SUPABASE_URL;
if (sbUrl) {
  const host = new URL(sbUrl).origin;
  if (!csp.includes(host))
    errors.push(
      `CSP connect-src does not allow ${host} — the live site would be blocked from its database`,
    );
}

/* ── Generate ── */
const faq = await loadFaq();

for (const route of ROUTES) {
  const canonical = canonicalFor(route.path);
  const head = headFor({
    title: route.title,
    description: route.description,
    canonical,
    robots: "index, follow, max-image-preview:large",
  });
  write(
    outFile(route.path),
    render(head, bodyFor(route, route.title, route.description), routeSchema(route, faq)),
  );
}

write(
  "404.html",
  render(
    headFor({
      title: "Page not found | TajAttire",
      description:
        "This page doesn't exist. Browse TajAttire's wholesale kurtis, gowns and tops instead.",
      canonical: null,
      robots: "noindex, follow",
    }),
    bodyFor(null, "Page not found", "This page doesn't exist."),
    [],
  ),
);

write(
  "admin.html",
  render(
    headFor({
      title: "Admin | TajAttire",
      description: "Admin panel",
      canonical: null,
      robots: "noindex, nofollow",
    }),
    "",
    [],
  ),
);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map(
  (r) => `  <url>
    <loc>${canonicalFor(r.path)}</loc>
    <lastmod>${lastmod(r.source)}</lastmod>
  </url>`,
).join("\n")}
</urlset>
`;
writeFileSync(join(DIST, "sitemap.xml"), sitemap);

/* ── Post-checks ── */
for (const route of ROUTES) {
  const html = readFileSync(join(DIST, outFile(route.path)), "utf8");
  const canon = [...html.matchAll(/rel="canonical" href="([^"]+)"/g)].map((m) => m[1]);
  if (canon.length !== 1 || canon[0] !== canonicalFor(route.path))
    errors.push(
      `${route.path}: expected one canonical ${canonicalFor(route.path)}, got ${canon.join(", ")}`,
    );
}
if (!SITE_URL.startsWith("https://")) errors.push("SITE_URL must be https");

if (errors.length) {
  console.error("\n✖ prerender failed:\n  - " + errors.join("\n  - "));
  process.exit(1);
}
console.log(
  `✓ prerendered ${ROUTES.length} routes + 404 + admin, sitemap with ${ROUTES.length} URLs (FAQ source: ${faq === DEFAULT_FAQ ? "defaults" : "database"})`,
);
