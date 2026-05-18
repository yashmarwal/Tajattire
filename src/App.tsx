import { useState, useCallback } from "react";
import { SmoothScroll, CustomCursor } from "@/components/site/SmoothScroll";
import { motion, useScroll } from "framer-motion";
import { Preloader } from "@/components/site/Preloader";
import { Navbar } from "@/components/site/Navbar";
import { TransitionOverlay } from "@/components/site/TransitionOverlay";
import { PageTransitionContext } from "@/lib/PageTransitionContext";
import { lenisScrollTo } from "@/lib/lenis-store";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Hero, Marquee, Statement, Collections, Catalogue, CustomOrder, Craft, Why, Stats,
  HowItWorks, Testimonials, CtaBand, Inquiry, Footer, FactoryVisitPopup, FloatingWhatsApp
} from "@/components/site/Sections";

type Phase = "idle" | "entering" | "exiting";

export default function App() {
  const [ready, setReady] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const { scrollYProgress } = useScroll();
  const isMobile = useIsMobile();

  const [phase, setPhase] = useState<Phase>("idle");
  const pendingHref = useState<string>("")
  const [href, setHref] = pendingHref;

  const navigate = useCallback((target: string) => {
    if (phase !== "idle") return;
    setHref(target);
    setPhase("entering");
  }, [phase]);

  const handleEnterComplete = useCallback(() => {
    const el = document.querySelector(href);
    if (el) {
      lenisScrollTo(href);
    }
    setPhase("exiting");
  }, [href]);

  const handleExitComplete = useCallback(() => {
    setPhase("idle");
    setHref("");
  }, []);

  return (
    <PageTransitionContext.Provider value={navigate}>
      <main className="relative bg-cloud grain-fixed">
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] bg-[#C9A84C] z-[8500]"
          style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
        />
        <TransitionOverlay
          phase={phase}
          isMobile={isMobile}
          onEnterComplete={handleEnterComplete}
          onExitComplete={handleExitComplete}
        />
        {showPreloader && <Preloader onDone={() => { setReady(true); setTimeout(() => setShowPreloader(false), 500); }} />}
        {ready && <SmoothScroll />}
        <CustomCursor />
        <Navbar />
        <Hero />
        <Marquee />
        <Statement />
        <Collections />
        <Catalogue />
        <CustomOrder />
        <Craft />
        <Why />
        <Stats />
        <HowItWorks />
        <Testimonials />
        <CtaBand />
        <Inquiry />
        <Footer />
        <FactoryVisitPopup />
        {!showPreloader && <FloatingWhatsApp />}
      </main>
    </PageTransitionContext.Provider>
  );
}
