import { useRef, useState, useEffect, type ElementType } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Heading whose words rise into view through a mask. The mask has built-in
 * padding (see .reveal-mask) so italics and descenders are never clipped. */
export function SplitHeading({
  text,
  className = "",
  as: As = "h2",
  delay = 0,
}: {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <As ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i}>
          <span className="reveal-mask">
            <motion.span
              className="inline-block"
              initial={reduce ? false : { y: "110%" }}
              animate={inView || reduce ? { y: 0 } : undefined}
              transition={{ duration: 0.95, delay: delay + i * 0.07, ease: EASE }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </As>
  );
}

/** Paragraphs that rise and fade in, staggered, once. */
export function FadeLines({
  lines,
  className = "",
  lineClass = "",
}: {
  lines: string[];
  className?: string;
  lineClass?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const reduce = useReducedMotion();
  return (
    <div ref={ref} className={className}>
      {lines.map((l, i) => (
        <motion.p
          key={i}
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={inView || reduce ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, ease: EASE, delay: i * 0.12 }}
          className={lineClass}
        >
          {l}
        </motion.p>
      ))}
    </div>
  );
}

/** A hairline that draws in from the left. */
export function DrawRule({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className={`hairline ${className}`}
      style={{ transformOrigin: "left center" }}
      initial={reduce ? false : { scaleX: 0 }}
      animate={inView || reduce ? { scaleX: 1 } : undefined}
      transition={{ duration: 1.1, ease: EASE }}
    />
  );
}

/** Image revealed by a curtain sliding off it. Fixed aspect ratio comes from the parent. */
export function CurtainImage({
  src,
  alt,
  className = "",
  onError,
}: {
  src: string;
  alt: string;
  className?: string;
  onError?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  return (
    <div ref={ref} className={`relative overflow-hidden bg-[var(--emerald-deep)] ${className}`}>
      {src && (
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={onError}
          initial={reduce ? false : { scale: 1.15 }}
          animate={inView || reduce ? { scale: 1 } : undefined}
          transition={{ duration: 1.8, ease: EASE }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <motion.div
        aria-hidden="true"
        initial={reduce ? false : { x: "0%" }}
        animate={inView || reduce ? { x: "101%" } : undefined}
        transition={{ duration: 1.4, ease: EASE, delay: 0.15 }}
        className="absolute inset-0 bg-[var(--emerald-deep)]"
        style={reduce ? { display: "none" } : undefined}
      />
    </div>
  );
}

/** Counts up once when visible. Tabular figures so the width never jitters,
 * and no thousands separator below 10,000 (a year must never read "2,004"). */
export function CountUp({
  end,
  prefix = "",
  suffix = "",
  className = "",
}: {
  end: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? end : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    let raf = 0;
    const start = performance.now();
    const dur = 2200;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setVal(Math.round(end * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end, reduce]);
  const fmt = end >= 10000 ? val.toLocaleString("en-IN") : String(val);
  // Reserve the final width up front so counting never shifts layout
  const finalText = `${prefix}${end >= 10000 ? end.toLocaleString("en-IN") : end}${suffix}`;
  return (
    <span
      ref={ref}
      className={`relative inline-block whitespace-nowrap tabular-nums ${className}`}
      aria-label={finalText}
    >
      <span aria-hidden="true" className="invisible">
        {finalText}
      </span>
      <span aria-hidden="true" className="absolute inset-0">
        {prefix}
        {fmt}
        {suffix}
      </span>
    </span>
  );
}
