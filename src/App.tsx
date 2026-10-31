import { useState, useCallback, useEffect, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { Preloader } from "@/components/site/Preloader";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Dock } from "@/components/site/Dock";
import { AiHelpAgent } from "@/components/site/AiHelpAgent";
import { FactoryVisitPopup } from "@/components/site/sections/Contact";
import { PageTransitionProvider } from "@/lib/PageTransitionContext";
import { IntroContext, shouldPlayIntro, markIntroSeen } from "@/lib/intro";
import { PAGES, prefetchAllPagesWhenIdle } from "@/lib/routes";

/** Reserves the viewport while a page chunk loads, so the footer never jumps up. */
const PageFallback = () => <div className="min-h-[100svh] bg-deep-black" aria-hidden="true" />;

export default function App() {
  const [playIntro] = useState(shouldPlayIntro);
  const [introDone, setIntroDone] = useState(!playIntro);
  const [showPreloader, setShowPreloader] = useState(playIntro);

  const onReveal = useCallback(() => {
    setIntroDone(true);
    markIntroSeen();
  }, []);
  const onDone = useCallback(() => setShowPreloader(false), []);

  useEffect(() => {
    prefetchAllPagesWhenIdle();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <IntroContext.Provider value={introDone}>
        <PageTransitionProvider>
          <div className="relative bg-deep-black">
            {showPreloader && <Preloader onReveal={onReveal} onDone={onDone} />}
            <SmoothScroll />
            <Navbar />
            <main id="main">
              <Suspense fallback={<PageFallback />}>
                <Routes>
                  <Route path="/" element={<PAGES.home.Component />} />
                  <Route path="/catalogue" element={<PAGES.catalogue.Component />} />
                  <Route path="/catalogue/:category" element={<PAGES.catalogue.Component />} />
                  <Route path="/custom-orders" element={<PAGES.customOrders.Component />} />
                  <Route path="/craft" element={<PAGES.craft.Component />} />
                  <Route path="/reviews" element={<PAGES.reviews.Component />} />
                  <Route path="/faq" element={<PAGES.faq.Component />} />
                  <Route path="/contact" element={<PAGES.contact.Component />} />
                  <Route path="/privacy" element={<PAGES.privacy.Component />} />
                  <Route path="/terms" element={<PAGES.terms.Component />} />
                  <Route path="*" element={<PAGES.notFound.Component />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
            <Dock />
            <AiHelpAgent />
            {introDone && <FactoryVisitPopup />}
          </div>
        </PageTransitionProvider>
      </IntroContext.Provider>
    </MotionConfig>
  );
}
