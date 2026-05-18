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

  // Animation controls for the mobile shutter halves
  const topCtrl = useAnimation();
  const botCtrl = useAnimation();

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mobile: drive the shutter sequence imperatively
  useEffect(() => {
    if (!isMobile) return;

    if (reducedMotion) {
      // No visual transition — just advance the state machine instantly
      if (phase === "entering") onEnterRef.current();
      else if (phase === "exiting") onExitRef.current();
      return;
    }

    if (phase === "entering") {
      // Both halves slide OUT simultaneously (0.2s)
      Promise.all([
        topCtrl.start({ y: "-100%", transition: { duration: 0.2, ease: [0.9, 0, 0.2, 1] } }),
        botCtrl.start({ y: "100%",  transition: { duration: 0.2, ease: [0.9, 0, 0.2, 1] } }),
      ]).then(() => {
        onEnterRef.current(); // triggers scroll + sets phase to "exiting"
      });
    } else if (phase === "exiting") {
      // Step 3: slide back IN (0.15s)
      Promise.all([
        topCtrl.start({ y: "0%", transition: { duration: 0.15, ease: [0.2, 0, 0.8, 1] } }),
        botCtrl.start({ y: "0%", transition: { duration: 0.15, ease: [0.2, 0, 0.8, 1] } }),
      ]).then(() =>
        // Step 4: slide back OUT (0.15s)
        Promise.all([
          topCtrl.start({ y: "-100%", transition: { duration: 0.15, ease: [0.9, 0, 0.2, 1] } }),
          botCtrl.start({ y: "100%",  transition: { duration: 0.15, ease: [0.9, 0, 0.2, 1] } }),
        ])
      ).then(() => {
        onExitRef.current(); // sets phase to "idle" → halves unmount
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, isMobile]);

  // ── Desktop curtain ──────────────────────────────────────────────────────
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

  // ── Mobile: no visual when reduced-motion ────────────────────────────────
  if (reducedMotion) return null;

  // ── Mobile camera-shutter ────────────────────────────────────────────────
  return phase !== "idle" ? (
    <>
      {/* Gold hairline at split point — revealed while halves are apart */}
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: 0,
          right: 0,
          height: "1.5px",
          background: "#C9A84C",
          zIndex: 8897,
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }}
      />
      {/* Top half */}
      <motion.div
        animate={topCtrl}
        initial={{ y: "0%" }}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          height: "50%",
          background: "#0A0A0A",
          zIndex: 8898,
          pointerEvents: "none",
        }}
      />
      {/* Bottom half */}
      <motion.div
        animate={botCtrl}
        initial={{ y: "0%" }}
        style={{
          position: "fixed",
          bottom: 0, left: 0, right: 0,
          height: "50%",
          background: "#0A0A0A",
          zIndex: 8898,
          pointerEvents: "none",
        }}
      />
    </>
  ) : null;
}
