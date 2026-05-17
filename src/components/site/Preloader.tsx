import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const Preloader = React.memo(function Preloader({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState(0);
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    const t1 = setTimeout(() => setStage(1), 300);      // start animations
    const t2 = setTimeout(() => setStage(2), 3500);     // begin fade out
    const t3 = setTimeout(() => onDone(), 4200);        // unmount, show site
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <AnimatePresence>
      {stage < 2 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7 } }}
          className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col items-center justify-center"
        >
          <div className="relative mb-6 flex items-center justify-center overflow-hidden">
            {/* Logo: /public/logo.png — replace with actual file before deployment */}
            <motion.img
              src="/logo.png"
              alt="TajAttire Logo"
              style={{ width: "180px", height: "auto" }}
              initial={{ opacity: 0, scale: 0.8, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            />
            <motion.div
              className="absolute inset-0 z-10"
              style={{ 
                background: "linear-gradient(105deg, transparent 40%, rgba(201,168,76,0.5) 50%, transparent 60%)",
                backgroundSize: "200% 100%"
              }}
              initial={{ backgroundPosition: "-200% 0" }}
              animate={{ backgroundPosition: "200% 0" }}
              transition={{ delay: 1.8, duration: 0.9, ease: "easeInOut" }}
            />
          </div>
          
          <div className="flex flex-col items-center" style={{ fontFamily: 'Inter, sans-serif' }}>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.6, duration: 0.5 }}
              className="text-[11px] tracking-[0.4em] text-[#C9A84C] uppercase"
            >
              TAJATTIRE
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.8, duration: 0.5 }}
              className="text-[8px] tracking-[0.25em] text-[rgba(201,168,76,0.6)] uppercase mt-2"
            >
              HANDCRAFTED HERITAGE
            </motion.div>
          </div>
          
          <div className="w-[160px] h-[1px] bg-[rgba(201,168,76,0.2)] overflow-hidden mt-8">
            <motion.div
              className="h-full bg-[#C9A84C]"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.8, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
