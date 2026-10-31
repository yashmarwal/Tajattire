import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { usePageTransition } from "@/lib/PageTransitionContext";
import { isScrollLocked } from "@/lib/scrollLock";
import { waLink, telLink, PHONE_DISPLAY } from "@/lib/contact";
import { IconGrid, IconEnquire, IconWhatsApp, IconPhone } from "./icons";

export const OPEN_CHAT_EVENT = "tajattire:open-ai-chat";
export const CHAT_STATE_EVENT = "tajattire:chat-state";

/**
 * The 5 things a visitor most wants, always one tap away.
 * Hides while the page is scrolling and slides back once scrolling stops.
 * Publishes its height as --dock-h so the footer reserves exactly that space.
 */
export function Dock() {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [pressed, setPressed] = useState<string | null>(null);
  const navigate = usePageTransition();
  const { pathname } = useLocation();

  // Reserve space for the dock at the end of the page
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => {
      // offsetHeight/computed bottom ignore the hide transform, so this is stable
      const bottom = parseFloat(getComputedStyle(el).bottom) || 0;
      document.documentElement.style.setProperty(
        "--dock-h",
        `${Math.ceil(el.offsetHeight + bottom)}px`,
      );
    };
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    window.addEventListener("resize", set);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", set);
      document.documentElement.style.setProperty("--dock-h", "0px");
    };
  }, []);

  // Hide while scrolling, return when idle
  useEffect(() => {
    let idle: ReturnType<typeof setTimeout> | undefined;
    let raf = 0;
    let lastY = window.scrollY;
    const onScroll = () => {
      if (raf || isScrollLocked()) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        if (Math.abs(y - lastY) > 4) setHidden(true);
        lastY = y;
        clearTimeout(idle);
        idle = setTimeout(() => setHidden(false), 650);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(idle);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const onState = (e: Event) => setChatOpen(Boolean((e as CustomEvent<boolean>).detail));
    window.addEventListener(CHAT_STATE_EVENT, onState);
    return () => window.removeEventListener(CHAT_STATE_EVENT, onState);
  }, []);

  const press = (id: string) => ({
    onPointerDown: () => setPressed(id),
    onPointerUp: () => setPressed(null),
    onPointerLeave: () => setPressed(null),
    onPointerCancel: () => setPressed(null),
    "data-pressed": pressed === id ? "" : undefined,
  });

  const go = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    navigate(href);
  };

  const onCatalogue = pathname.startsWith("/catalogue");
  const onContact = pathname === "/contact";

  return (
    <div
      ref={ref}
      style={{ viewTransitionName: "site-dock", bottom: "max(12px, env(safe-area-inset-bottom))" }}
      className={`dock fixed z-[70] left-1/2 lg:left-auto lg:right-6 ${hidden && !chatOpen ? "dock-hidden" : ""}`}
    >
      <nav aria-label="Quick actions" className="dock-bar">
        <a
          href="/catalogue"
          onClick={go("/catalogue")}
          className={`dock-item ${onCatalogue ? "is-active" : ""}`}
          {...press("browse")}
        >
          <IconGrid size={19} />
          <span>Products</span>
        </a>
        <a
          href={waLink("Hi TajAttire! I'd like to know more about your wholesale range.")}
          target="_blank"
          rel="noopener noreferrer"
          className="dock-item"
          {...press("wa")}
        >
          <IconWhatsApp size={19} className="text-[#25D366]" />
          <span>Chat</span>
        </a>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event(OPEN_CHAT_EVENT))}
          className={`dock-item dock-orb-item ${chatOpen ? "is-active" : ""}`}
          aria-label="Ask a question — instant answers"
          aria-expanded={chatOpen}
          aria-controls="ai-chat-panel"
          {...press("ask")}
        >
          <span className="dock-orb" aria-hidden="true">
            <span className="dock-orb-core" />
          </span>
          <span>Ask</span>
        </button>
        <a
          href={telLink}
          className="dock-item"
          aria-label={`Call ${PHONE_DISPLAY}`}
          {...press("call")}
        >
          <IconPhone size={19} />
          <span>Call</span>
        </a>
        <a
          href="/contact"
          onClick={go("/contact")}
          className={`dock-item dock-primary ${onContact ? "is-active" : ""}`}
          {...press("enquire")}
        >
          <IconEnquire size={19} />
          <span>Enquire</span>
        </a>
      </nav>
    </div>
  );
}
