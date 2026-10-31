import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useBackToClose } from "@/hooks/useBackToClose";
import { useScrollLock } from "@/lib/scrollLock";
import { IconClose, IconChevron } from "./icons";

export interface LightboxItem {
  src: string;
  alt: string;
  type?: "image" | "video";
  caption?: string;
}

/**
 * Full-screen viewer. Swiping uses native scroll-snap (no custom drag that
 * can get stuck); arrows/keys move one slide; the browser back gesture and
 * Esc close it.
 */
export function Lightbox({
  items,
  index,
  onClose,
}: {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(index);
  const stripRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useBackToClose(true, onClose);

  useLayoutEffect(() => {
    const strip = stripRef.current;
    if (strip) strip.scrollLeft = index * strip.clientWidth;
  }, [index]);

  useScrollLock(true);
  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, []);

  const goTo = (i: number) => {
    const strip = stripRef.current;
    if (!strip) return;
    const n = Math.max(0, Math.min(items.length - 1, i));
    strip.scrollTo({ left: n * strip.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") goTo(current + 1);
      else if (e.key === "ArrowLeft") goTo(current - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const onScroll = () => {
    const strip = stripRef.current;
    if (!strip) return;
    const i = Math.round(strip.scrollLeft / strip.clientWidth);
    if (i !== current) setCurrent(i);
  };

  return createPortal(
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[120] bg-black/95 text-cloud flex flex-col"
      data-lenis-prevent
    >
      <div
        className="flex items-center justify-between px-4 sm:px-6 h-16 shrink-0"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <span className="text-xs tracking-[0.2em] tabular-nums text-cloud/70" aria-live="polite">
          {current + 1} / {items.length}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close viewer"
          className="w-11 h-11 rounded-full border border-white/20 grid place-items-center active:scale-95"
        >
          <IconClose size={18} />
        </button>
      </div>

      <div
        ref={stripRef}
        onScroll={onScroll}
        className="flex-1 min-h-0 flex overflow-x-auto snap-x snap-mandatory scrollbar-hide overscroll-contain"
      >
        {items.map((it, i) => (
          <figure
            key={i}
            className="relative w-full h-full shrink-0 snap-center flex flex-col items-center justify-center px-3 sm:px-16 pb-4"
          >
            {it.type === "video" ? (
              <video
                src={it.src}
                controls
                playsInline
                preload="metadata"
                className="max-w-full max-h-full rounded-lg"
              />
            ) : (
              <img
                src={it.src}
                alt={it.alt}
                loading={Math.abs(i - index) <= 1 ? "eager" : "lazy"}
                decoding="async"
                className="max-w-full max-h-full object-contain rounded-lg select-none"
                draggable={false}
              />
            )}
            {it.caption && (
              <figcaption className="mt-3 text-[11px] uppercase tracking-[0.2em] text-[var(--gold)]">
                {it.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(current - 1)}
            disabled={current === 0}
            aria-label="Previous"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 grid place-items-center disabled:opacity-25 active:scale-95"
          >
            <IconChevron dir="left" />
          </button>
          <button
            type="button"
            onClick={() => goTo(current + 1)}
            disabled={current === items.length - 1}
            aria-label="Next"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 grid place-items-center disabled:opacity-25 active:scale-95"
          >
            <IconChevron />
          </button>
        </>
      )}
    </motion.div>,
    document.body,
  );
}
