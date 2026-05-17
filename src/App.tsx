import { useState } from "react";
import { SmoothScroll, CustomCursor } from "@/components/site/SmoothScroll";
import { Preloader } from "@/components/site/Preloader";
import { Navbar } from "@/components/site/Navbar";
import {
  Hero, Marquee, Statement, Collections, Craft, Why, Stats,
  HowItWorks, Testimonials, CtaBand, Inquiry, Footer
} from "@/components/site/Sections";

export default function App() {
  const [ready, setReady] = useState(false);
  return (
    <main className="relative bg-cloud grain-fixed">
      <Preloader onDone={() => setReady(true)} />
      {ready && <SmoothScroll />}
      <CustomCursor />
      <Navbar />
      <Hero />
      <Marquee />
      <Statement />
      <Collections />
      <Craft />
      <Why />
      <Stats />
      <HowItWorks />
      <Testimonials />
      <CtaBand />
      <Inquiry />
      <Footer />
    </main>
  );
}
