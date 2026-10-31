import { createContext, useContext, useCallback, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { useNavigate, useLocation, useNavigationType } from "react-router-dom";
import { pageFor } from "./routes";
import { scrollToTopInstant, scrollToElement } from "./lenis-store";

/** Navigate to a route ("/catalogue", "/#collections"), cross-fading pages
 * with the View Transitions API where supported. */
export type NavigateFn = (target: string, opts?: { soft?: boolean }) => void;

const PageTransitionContext = createContext<NavigateFn>(() => {});

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

// Old single-page anchor keys still used in a few links
const ROUTE_MAP: Record<string, string> = {
  "#collections": "/#collections",
  "#craft": "/craft",
  "#order": "/contact",
  "#connect": "/contact",
};

function scrollToHash(hash: string, smooth: boolean) {
  if (!hash || hash === "#top") {
    if (smooth) window.scrollTo({ top: 0, behavior: "smooth" });
    else scrollToTopInstant();
    return;
  }
  const el = document.querySelector(hash);
  if (el) scrollToElement(el as HTMLElement, smooth);
}

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const routerNavigate = useNavigate();
  const location = useLocation();
  const navType = useNavigationType();
  const busy = useRef(false);
  // Set while our own transition handles scrolling, so the effect below doesn't fight it
  const handledByTransition = useRef(false);

  const navigate = useCallback<NavigateFn>(
    async (target, opts) => {
      const resolved = ROUTE_MAP[target] ?? target;
      const hashIndex = resolved.indexOf("#");
      const path =
        (hashIndex === -1 ? resolved : resolved.slice(0, hashIndex)) || location.pathname;
      const hash = hashIndex === -1 ? "" : resolved.slice(hashIndex);

      if (path === location.pathname) {
        if (hash) window.history.replaceState(window.history.state, "", path + hash);
        scrollToHash(hash, true);
        return;
      }
      if (busy.current) return;

      // Same page, different view (e.g. catalogue category): swap in place and
      // let the page manage its own scroll position.
      if (opts?.soft) {
        handledByTransition.current = true;
        routerNavigate(path + hash);
        return;
      }
      busy.current = true;

      // Load the destination page first so the transition never shows a blank frame
      try {
        await Promise.race([pageFor(path).preload(), new Promise((r) => setTimeout(r, 2500))]);
      } catch {
        /* network hiccup — navigate anyway; Suspense covers it */
      }

      const commit = () => {
        handledByTransition.current = true;
        flushSync(() => routerNavigate(path + hash));
        if (!hash) scrollToTopInstant();
      };

      const doc = document as Document & {
        startViewTransition?: (cb: () => void) => {
          finished: Promise<void>;
          updateCallbackDone: Promise<void>;
        };
      };
      if (doc.startViewTransition && !prefersReducedMotion()) {
        const vt = doc.startViewTransition(commit);
        vt.updateCallbackDone.then(() => hash && scrollToHash(hash, false)).catch(() => {});
        vt.finished.finally(() => (busy.current = false));
      } else {
        commit();
        if (hash) requestAnimationFrame(() => scrollToHash(hash, false));
        busy.current = false;
      }
    },
    [location.pathname, routerNavigate],
  );

  // Back/forward and plain link changes: land at the top of the new page
  // (or at its #section). Our own transitions already did this.
  // Only a real change of path/hash counts — closing an overlay (which pops
  // its own history marker on the same URL) must never jump the page.
  const lastLoc = useRef(`${location.pathname}${location.hash}`);
  useEffect(() => {
    const key = `${location.pathname}${location.hash}`;
    if (key === lastLoc.current) return;
    lastLoc.current = key;
    if (handledByTransition.current) {
      handledByTransition.current = false;
      return;
    }
    if (location.hash) requestAnimationFrame(() => scrollToHash(location.hash, false));
    else if (navType !== "REPLACE") scrollToTopInstant();
  }, [location.pathname, location.hash, navType]);

  return (
    <PageTransitionContext.Provider value={navigate}>{children}</PageTransitionContext.Provider>
  );
}
