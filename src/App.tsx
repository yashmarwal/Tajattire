import { useState } from "react";
import { SmoothScroll, CustomCursor } from "@/components/site/SmoothScroll";
import { Preloader } from "@/components/site/Preloader";
import { Navbar } from "@/components/site/Navbar";
import {
  Hero, Marquee, Statement, Collections, Catalogue, CustomOrder, Craft, Why, Stats,
  HowItWorks, Testimonials, CtaBand, Inquiry, Footer, FactoryVisitPopup, FloatingWhatsApp
} from "@/components/site/Sections";

export default function App() {
  const [ready, setReady] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);
  return (
    <main className="relative bg-cloud grain-fixed">
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
