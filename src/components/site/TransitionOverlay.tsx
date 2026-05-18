import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "idle" | "entering" | "exiting";

interface Props {
  phase: Phase;
  isMobile: boolean;
  onEnterComplete: () => void;
  onExitComplete: () => void;
}

export function TransitionOverlay({ phase, isMobile, onEnterComplete, onExitComplete }: Props) {
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  return (
    <AnimatePresence>
      {phase !== "idle" && (
        isMobile ? (
          <motion.div
            key="mobile-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "entering" ? 0.15 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            onAnimationComplete={() => {
              if (phaseRef.current === "entering") onEnterComplete();
              else if (phaseRef.current === "exiting") onExitComplete();
            }}
            style={{
              position: "fixed", inset: 0,
              background: "#C9A84C",
              zIndex: 8900,
              pointerEvents: "none",
            }}
          />
        ) : (
          <motion.div
            key="curtain"
            initial={{ x: "-100%" }}
            animate={{ x: phase === "entering" ? "0%" : "100%" }}
            transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
            onAnimationComplete={() => {
              if (phaseRef.current === "entering") onEnterComplete();
              else if (phaseRef.current === "exiting") onExitComplete();
            }}
            style={{
              position: "fixed", inset: 0,
              background: "#1A5C38",
              zIndex: 8900,
              pointerEvents: "none",
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                height: "1.5px",
                background: "#C9A84C",
                transform: "translateY(-50%)",
              }}
            />
          </motion.div>
        )
      )}
    </AnimatePresence>
  );
}
