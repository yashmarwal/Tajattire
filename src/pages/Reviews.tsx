import { Testimonials, InstagramGrid, SectionBlend } from "@/components/site/Sections";
import { PageMeta } from "@/components/site/PageMeta";

export default function Reviews() {
  return (
    <>
      <PageMeta
        title="Reviews — 1,000+ Retailers, One Thing in Common | TajAttire"
        description="Read what 1,000+ retailers say about stocking TajAttire's wholesale kurtis, gowns and tops, plus a look at @TajAttire on Instagram."
        path="/reviews"
      />
      <Testimonials />
      <SectionBlend from="emerald" to="cloud" />
      <InstagramGrid />
    </>
  );
}
