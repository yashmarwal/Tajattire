import { PageMeta } from "@/components/site/PageMeta";
import { Hero } from "@/components/site/sections/Hero";
import { Marquee, Statement } from "@/components/site/sections/Intro";
import { Collections, MostLoved, HomePicks } from "@/components/site/sections/HomeProducts";
import { Stats, CtaBand } from "@/components/site/sections/Story";

export default function Home() {
  return (
    <>
      <PageMeta path="/" />
      <Hero />
      <Marquee />
      <Statement />
      <Collections />
      <MostLoved />
      <HomePicks />
      <Stats />
      <CtaBand />
    </>
  );
}
