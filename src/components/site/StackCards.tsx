import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";

const NAV = 88; // px under the fixed header
const STEP = 14; // each pinned card sits a little lower than the last

function Card({
  i,
  n,
  progress,
  children,
  innerRef,
}: {
  i: number;
  n: number;
  progress: MotionValue<number>;
  children: ReactNode;
  innerRef?: (el: HTMLDivElement | null) => void;
}) {
  const reduce = useReducedMotion();
  const target = 1 - (n - 1 - i) * 0.04;
  const scale = useTransform(progress, [i / n, 1], [1, reduce ? 1 : target]);
  return (
    <div
      className="sticky"
      style={{ top: NAV + i * STEP, marginBottom: i < n - 1 ? "1.25rem" : 0 }}
    >
      <motion.div
        ref={innerRef}
        style={{ scale, transformOrigin: "50% 0%" }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Cards that pin one after another. The LAST card pins like the others and
 * the following section (`next`) slides up over it. The overlap ("hold") is
 * measured from the real last-card height — no magic numbers — so there's
 * never an empty gap after the stack.
 */
export function StackCards({ cards, next }: { cards: ReactNode[]; next?: ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  const last = useRef<HTMLDivElement | null>(null);
  const [hold, setHold] = useState(0);
  const n = cards.length;
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });

  useLayoutEffect(() => {
    const el = last.current;
    if (!el) return;
    const measure = () => setHold(Math.ceil(el.offsetHeight + NAV + (n - 1) * STEP));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [n]);

  return (
    <>
      <div ref={wrap}>
        {cards.map((c, i) => (
          <Card
            key={i}
            i={i}
            n={n}
            progress={scrollYProgress}
            innerRef={
              i === n - 1
                ? (el) => {
                    last.current = el;
                  }
                : undefined
            }
          >
            {c}
          </Card>
        ))}
        {/* A real spacer (not padding): sticky children can only travel within
            their parent's content box, so this is what lets the last card pin. */}
        {next && <div aria-hidden="true" style={{ height: hold }} />}
      </div>
      {next && (
        <div className="relative z-[2]" style={{ marginTop: -hold }}>
          {next}
        </div>
      )}
    </>
  );
}
