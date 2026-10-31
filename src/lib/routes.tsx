import { use, type ComponentType } from "react";

type Mod = { default: ComponentType };

/**
 * Like React.lazy, but exposes `preload()` and renders synchronously once the
 * chunk is in memory. The page transition awaits `preload()` first, so the
 * cross-fade never captures an empty Suspense frame (the source of dark /
 * white flashes between pages).
 */
function lazyRoute(factory: () => Promise<Mod>) {
  let mod: Mod | undefined;
  let promise: Promise<Mod> | undefined;
  const preload = () =>
    (promise ??= factory().then(
      (m) => (mod = m),
      (err) => {
        promise = undefined; // allow a retry after a failed chunk download
        throw err;
      },
    ));
  function RouteComponent() {
    const m = mod ?? use(preload());
    const C = m.default;
    return <C />;
  }
  return { Component: RouteComponent, preload };
}

export const PAGES = {
  home: lazyRoute(() => import("@/pages/Home")),
  catalogue: lazyRoute(() => import("@/pages/Catalogue")),
  customOrders: lazyRoute(() => import("@/pages/CustomOrders")),
  craft: lazyRoute(() => import("@/pages/Craft")),
  reviews: lazyRoute(() => import("@/pages/Reviews")),
  faq: lazyRoute(() => import("@/pages/Faq")),
  contact: lazyRoute(() => import("@/pages/Contact")),
  privacy: lazyRoute(() => import("@/pages/Privacy")),
  terms: lazyRoute(() => import("@/pages/Terms")),
  notFound: lazyRoute(() => import("@/pages/NotFound")),
};

/** Which page module serves a pathname (used to preload before navigating). */
export function pageFor(pathname: string) {
  const p = pathname.replace(/\/+$/, "") || "/";
  if (p === "/") return PAGES.home;
  if (p === "/catalogue" || p.startsWith("/catalogue/")) return PAGES.catalogue;
  if (p === "/custom-orders") return PAGES.customOrders;
  if (p === "/craft") return PAGES.craft;
  if (p === "/reviews") return PAGES.reviews;
  if (p === "/faq") return PAGES.faq;
  if (p === "/contact") return PAGES.contact;
  if (p === "/privacy") return PAGES.privacy;
  if (p === "/terms") return PAGES.terms;
  return PAGES.notFound;
}

/** Warm every page chunk when the browser is idle, so later navigations are instant. */
export function prefetchAllPagesWhenIdle() {
  const run = () => Object.values(PAGES).forEach((p) => void p.preload().catch(() => {}));
  if ("requestIdleCallback" in window) window.requestIdleCallback(run, { timeout: 4000 });
  else setTimeout(run, 2500);
}
