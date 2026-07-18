import { useState, useCallback, useEffect } from "react";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { motion, useScroll } from "framer-motion";
import { Preloader } from "@/components/site/Preloader";
import { Navbar } from "@/components/site/Navbar";
import { TransitionOverlay } from "@/components/site/TransitionOverlay";
import { PageTransitionContext } from "@/lib/PageTransitionContext";
import { lenisScrollTo } from "@/lib/lenis-store";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Hero, Marquee, Statement, Collections, Catalogue, CustomOrder, Craft, Why, Stats,
  HowItWorks, Testimonials, CtaBand, Inquiry, Footer, FactoryVisitPopup, FloatingWhatsApp, FloatingCall,
  SustainabilitySection, ManufacturingTeaser, InstagramGrid, FAQ, SectionBlend,
} from "@/components/site/Sections";
import { StickyCtaBar } from "@/components/site/StickyCtaBar";
import { AiHelpAgent } from "@/components/site/AiHelpAgent";

type Phase = "idle" | "entering" | "exiting";

// Section order for back/forward tracking
const SECTIONS = ["#top", "#collections", "#catalogue", "#craft", "#order", "#connect"];

export default function App() {
  const [ready, setReady] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const { scrollYProgress } = useScroll();
  const isMobile = useIsMobile();

  const handlePreloaderDone = useCallback(() => {
    setReady(true);
    setTimeout(() => setShowPreloader(false), 500);
    // Push the initial history state so back from #top goes to previous real page
    window.history.replaceState({ section: "#top" }, "", window.location.pathname);
  }, []);

  const [phase, setPhase] = useState<Phase>("idle");
  const [href, setHref] = useState<string>("");

  const navigate = useCallback((target: string) => {
    // Push a history state so browser back/forward works between sections
    const currentSection = (window.history.state as Record<string, string> | null)?.section ?? "#top";
    if (currentSection !== target) {
      window.history.pushState({ section: target }, "", window.location.pathname + (target === "#top" ? "" : target));
    }

    if (isMobile) {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (phase !== "idle") return;
    setHref(target);
    setPhase("entering");
  }, [phase, isMobile]);

  // Handle browser back/forward — scroll to the section stored in history state
  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      const state = e.state as Record<string, string> | null;
      // Overlay/modal entries (pushed by useBackToClose) don't carry section
      // info — an overlay closing shouldn't move scroll position.
      if ((e.state as Record<string, unknown>)?.overlay) return;

      const target = state?.section ?? "#top";
      const el = document.querySelector(target);
      if (el) {
        if (isMobile) {
          el.scrollIntoView({ behavior: "smooth" });
        } else {
          lenisScrollTo(target);
        }
      }
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [isMobile]);

  // Also track scroll position to keep history state in sync with where user scrolled manually
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        let current = "#top";
        for (const id of SECTIONS) {
          const el = document.querySelector(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.5) current = id;
          }
        }
        const stateSection = (window.history.state as Record<string, string> | null)?.section;
        if (stateSection !== current) {
          window.history.replaceState(
            { section: current },
            "",
            window.location.pathname + (current === "#top" ? "" : current)
          );
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
          onEnterComplete={handleEnterComplete}
          onExitComplete={handleExitComplete}
        />
        {showPreloader && <Preloader onDone={handlePreloaderDone} />}
        {ready && <SmoothScroll />}
        <Navbar />
        <Hero />
        <Marquee />
        <Statement />
        <Collections />
        <SectionBlend from="black" to="cloud" />
        <Catalogue />
        <SectionBlend from="cloud" to="emerald" />
        <CustomOrder />
        <SectionBlend from="emerald" to="cloud" />
        <Craft />
        <SectionBlend from="cloud" to="emerald" />
        <Why />
        <SectionBlend from="emerald" to="cloud" />
        <Stats />
        <SectionBlend from="cloud" to="emerald" />
        <SustainabilitySection />
        <SectionBlend from="emerald" to="cloud" />
        <HowItWorks />
        <SectionBlend from="cloud" to="black" />
        <ManufacturingTeaser />
        <SectionBlend from="black" to="emerald" />
        <Testimonials />
        <SectionBlend from="emerald" to="cloud" />
        <InstagramGrid />
        <SectionBlend from="cloud" to="emerald" />
        <CtaBand />
        <SectionBlend from="emerald" to="cloud" />
        <FAQ />
        <Inquiry />
        <SectionBlend from="cloud" to="black" />
        <Footer />
        <FactoryVisitPopup />
        {!showPreloader && <FloatingWhatsApp />}
        {!showPreloader && <FloatingCall />}
        {!showPreloader && <StickyCtaBar />}
        {!showPreloader && <AiHelpAgent />}
      </main>
    </PageTransitionContext.Provider>
  );
}
