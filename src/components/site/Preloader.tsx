import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 500);      // start animations
    const t2 = setTimeout(() => setStage(2), 3200);     // begin exit
    const t3 = setTimeout(() => onDone(), 3800);        // unmount and show site
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  const ease = [0.76, 0, 0.24, 1];

  return (
    <AnimatePresence>
      {stage < 2 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col items-center justify-center"
        >
          <div className="relative w-40 h-44 mb-6 overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 200 220" className="w-full h-full relative z-0" stroke="#C9A84C" strokeWidth="1.2" fill="none">
              {/* Group 1: Main Dome */}
              <motion.path
                d="M100 10 L100 25 M100 25 C100 45 130 60 130 90 L70 90 C70 60 100 45 100 25 Z"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 0.5, ease }}
              />
              {/* Group 2: Side Domes + Minarets */}
              <motion.path
                d="M40 90 C40 70 55 60 55 50 C55 60 70 70 70 90 L70 170 M40 90 L40 170 M130 90 C130 70 145 60 145 50 C145 60 160 70 160 90 L160 170 M130 90 L130 170 M40 170 L160 170 M20 170 L180 170 M25 170 L25 80 C25 70 35 70 35 80 L35 170 M165 170 L165 80 C165 70 175 70 175 80 L175 170"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.4, delay: 0.9, ease }}
              />
              {/* Group 3: TA Monogram */}
              <motion.path
                d="M75 105 L125 105 M100 105 L100 160 M100 105 L80 160 M100 105 L120 160 M88 140 L112 140"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.0, delay: 1.6, ease }}
              />
              {/* Group 4: Needle + Swirl */}
              <motion.path
                d="M 70 190 L 130 175 L 132 178 L 72 193 Z M 120 178 L 125 176 M 125 176 C 150 160 190 180 160 210 C 120 240 80 240 40 210 C 10 180 50 160 70 190"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, delay: 2.0, ease }}
              />
            </svg>
            <motion.div
              className="absolute inset-0 z-10"
              style={{ background: "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.6) 50%, transparent 100%)" }}
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ delay: 2.6, duration: 0.7, ease: "linear" }}
            />
          </div>
          
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.8, duration: 0.5 }}
              className="text-[12px] tracking-[0.4em] text-[var(--gold)] font-body uppercase"
            >
              TAJATTIRE
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.0, duration: 0.5 }}
              className="text-[10px] tracking-[0.25em] text-[var(--gold)]/60 font-body uppercase mt-2"
            >
              HANDCRAFTED HERITAGE
            </motion.div>
          </div>
          
          <div className="w-48 h-px bg-white/10 overflow-hidden mt-8">
            <motion.div
              className="h-full bg-[var(--gold)]"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, delay: 0.5, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
