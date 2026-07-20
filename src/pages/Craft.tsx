import { Craft as CraftSection, Why, SustainabilitySection, ManufacturingTeaser, HowItWorks, SectionBlend } from "@/components/site/Sections";
import { PageMeta } from "@/components/site/PageMeta";

export default function Craft() {
  return (
    <>
      <PageMeta
        title="Our Craft & Manufacturing — Not Just Fabric, A Philosophy | TajAttire"
        description="See how TajAttire designs, manufactures and ships responsibly — from first look to first shipment, and why 1,000+ retailers trust our craft."
        path="/craft"
      />
      <CraftSection />
      <SectionBlend from="cloud" to="emerald" />
      <Why />
      <SustainabilitySection />
      <SectionBlend from="emerald" to="black" />
      <ManufacturingTeaser />
      <SectionBlend from="black" to="cloud" />
      <HowItWorks />
    </>
  );
}
