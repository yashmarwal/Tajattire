import { useEffect } from "react";
import { registerLenis, unregisterLenis } from "@/lib/lenis-store";

/** Gentle wheel smoothing on desktop only. Touch devices and reduced-motion
 * users keep native scrolling. */
export function SmoothScroll() {
  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (coarse || reduce || window.innerWidth < 1024) return;
    let rafId = 0;
    let destroyed = false;
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    void import("lenis").then(({ default: Lenis }) => {
      if (destroyed) return;
      const l = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 0.9 });
      lenis = l;
      registerLenis(l);
      const raf = (time: number) => {
        l.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    });
    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      unregisterLenis();
    };
  }, []);
  return null;
}
