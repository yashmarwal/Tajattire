import { useState } from "react";
import { SmoothScroll, CustomCursor } from "@/components/site/SmoothScroll";
import { motion, useScroll } from "framer-motion";
import { Preloader } from "@/components/site/Preloader";
import { Navbar } from "@/components/site/Navbar";
import {
  Hero, Marquee, Statement, Collections, Catalogue, CustomOrder, Craft, Why, Stats,
  HowItWorks, Testimonials, CtaBand, Inquiry, Footer, FactoryVisitPopup, FloatingWhatsApp
} from "@/components/site/Sections";

export default function App() {
  const [ready, setReady] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  const { scrollYProgress } = useScroll();

  return (
    <main className="relative bg-cloud grain-fixed">
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#C9A84C] z-[8500]"
        style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
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
      <FloatingWhatsApp />
    </main>
  );
}
