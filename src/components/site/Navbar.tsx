import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagneticButton } from "./Primitives";
import { usePageTransition } from "@/lib/PageTransitionContext";
import { useImg } from "@/hooks/useImg";
import { useBackToClose } from "@/hooks/useBackToClose";

const links = [
  { label: "Collections", href: "#collections" },
  { label: "Craft", href: "#craft" },
  { label: "Order", href: "#order" },
  { label: "Connect", href: "#connect" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = usePageTransition();
  const IMG = useImg();

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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    links.forEach((l) => {
      const section = document.querySelector(l.href);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.6, duration: 0.7 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "backdrop-blur-xl bg-[var(--emerald-deep)]/10 border-b border-[var(--gold)]/20" : "bg-transparent"
        }`}
      >
        <div className="max-w-[1500px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <a href="#top" data-cursor="Home" className="flex items-center gap-3">
            <img src={IMG.logo} alt="TajAttire Logo" style={{ height: '36px', width: 'auto', mixBlendMode: 'lighten' }} />
            <span className="font-display text-2xl tracking-wider text-cloud font-bold">TajAttire</span>
          </a>
          <div className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => handleNavClick(e, l.href)}
                data-cursor="Go"
                className="relative text-xs uppercase tracking-[0.2em] text-cloud/80 hover:text-[var(--gold)] transition-colors group py-2"
              >
                {l.label}
                <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-[var(--gold)] group-hover:w-full transition-all duration-500" />
                <motion.span 
                  initial={false}
                  animate={{ scaleX: activeSection === l.href.substring(1) ? 1 : 0 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  style={{ transformOrigin: "left" }}
                  className="absolute left-0 -bottom-0.5 h-px w-full bg-[#C9A84C]"
                />
              </a>
            ))}
          </div>
          <div className="hidden md:block">
            <MagneticButton href="#order" onClick={() => navigate("#order")} variant="outline" cursorLabel="Order" className="!px-5 !py-2.5 !text-[11px] rounded-full">
              Start Ordering
            </MagneticButton>
          </div>
          <button onClick={() => setOpen(true)} className="md:hidden text-cloud" aria-label="Menu">
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
              href="#order"
              onClick={(e) => { e.preventDefault(); setOpen(false); navigate("#order"); }}
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
