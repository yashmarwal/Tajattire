import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import terms from "@/data/terms.json";
import { FOUNDED_YEAR } from "@/lib/contact";

/* ─────────── Rotating fact strip ─────────── */
function RotatingChip({
  texts,
  filled,
  interval,
}: {
  texts: string[];
  filled: boolean;
  interval: number;
}) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => setI((p) => (p + 1) % texts.length), interval);
    return () => clearInterval(t);
  }, [interval, texts.length, reduce]);
  // Width reserved for the longest phrase, so rotating never shifts layout
  const longest = texts.reduce((a, b) => (b.length > a.length ? b : a), "");
  return (
    <div
      className={`relative grid place-items-center rounded-full h-8 md:h-11 px-3.5 md:px-6 overflow-hidden shrink-0 ${
        filled
          ? "bg-[var(--gold)] text-deep-black"
          : "border border-[var(--gold)]/70 text-[var(--gold)]"
      }`}
    >
      <span
        aria-hidden="true"
        className="invisible whitespace-nowrap text-[10px] md:text-[11px] uppercase tracking-[0.14em] font-semibold [grid-area:1/1]"
      >
        {longest}
      </span>
      <AnimatePresence initial={false}>
        <motion.span
          key={i}
          initial={{ y: "120%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-120%", opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="[grid-area:1/1] whitespace-nowrap text-[10px] md:text-[11px] uppercase tracking-[0.14em] font-semibold"
        >
          {texts[i]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export function Marquee() {
  const boxes = [
    { texts: [`${terms.designCount} designs`, "Kurtis", "Gowns", "Tops"], filled: true, d: 3000 },
    {
      texts: [`MOQ ${terms.defaultCategory.moqNumber} pcs`, "Bulk orders", "Private label"],
      filled: false,
      d: 3300,
    },
    {
      texts: [`From ${terms.startingPrice}`, "Wholesale only", "Trade prices"],
      filled: true,
      d: 3600,
    },
    {
      texts: ["Pan-India delivery", `${terms.states} states`, `Since ${FOUNDED_YEAR}`],
      filled: false,
      d: 3900,
    },
  ];
  return (
    <section
      data-bg="dark"
      aria-label="At a glance"
      className="relative z-20 bg-deep-black border-y border-[var(--gold)]/30 py-2.5 md:py-3"
    >
      <div className="max-w-[1500px] mx-auto px-3 md:px-6 flex justify-center md:justify-evenly gap-2 md:gap-4 overflow-hidden">
        {boxes.map((b, i) => (
          <div key={i} className={i >= 2 ? "hidden md:block" : ""}>
            <RotatingChip texts={b.texts} filled={b.filled} interval={b.d} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────── Brand statement ─────────── */
export function Statement() {
  const words =
    "We don't just make clothes. We build the inventory that builds your business.".split(" ");
  const highlight = new Set(["clothes.", "inventory", "business."]);
  const reduce = useReducedMotion();
  return (
    <section
      data-bg="dark"
      className="relative bg-deep-black pt-24 pb-10 md:pt-36 md:pb-12 overflow-hidden"
    >
      <div className="relative max-w-5xl mx-auto px-6 text-center">
        <motion.blockquote
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="font-display italic leading-[1.15] tracking-tight text-[clamp(1.6rem,5vw,3.5rem)]"
        >
          {words.map((w, i) => (
            <span key={i}>
              <span className="reveal-mask">
                <motion.span
                  className={`inline-block ${highlight.has(w) ? "text-[var(--gold)]" : "text-cloud/85"}`}
                  variants={{
                    hidden: reduce ? {} : { y: "110%" },
                    visible: {
                      y: 0,
                      transition: { duration: 0.8, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                >
                  {w}
                </motion.span>
              </span>
              {i < words.length - 1 ? " " : null}
            </span>
          ))}
        </motion.blockquote>
        <div className="hairline mt-14 mx-auto w-32" />
        <p className="mt-6 text-cloud/50 text-[11px] tracking-[0.3em] uppercase">
          TajAttire · Jaipur · since {FOUNDED_YEAR}
        </p>
      </div>
    </section>
  );
}

/* ─────────── Soft colour bridge between sections ─────────── */
const BLEND = { black: "#0A0A0A", cloud: "#F8F6F1", emerald: "#1A5C38" } as const;
export function SectionBlend({ from, to }: { from: keyof typeof BLEND; to: keyof typeof BLEND }) {
  return (
    <div
      aria-hidden="true"
      className="relative z-[5] pointer-events-none h-16 -my-8"
      style={{ background: `linear-gradient(to bottom, ${BLEND[from]}, ${BLEND[to]})` }}
    />
  );
}
