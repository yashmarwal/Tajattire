import { useRef, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

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

  const onEnterRef = useRef(onEnterComplete);
  onEnterRef.current = onEnterComplete;

  const onExitRef = useRef(onExitComplete);
  onExitRef.current = onExitComplete;

  const inkCtrl = useAnimation();

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mobile: drive the ink-drop sequence imperatively
  useEffect(() => {
    if (!isMobile) return;

    if (reducedMotion) {
      if (phase === "entering") onEnterRef.current();
      else if (phase === "exiting") onExitRef.current();
      return;
    }

    if (phase === "entering") {
      inkCtrl
        .start({ scale: 4, transition: { duration: 0.35, ease: [0.2, 0, 0.0, 1] } })
        .then(() => onEnterRef.current());
    } else if (phase === "exiting") {
      inkCtrl
        .start({ scale: 0, transition: { duration: 0.35, ease: [0.2, 0, 0.0, 1] } })
        .then(() => onExitRef.current());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, isMobile]);

  // ── Desktop curtain (unchanged) ──────────────────────────────────────────
  if (!isMobile) {
    return (
      <AnimatePresence>
        {phase !== "idle" && (
          <motion.div
            key="curtain"
            initial={{ x: "-100%" }}
            animate={{ x: phase === "entering" ? "0%" : "100%" }}
            transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
            onAnimationComplete={() => {
              if (phaseRef.current === "entering") onEnterRef.current();
              else if (phaseRef.current === "exiting") onExitRef.current();
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
        )}
      </AnimatePresence>
    );
  }

  // ── Mobile: reduced-motion → no visual ──────────────────────────────────
  if (reducedMotion) return null;

  // ── Mobile: liquid gold ink-drop ────────────────────────────────────────
  return phase !== "idle" ? (
    <motion.div
      animate={inkCtrl}
      initial={{ scale: 0 }}
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        x: "-50%",
        y: "-50%",
        width: "100vmax",
        height: "100vmax",
        borderRadius: "50%",
        background: "rgba(201,168,76,0.9)",
        zIndex: 8900,
        pointerEvents: "none",
        transformOrigin: "center center",
      }}
    />
  ) : null;
}
