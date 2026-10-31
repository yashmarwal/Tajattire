import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { usePageTransition } from "@/lib/PageTransitionContext";
import { useImg } from "@/hooks/useImg";
import { useBackToClose } from "@/hooks/useBackToClose";
import { lockScroll } from "@/lib/lenis-store";
import { waLink, telLink, mailLink, PHONE_DISPLAY, EMAIL } from "@/lib/contact";
import { IconWhatsApp, IconPhone, IconMail, IconClose, IconArrow } from "./icons";

const DESKTOP_LINKS = [
  { label: "Catalogue", href: "/catalogue" },
  { label: "Custom Orders", href: "/custom-orders" },
  { label: "Our Craft", href: "/craft" },
  { label: "Reviews", href: "/reviews" },
  { label: "FAQ", href: "/faq" },
];

const MOBILE_LINKS = [
  { label: "Home", href: "/" },
  ...DESKTOP_LINKS,
  { label: "Contact", href: "/contact" },
];

const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

type Box = { x: number; w: number };

/** Brand mark: the real logo asset at a fixed box so the header never grows. */
function Brand({
  light,
  onClick,
}: {
  light: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) {
  const IMG = useImg();
  return (
    <a
      href="/"
      onClick={onClick}
      className="flex items-center gap-2.5 shrink-0"
      aria-label="TajAttire — home"
    >
      <span className="block w-[35px] h-10" aria-hidden="true">
        {IMG.logo && (
          <img
            src={IMG.logo}
            alt=""
            width={35}
            height={40}
            decoding="async"
            className="w-full h-full object-contain"
            style={{ filter: light ? "brightness(0.82) saturate(1.15)" : "none" }}
          />
        )}
      </span>
      <span
        className={`font-display text-[1.6rem] leading-none tracking-wide font-semibold transition-colors duration-500 ${light ? "text-charcoal" : "text-cloud"}`}
      >
        TajAttire
      </span>
    </a>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [light, setLight] = useState(false);
  const [open, setOpen] = useState(false);
  const instantClose = useRef(false);
  const navigate = usePageTransition();
  const { pathname } = useLocation();

  /* ── capsule geometry (measured, so it works with any label length) ── */
  const capsuleRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [hover, setHover] = useState<number | null>(null);
  const [placed, setPlaced] = useState(false); // first placement happens without animation

  const measure = useCallback(() => {
    const cap = capsuleRef.current;
    if (!cap) return;
    const base = cap.getBoundingClientRect().left;
    setBoxes(
      linkRefs.current.map((el) => {
        if (!el) return { x: 0, w: 0 };
        const r = el.getBoundingClientRect();
        return { x: r.left - base, w: r.width };
      }),
    );
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (capsuleRef.current) ro.observe(capsuleRef.current);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => {
    if (boxes.length && !placed) requestAnimationFrame(() => setPlaced(true));
  }, [boxes, placed]);

  const activeIndex = DESKTOP_LINKS.findIndex((l) => isActive(pathname, l.href));
  const active = activeIndex >= 0 ? boxes[activeIndex] : undefined;
  const hovered = hover !== null ? boxes[hover] : undefined;

  /* ── tone: scrolled state + whether a light or dark section sits under the bar ── */
  useEffect(() => {
    let raf = 0;
    const probe = () => {
      raf = 0;
      setScrolled(window.scrollY > 40);
      const y = 40;
      // Innermost (last in document order) section under the bar wins
      const sections = document.querySelectorAll<HTMLElement>("[data-bg]");
      let hit: HTMLElement | null = null;
      for (const el of sections) {
        const r = el.getBoundingClientRect();
        if (r.top <= y && r.bottom > y) hit = el;
      }
      if (hit) setLight(hit.dataset.bg === "light");
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(probe);
    };
    probe();
    const t = setTimeout(probe, 120); // page content mounts a frame after navigation
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  /* ── mobile menu ── */
  useBackToClose(open, () => setOpen(false));
  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      document.documentElement.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);
  // Close instantly (no exit animation) when the route changes, inside the same
  // commit as the page swap — so the cross-fade never shows a half-closed menu.
  useLayoutEffect(() => {
    if (open) {
      instantClose.current = true;
      setOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const go = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    e.preventDefault();
    if (isActive(pathname, href) && href === pathname) {
      setOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    navigate(href);
  };

  const onDark = !light;
  const barTone = scrolled
    ? light
      ? "bg-[#F8F6F1]/92 border-b border-charcoal/10 shadow-[0_8px_24px_-18px_rgba(0,0,0,0.35)]"
      : "bg-[#0A0A0A]/88 border-b border-[var(--gold)]/15"
    : "bg-transparent border-b border-transparent";
  const capsuleTone = onDark
    ? "bg-white/[0.06] border-white/10"
    : "bg-charcoal/[0.04] border-charcoal/10";
  const linkTone = onDark ? "text-cloud/75" : "text-charcoal/75";
  const linkActiveTone = onDark ? "text-cloud" : "text-charcoal";

  return (
    <>
      <header
        style={{ viewTransitionName: "site-nav" }}
        className={`fixed top-0 inset-x-0 z-50 transition-[background-color,border-color,box-shadow] duration-500 ${barTone}`}
      >
        <div className="max-w-[1500px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between gap-6">
          <Brand light={light} onClick={go("/")} />

          {/* Desktop capsule */}
          <nav aria-label="Main" className="hidden lg:block">
            <div
              ref={capsuleRef}
              onMouseLeave={() => setHover(null)}
              className={`relative flex items-center gap-1 rounded-full border px-1.5 py-1.5 transition-colors duration-500 ${capsuleTone}`}
            >
              {/* gliding hover highlight: caps + scaled middle, transform-only */}
              <div
                aria-hidden="true"
                className="absolute top-1.5 bottom-1.5 left-0 pointer-events-none"
                style={{
                  transform: `translateX(${hovered?.x ?? active?.x ?? 0}px)`,
                  opacity: hovered ? 1 : 0,
                  transition: placed ? "transform .45s var(--ease-out), opacity .25s" : "none",
                }}
              >
                <GlidePill
                  width={hovered?.w ?? active?.w ?? 0}
                  animate={placed}
                  tone={onDark ? "rgba(248,246,241,0.1)" : "rgba(46,46,46,0.07)"}
                />
              </div>
              {/* current-page marker: one element that slides */}
              <span
                aria-hidden="true"
                className="absolute bottom-[5px] left-0 h-[2px] w-4 rounded-full bg-[var(--gold)] pointer-events-none"
                style={{
                  transform: `translateX(${active ? active.x + active.w / 2 - 8 : 0}px)`,
                  opacity: active ? 1 : 0,
                  transition: placed ? "transform .55s var(--ease-out), opacity .3s" : "none",
                }}
              />
              {DESKTOP_LINKS.map((l, i) => {
                const on = i === activeIndex;
                return (
                  <a
                    key={l.href}
                    ref={(el) => {
                      linkRefs.current[i] = el;
                    }}
                    href={l.href}
                    onClick={go(l.href)}
                    onMouseEnter={() => setHover(i)}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover(null)}
                    aria-current={on ? "page" : undefined}
                    className={`relative z-10 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.18em] font-medium transition-colors duration-300 ${on ? linkActiveTone : linkTone}`}
                  >
                    {l.label}
                  </a>
                );
              })}
            </div>
          </nav>

          <div className="hidden lg:block">
            <a
              href="/contact"
              onClick={go("/contact")}
              className={`pill ${onDark ? "pill-primary" : "pill-secondary-dark"} !min-h-[2.75rem] !text-[11px]`}
            >
              <span className="pill-label">Enquire now</span>
              <span className="pill-chip !w-8 !h-8" aria-hidden="true">
                <IconArrow size={14} />
              </span>
            </a>
          </div>

          <button
            type="button"
            onClick={() => {
              instantClose.current = false;
              setOpen(true);
            }}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            className={`lg:hidden -mr-2 p-2 transition-colors duration-500 ${onDark ? "text-cloud" : "text-charcoal"}`}
          >
            <svg width="28" height="20" viewBox="0 0 28 20" fill="none" aria-hidden="true">
              <path d="M2 4h24M8 10h18M2 16h24" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </header>

      <AnimatePresence custom={instantClose.current}>
        {open && (
          <motion.div
            id="mobile-menu"
            custom={instantClose.current}
            variants={{
              hidden: { opacity: 0, y: -12 },
              shown: { opacity: 1, y: 0 },
              // `custom` is read at exit time, so a route change can close the menu instantly
              exit: (instant: boolean) =>
                instant ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -12 },
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            initial="hidden"
            animate="shown"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[90] bg-[#0E1E15] text-cloud flex flex-col lg:hidden"
            style={{
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: "env(safe-area-inset-bottom)",
            }}
          >
            <div className="h-20 px-6 flex items-center justify-between shrink-0 border-b border-white/10">
              <span className="font-display text-2xl tracking-wide">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-11 h-11 -mr-1.5 rounded-full border border-white/20 grid place-items-center active:scale-95 transition-transform"
                aria-label="Close menu"
              >
                <IconClose size={18} />
              </button>
            </div>

            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-6 py-4">
              <ol>
                {MOBILE_LINKS.map((l, i) => {
                  const on = isActive(pathname, l.href);
                  return (
                    <motion.li
                      key={l.href}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.04 + i * 0.035,
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="border-b border-white/[0.08]"
                    >
                      <a
                        href={l.href}
                        onClick={go(l.href)}
                        aria-current={on ? "page" : undefined}
                        className="flex items-center gap-5 py-4 active:opacity-70"
                      >
                        <span
                          className={`text-[11px] tabular-nums tracking-[0.2em] w-6 ${on ? "text-[var(--gold)]" : "text-cloud/40"}`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`font-display text-[2rem] leading-none ${on ? "text-[var(--gold)] italic" : "text-cloud"}`}
                        >
                          {l.label}
                        </span>
                        {on && (
                          <span
                            className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--gold)]"
                            aria-hidden="true"
                          />
                        )}
                      </a>
                    </motion.li>
                  );
                })}
              </ol>
            </nav>

            <div className="shrink-0 px-6 pb-6 pt-4 border-t border-white/10">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-3">
                Talk to us
              </p>
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/12 py-3 active:scale-95 transition-transform"
                >
                  <IconWhatsApp size={18} className="text-[#25D366]" />
                  <span className="text-[10px] uppercase tracking-[0.15em] text-cloud/80">
                    WhatsApp
                  </span>
                </a>
                <a
                  href={telLink}
                  className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/12 py-3 active:scale-95 transition-transform"
                  aria-label={`Call ${PHONE_DISPLAY}`}
                >
                  <IconPhone size={18} className="text-[var(--gold)]" />
                  <span className="text-[10px] uppercase tracking-[0.15em] text-cloud/80">
                    Call
                  </span>
                </a>
                <a
                  href={mailLink()}
                  className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/12 py-3 active:scale-95 transition-transform"
                  aria-label={`Email ${EMAIL}`}
                >
                  <IconMail size={18} className="text-[var(--gold)]" />
                  <span className="text-[10px] uppercase tracking-[0.15em] text-cloud/80">
                    Email
                  </span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/** Rounded highlight that changes width with transforms only: two round caps
 * plus a 1px middle scaled to fill, so the ends never stretch. */
function GlidePill({ width, animate, tone }: { width: number; animate: boolean; tone: string }) {
  const cap = 16; // half the highlight height
  const mid = Math.max(0, width - cap * 2);
  const t = animate ? "transform .45s var(--ease-out)" : "none";
  return (
    <div className="relative h-full" style={{ width: 0 }}>
      <span
        className="absolute top-0 bottom-0 left-0 rounded-l-full"
        style={{ width: cap, background: tone }}
      />
      <span
        className="absolute top-0 bottom-0 left-0"
        style={{
          width: 1,
          background: tone,
          transformOrigin: "left center",
          transform: `translateX(${cap}px) scaleX(${mid})`,
          transition: t,
        }}
      />
      <span
        className="absolute top-0 bottom-0 left-0 rounded-r-full"
        style={{
          width: cap,
          background: tone,
          transform: `translateX(${cap + mid}px)`,
          transition: t,
        }}
      />
    </div>
  );
}
