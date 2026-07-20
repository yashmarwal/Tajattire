import { Hero, Marquee, Statement, Collections, Catalogue, Stats, CtaBand, SectionBlend } from "@/components/site/Sections";
import { PageMeta } from "@/components/site/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="TajAttire — Handcrafted Heritage | Wholesale Kurtis, Gowns & Tops"
        description="India's most trusted wholesale partner for kurtis, gowns and contemporary tops. 500+ designs. MOQ 100. Starting ₹180. Pan-India delivery."
        path="/"
      />
      <Hero />
      <Marquee />
      <Statement />
      <Collections />
      <SectionBlend from="black" to="cloud" />
      <Catalogue />
      <Stats />
      <SectionBlend from="cloud" to="emerald" />
      <CtaBand />
    </>
  );
}
