import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 200);
    const t2 = setTimeout(() => setStage(2), 1800);
    const t3 = setTimeout(() => onDone(), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <AnimatePresence>
      {stage < 2 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="fixed inset-0 z-[100] bg-[var(--deep-black)] flex flex-col items-center justify-center"
        >
          <svg viewBox="0 0 120 80" className="w-32 h-20 mb-8">
            <motion.path
              d="M60 10 L40 35 L40 65 L80 65 L80 35 Z M60 10 L60 65 M50 25 L70 25"
              stroke="#C9A84C"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            />
          </svg>
          <div className="w-48 h-px bg-white/10 overflow-hidden">
            <motion.div
              className="h-full bg-[var(--gold)]"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
            />
          </div>
          <div className="mt-6 text-xs tracking-[0.3em] text-[var(--gold)]/70 font-body">TAJATTIRE</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
