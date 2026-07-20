import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { MagneticButton } from "./Primitives";
import { usePageTransition } from "@/lib/PageTransitionContext";
import { useImg } from "@/hooks/useImg";
import { useBackToClose } from "@/hooks/useBackToClose";

const links = [
  { label: "Catalogue", href: "/catalogue" },
  { label: "Custom Orders", href: "/custom-orders" },
  { label: "Craft", href: "/craft" },
  { label: "Contact", href: "/contact" },
];

// Desktop nav only — mobile menu keeps its existing 4 links (the logo already
// serves as the mobile "return home" tap target).
const desktopLinks = [{ label: "Home", href: "/" }, ...links];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // Which section's background currently sits directly behind the fixed
  // navbar — flips the navbar's own colors so it never goes light-on-light
  // or dark-on-dark against whatever content is scrolling underneath it.
  const [bgTheme, setBgTheme] = useState<"light" | "dark">("dark");
  const navigate = usePageTransition();
  const location = useLocation();
  const IMG = useImg();
  const isLight = bgTheme === "light";

  // Back button (Android/browser) closes the mobile menu instead of leaving the site
  useBackToClose(open, () => setOpen(false));

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    navigate(href);
  };
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 80);
    on();
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const probeY = 40; // roughly mid-height of the h-20 navbar
    const probeTheme = () => {
      const sections = document.querySelectorAll<HTMLElement>("[data-bg]");
      for (const el of sections) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom > probeY) {
          const bg = el.dataset.bg;
          if (bg === "light" || bg === "dark") setBgTheme(bg);
          return;
        }
      }
    };
    probeTheme();
    window.addEventListener("scroll", probeTheme, { passive: true });
    window.addEventListener("resize", probeTheme);
    // Route content lazy-loads slightly after navigation — catch it mounting.
    const observer = new MutationObserver(probeTheme);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener("scroll", probeTheme);
      window.removeEventListener("resize", probeTheme);
      observer.disconnect();
    };
  }, [location.pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.6, duration: 0.7 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          scrolled
            ? isLight
              ? "backdrop-blur-xl bg-cloud/70 border-b border-charcoal/10"
              : "backdrop-blur-xl bg-[var(--emerald-deep)]/10 border-b border-[var(--gold)]/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1500px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <a href="/" onClick={(e) => handleNavClick(e, "/")} data-cursor="Home" className="flex items-center gap-3">
            <img src={IMG.logo} alt="TajAttire Logo" style={{ height: '36px', width: 'auto', mixBlendMode: isLight ? 'normal' : 'lighten' }} />
            <span className={`font-display text-2xl tracking-wider font-bold transition-colors duration-500 ${isLight ? "text-charcoal" : "text-cloud"}`}>TajAttire</span>
          </a>
          <div className="hidden md:flex items-center gap-10">
            {desktopLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => handleNavClick(e, l.href)}
                data-cursor="Go"
                className={`relative text-xs uppercase tracking-[0.2em] hover:text-[var(--gold)] transition-colors group py-2 ${isLight ? "text-charcoal/80" : "text-cloud/80"}`}
              >
                {l.label}
                <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-[var(--gold)] group-hover:w-full transition-all duration-500" />
                <motion.span
                  initial={false}
                  animate={{ scaleX: location.pathname === l.href ? 1 : 0 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  style={{ transformOrigin: "left" }}
                  className="absolute left-0 -bottom-0.5 h-px w-full bg-[#C9A84C]"
                />
              </a>
            ))}
          </div>
          <div className="hidden md:block">
            <MagneticButton href="/contact" onClick={() => navigate("/contact")} variant={isLight ? "outline-dark" : "outline"} cursorLabel="Order" className="!px-5 !py-2.5 !text-[11px] rounded-full">
              Start Ordering
            </MagneticButton>
          </div>
          <button onClick={() => setOpen(true)} className={`md:hidden transition-colors duration-500 ${isLight ? "text-charcoal" : "text-cloud"}`} aria-label="Menu">
            <svg width="28" height="20" viewBox="0 0 28 20" fill="none"><path d="M2 4h24M2 10h24M2 16h24" stroke="currentColor" strokeWidth="1.5"/></svg>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: [0.7, 0, 0.3, 1] }}
            className="fixed inset-0 z-[80] bg-[var(--emerald-deep)] flex flex-col items-center justify-center md:hidden"
          >
            <button onClick={() => setOpen(false)} className="absolute top-6 right-6 text-cloud" aria-label="Close">
              <svg width="28" height="28" viewBox="0 0 28 28"><path d="M4 4l20 20M24 4L4 24" stroke="currentColor" strokeWidth="1.5"/></svg>
            </button>
            <div className="space-y-8 text-center">
              {links.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  onClick={(e) => { e.preventDefault(); setOpen(false); navigate(l.href); }}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="block font-display text-5xl text-cloud"
                >{l.label}</motion.a>
              ))}
            </div>
            {/* Mobile bottom CTA */}
            <motion.a
              href="/contact"
              onClick={(e) => { e.preventDefault(); setOpen(false); navigate("/contact"); }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-16 border border-[var(--gold)] text-[var(--gold)] px-8 py-4 text-xs uppercase tracking-[0.2em] font-body font-medium hover:bg-[var(--gold)] hover:text-[var(--deep-black)] transition-all duration-300"
            >
              Request Catalogue →
            </motion.a>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
