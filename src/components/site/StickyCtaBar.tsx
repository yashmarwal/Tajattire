import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTransition } from "@/lib/PageTransitionContext";

export function StickyCtaBar() {
  const [scrolled, setScrolled] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);
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

  const visible = scrolled && !nearFooter;
  // The mobile action bar is a persistent e-commerce-style dock, not scroll-gated —
  // only hidden near the footer where Inquiry/Footer already carry the same CTAs.
  const mobileBarVisible = !nearFooter;

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

      {/* ── Mobile: fixed bottom quick-action bar (e-commerce style) ── */}
      <AnimatePresence>
        {mobileBarVisible && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-[7000] bg-[var(--deep-black)]/97 backdrop-blur-md border-t border-[var(--gold)]/25 shadow-[0_-8px_30px_rgba(0,0,0,0.45)]"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="flex items-stretch gap-2 px-3 py-2.5">
              <a
                href="tel:+917976667197"
                aria-label="Call TajAttire"
                className="flex flex-col items-center justify-center w-14 flex-shrink-0 rounded-xl border border-[var(--gold)]/30 text-[var(--gold)] py-1.5 active:scale-95 transition-transform"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span className="text-[8px] uppercase tracking-wider mt-1">Call</span>
              </a>

              <a
                href="https://wa.me/917976667197"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp TajAttire"
                className="flex flex-col items-center justify-center w-14 flex-shrink-0 rounded-xl border border-[#25D366]/40 text-[#25D366] py-1.5 active:scale-95 transition-transform"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.562 4.14 1.541 5.874L0 24l6.304-1.653A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.793 9.793 0 01-5.001-1.371l-.36-.214-3.722.976.995-3.63-.234-.373A9.778 9.778 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182c5.43 0 9.818 4.388 9.818 9.818 0 5.43-4.388 9.818-9.818 9.818z"/></svg>
                <span className="text-[8px] uppercase tracking-wider mt-1">Chat</span>
              </a>

              <a
                href="#order"
                onClick={(e) => { e.preventDefault(); navigate("#order"); }}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[var(--gold)] text-[var(--deep-black)] text-[11px] font-bold uppercase tracking-[0.14em] active:scale-[0.98] transition-transform"
              >
                Enquire Now →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
