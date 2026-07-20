import { createContext, useContext, useCallback, useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TransitionOverlay } from "@/components/site/TransitionOverlay";
import { useIsMobile } from "@/hooks/use-mobile";

/** Navigates to a real route (e.g. "/catalogue", or "/#collections" for a
 * section anchor), playing the curtain transition on desktop. Also accepts
 * the legacy single-page anchor keys ("#collections", "#order", ...) and
 * resolves them to their new route. */
export type NavigateFn = (target: string) => void;

const PageTransitionContext = createContext<NavigateFn>(() => {});

export function usePageTransition() {
  return useContext(PageTransitionContext);
}

type Phase = "idle" | "entering" | "exiting";

// Legacy anchor keys that still resolve to a scroll target on whichever page
// is currently mounted — Footer renders globally in the Layout on every route.
const SAME_PAGE_ANCHORS = new Set(["#top", "#connect"]);

// Legacy single-page anchor keys, resolved to their real route (± section
// hash) on the split site.
const ROUTE_MAP: Record<string, string> = {
  "#collections": "/#collections",
  "#craft": "/craft",
  "#order": "/contact",
};

function scrollToHash(hash: string) {
  if (!hash || hash === "#top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  const el = document.querySelector(hash);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const routerNavigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [phase, setPhase] = useState<Phase>("idle");
  const pendingTarget = useRef<string>("");

  const navigate = useCallback<NavigateFn>((target) => {
    if (SAME_PAGE_ANCHORS.has(target)) {
      scrollToHash(target);
      return;
    }

    const resolved = ROUTE_MAP[target] ?? target;
    const hashIndex = resolved.indexOf("#");
    const path = hashIndex === -1 ? resolved : resolved.slice(0, hashIndex);
    const hash = hashIndex === -1 ? "" : resolved.slice(hashIndex);

    if (path === location.pathname) {
      scrollToHash(hash);
      return;
    }

    if (isMobile || phase !== "idle") {
      routerNavigate(resolved);
      return;
    }

    pendingTarget.current = resolved;
    setPhase("entering");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, phase, location.pathname]);

  const handleEnterComplete = useCallback(() => {
    routerNavigate(pendingTarget.current);
    setPhase("exiting");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleExitComplete = useCallback(() => {
    setPhase("idle");
  }, []);

  // Any route change (link click, back/forward, curtain nav) lands at the
  // top of the new page, or scrolls to its section hash if one is present.
  useEffect(() => {
    scrollToHash(location.hash);
  }, [location.pathname, location.hash]);

  return (
    <PageTransitionContext.Provider value={navigate}>
      <TransitionOverlay phase={phase} onEnterComplete={handleEnterComplete} onExitComplete={handleExitComplete} />
      {children}
    </PageTransitionContext.Provider>
  );
}
