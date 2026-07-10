import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTransition } from "@/lib/PageTransitionContext";

const MOBILE_MSGS = [
  { label: "Request Catalogue", href: "#order", isExternal: false },
  { label: "WhatsApp Us", href: "https://wa.me/917976667197", isExternal: true },
  { label: "Get Free Samples", href: "#order", isExternal: false },
  { label: "Talk to Our Team", href: "https://wa.me/917976667197", isExternal: true },
];

export function StickyCtaBar() {
  const [scrolled, setScrolled] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);
  const navigate = usePageTransition();

  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      const scrollY = window.scrollY;
      setScrolled(scrollY > vh * 0.6);
      setNearFooter(scrollY + vh > docH - 800);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(
      () => setMobileIndex((p) => (p + 1) % MOBILE_MSGS.length),
      3000,
    );
    return () => clearInterval(t);
  }, []);

  const visible = scrolled && !nearFooter;

  return (
    <>
      {/* ── Desktop: left-edge vertical rail ── */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 z-40"
          >
            <a
              id="sticky-cta-desktop"
              href="#order"
              onClick={(e) => {
                e.preventDefault();
                navigate("#order");
              }}
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
              className="text-[10px] tracking-[0.22em] uppercase text-[var(--gold)] hover:text-[var(--cloud)] py-5 px-3 border border-[var(--gold)]/30 hover:border-[var(--gold)] hover:bg-[var(--emerald-deep)]/50 transition-all duration-300 whitespace-nowrap backdrop-blur-sm"
            >
              Request Wholesale Catalogue
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile: floating pill at bottom ── */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed z-40"
            style={{
              bottom: "80px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {/* Glow behind pill */}
            <div className="absolute inset-0 rounded-full bg-[var(--gold)] blur-[14px] opacity-25 pointer-events-none scale-110" />

            <AnimatePresence mode="wait">
              {(() => {
                const msg = MOBILE_MSGS[mobileIndex];
                return (
                  <motion.a
                    key={mobileIndex}
                    id={`sticky-mobile-msg-${mobileIndex}`}
                    href={msg.href}
                    onClick={
                      !msg.isExternal
                        ? (e) => {
                            e.preventDefault();
                            navigate(msg.href);
                          }
                        : undefined
                    }
                    target={msg.isExternal ? "_blank" : undefined}
                    rel={msg.isExternal ? "noreferrer" : undefined}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="relative flex items-center gap-2 px-5 py-3 bg-[var(--gold)] text-[var(--deep-black)] rounded-full text-[10px] font-semibold uppercase tracking-[0.12em] whitespace-nowrap shadow-[0_4px_24px_rgba(201,168,76,0.5)] max-w-[calc(100vw-160px)] overflow-hidden"
                  >
                    {msg.label} →
                  </motion.a>
                );
              })()}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
