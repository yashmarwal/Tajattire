import { useRef, MouseEvent, useState, useEffect } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";

export function MagneticButton({
  children,
  className = "",
  href,
  onClick,
  cursorLabel = "View",
  variant = "gold",
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  cursorLabel?: string;
  variant?: "gold" | "outline" | "outline-dark" | "wa";
}) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15 });
  const sy = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMove = (e: MouseEvent) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < 80) {
      x.set(dx * 0.3);
      y.set(dy * 0.3);
    } else { x.set(0); y.set(0); }
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  const base = "btn-liquid inline-flex items-center gap-2 px-7 py-3.5 text-sm tracking-[0.15em] uppercase font-medium border";
  const variants = {
    gold: "bg-[var(--gold)] border-[var(--gold)] text-[var(--deep-black)]",
    outline: "bg-transparent border-[var(--cloud)] text-[var(--cloud)]",
    "outline-dark": "bg-transparent border-[var(--emerald-deep)] text-[var(--emerald-deep)]",
    wa: "bg-[#25D366] border-[#25D366] text-white",
  };

  const Comp: any = href ? motion.a : motion.button;
  return (
    <Comp
      ref={ref as any}
      href={href}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: sx, y: sy }}
      data-cursor={cursorLabel}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </Comp>
  );
}

export function SplitHeading({ text, className = "", as: As = "h2", delay = 0 }: { text: string; className?: string; as?: any; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const words = text.split(" ");
  return (
    <As ref={ref} className={className} style={{ wordBreak: "normal", overflowWrap: "normal" }}>
      <div style={{ overflow: "hidden" }}>
        <span className="inline-block">
          {words.map((w, i) => (
            <span key={i} style={{ display: "inline-block", overflow: "hidden", marginRight: "0.25em", whiteSpace: "nowrap" }}>
              <motion.span
                initial={{ y: "100%", opacity: 0 }}
                animate={inView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 1.2, delay: delay + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                {w}
              </motion.span>
            </span>
          ))}
        </span>
      </div>
    </As>
  );
}

export function FadeLines({ lines, className = "", lineClass = "" }: { lines: string[]; className?: string; lineClass?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  return (
    <div ref={ref} className={className}>
      {lines.map((l, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.2 }}
          className={lineClass}
        >
          {l}
        </motion.p>
      ))}
    </div>
  );
}

export function CurtainImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        initial={{ scale: 1.2 }}
        animate={inView ? { scale: 1 } : {}}
        transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <motion.div
        initial={{ x: "0%" }}
        animate={inView ? { x: "100%" } : {}}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="absolute inset-0 bg-[var(--emerald-deep)]"
      />
    </div>
  );
}

export function CountUp({ end, prefix = "", suffix = "", className = "" }: { end: number; prefix?: string; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  const [isDone, setIsDone] = useState(false);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 4500;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = p === 1 ? 1 : 1 - Math.pow(1 - p, 6);
      setVal(Math.round(end * eased));
      if (p < 1) requestAnimationFrame(tick);
      else setIsDone(true);
    };
    requestAnimationFrame(tick);
  }, [inView, end]);
  return (
    <motion.span 
      ref={ref} 
      className={className}
      initial={{ textShadow: "0px 0px 0px transparent" }}
      animate={isDone ? { textShadow: ["0px 0px 20px var(--gold)", "0px 0px 0px transparent"] } : {}}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {prefix}{val.toLocaleString()}{suffix}
    </motion.span>
  );
}

export function Parallax({ children, speed = 0.3, className = "" }: { children: React.ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-50 * speed}%`, `${50 * speed}%`]);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="absolute inset-0">{children}</motion.div>
    </div>
  );
}
