import { PageMeta } from "@/components/site/PageMeta";
import {
  Craft as CraftSection,
  Why,
  SustainabilitySection,
  ManufacturingTeaser,
  HowItWorks,
} from "@/components/site/sections/Story";

export default function Craft() {
  return (
    <>
      <PageMeta path="/craft" />
      <CraftSection />
      {/* The section after the stacking cards slides up over the last card */}
      <Why
        next={
          <>
            <SustainabilitySection />
            <ManufacturingTeaser />
          </>
        }
      />
      <HowItWorks />
    </>
  );
}
