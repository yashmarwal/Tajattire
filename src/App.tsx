import { useState, useCallback, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { motion, useScroll } from "framer-motion";
import { Preloader } from "@/components/site/Preloader";
import { Navbar } from "@/components/site/Navbar";
import { PageTransitionProvider } from "@/lib/PageTransitionContext";
import { Footer, FactoryVisitPopup } from "@/components/site/Sections";
import { StickyCtaBar } from "@/components/site/StickyCtaBar";
import { AiHelpAgent } from "@/components/site/AiHelpAgent";

const FloatingWhatsApp = lazy(() => import("@/components/site/Sections").then((m) => ({ default: m.FloatingWhatsApp })));
const FloatingCall = lazy(() => import("@/components/site/Sections").then((m) => ({ default: m.FloatingCall })));

const Home = lazy(() => import("@/pages/Home"));
const Catalogue = lazy(() => import("@/pages/Catalogue"));
const CustomOrders = lazy(() => import("@/pages/CustomOrders"));
const Craft = lazy(() => import("@/pages/Craft"));
const Reviews = lazy(() => import("@/pages/Reviews"));
const Faq = lazy(() => import("@/pages/Faq"));
const Contact = lazy(() => import("@/pages/Contact"));

export default function App() {
  // App mounts once per full page load — React Router swaps <Route> content
  // in place without remounting the Layout, so this already only plays once
  // per visit and doesn't replay on internal link navigation.
  const [ready, setReady] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const { scrollYProgress } = useScroll();

  const handlePreloaderDone = useCallback(() => {
    setReady(true);
    setTimeout(() => setShowPreloader(false), 500);
  }, []);

  return (
    <PageTransitionProvider>
      <main className="relative bg-cloud grain-fixed">
        <motion.div
          className="fixed top-0 left-0 right-0 h-[2px] bg-[#C9A84C] z-[8500]"
          style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
        />
        {showPreloader && <Preloader onDone={handlePreloaderDone} />}
        {ready && <SmoothScroll />}
        <Navbar />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogue" element={<Catalogue />} />
            <Route path="/custom-orders" element={<CustomOrders />} />
            <Route path="/craft" element={<Craft />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
        <Footer />
        <FactoryVisitPopup />
        {!showPreloader && (
          <Suspense fallback={null}>
            <FloatingWhatsApp />
            <FloatingCall />
          </Suspense>
        )}
        {!showPreloader && <StickyCtaBar />}
        {!showPreloader && <AiHelpAgent />}
      </main>
    </PageTransitionProvider>
  );
}
