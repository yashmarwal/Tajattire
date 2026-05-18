import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export const Preloader = React.memo(function Preloader({ onDone }: { onDone: () => void }) {
  const [stage, setStage] = useState(0);
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;
    
    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 1400);
    const t3 = setTimeout(() => setStage(3), 2600);
    const t4 = setTimeout(() => setStage(4), 3200);
    const t5 = setTimeout(() => onDone(), 4000);
    
    return () => { 
      clearTimeout(t1); 
      clearTimeout(t2); 
      clearTimeout(t3); 
      clearTimeout(t4); 
      clearTimeout(t5); 
    };
  }, [onDone]);


  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center">
      {/* LAYER 1 & 6 — BACKGROUND TEAR */}
      <motion.div
        style={{ position: "fixed", top: 0, left: 0, right: 0, height: "50%", background: "#0A0A0A", zIndex: 9998 }}
        animate={stage >= 4 ? { y: "-100%" } : { y: "0%" }}
        transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "50%", background: "#0A0A0A", zIndex: 9998 }}
        animate={stage >= 4 ? { y: "100%" } : { y: "0%" }}
        transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1] }}
      />

      <div className="absolute inset-0 z-[9999] flex flex-col items-center justify-center pointer-events-none">
        
        {/* LAYER 2 — HORIZONTAL THREAD LINE */}
        <motion.div 
          className="absolute left-0 w-full flex items-center justify-start"
          style={{ top: "25%", height: "4px", marginTop: "-2px" }}
          animate={stage >= 4 ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "visible" }}>
            <motion.line
              x1="0" y1="2" x2="100%" y2="2"
              stroke="#C9A84C"
              strokeWidth="1.5"
              strokeDasharray="8 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={stage >= 2 ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
            />
          </svg>
          
          <motion.div
            style={{ position: "absolute", top: "-3px", left: 0 }}
            initial={{ x: "-10px", opacity: 0 }}
            animate={stage >= 2 ? { x: "calc(100vw - 10px)", opacity: 1 } : { x: "-10px", opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
          >
            <svg width="8" height="10" viewBox="0 0 8 10" fill="#C9A84C">
              <path d="M4 0L8 5L4 10L0 5L4 0Z" />
            </svg>
            {stage >= 2 && stage < 3 && (
              <motion.div
                className="absolute top-3 left-1 w-1.5 h-1.5 bg-[var(--gold)]"
                style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
                animate={{ scale: [0, 1.5, 0] }}
                transition={{ duration: 0.3, repeat: Infinity }}
              />
            )}
          </motion.div>
        </motion.div>

        {/* LAYER 3 & 5 — LOGO + TEXT CONTAINER */}
        <motion.div 
          className="relative flex flex-col items-center justify-center"
          animate={stage >= 4 ? { opacity: 0, scale: 1.1 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeIn" }}
        >

          {/* LOGO REVEAL */}
          <div className="relative" style={{ width: "160px", height: "160px" }}>
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                clipPath: stage >= 1 ? "inset(0% 0% 0% 0%)" : "inset(50% 0% 50% 0%)",
                transition: stage >= 1 ? "clip-path 1.6s cubic-bezier(0.16, 1, 0.3, 1)" : "none"
              }}
            >
              <img 
                src="/logo.png" 
                alt="TajAttire"
                style={{ width: "160px", height: "auto" }}
              />
            </motion.div>
          </div>

          {/* LAYER 5 — TEXT */}
          <div className="flex flex-col items-center mt-5">
            <motion.div
              style={{ fontFamily: 'Inter, sans-serif', letterSpacing: "0.5em" }}
              className="text-[11px] text-[#C9A84C] uppercase"
              initial={{ opacity: 0, y: 10 }}
              animate={stage >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              TAJATTIRE
            </motion.div>
            
            <motion.div
              style={{ fontFamily: '"Cormorant Garamond", serif', letterSpacing: "0.3em" }}
              className="text-[10px] text-[rgba(201,168,76,0.6)] uppercase mt-2 italic"
              initial={{ opacity: 0, y: 8 }}
              animate={stage >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
              HANDCRAFTED HERITAGE
            </motion.div>
          </div>
          
        </motion.div>
      </div>
    </div>
  );
});
