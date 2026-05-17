import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => onDone(), 3200);
    return () => clearTimeout(t1);
  }, [onDone]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.8 } }}
        className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col items-center justify-center"
      >
        <div className="relative w-32 h-32 mb-6 flex items-center justify-center overflow-hidden">
          {/* TODO: replace with actual logo.png from client */}
          <motion.img
            src="/logo.png"
            alt="TajAttire Logo"
            className="absolute inset-0 w-full h-full object-contain"
            style={{ mixBlendMode: "lighten" }}
            initial={{ opacity: 0, scale: 0.85, filter: "brightness(1) blur(8px)" }}
            animate={{ opacity: 1, scale: 1, filter: "brightness(1) blur(0px)" }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            className="absolute inset-0 z-10"
            style={{ background: "linear-gradient(30deg, transparent 0%, rgba(201,168,76,0.4) 50%, transparent 100%)" }}
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeInOut" }}
          />
        </div>
        
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.5 }}
            className="text-[12px] tracking-[0.4em] text-[var(--gold)] font-body uppercase"
          >
            TAJATTIRE
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.5 }}
            className="text-[10px] tracking-[0.25em] text-[var(--gold)]/50 font-body uppercase mt-2"
          >
            HANDCRAFTED HERITAGE
          </motion.div>
        </div>
        
        <div className="w-48 h-px bg-white/10 overflow-hidden mt-8">
          <motion.div
            className="h-full bg-[var(--gold)]"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
