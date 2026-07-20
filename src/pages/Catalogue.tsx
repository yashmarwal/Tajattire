import { Catalogue as CatalogueSection } from "@/components/site/Sections";
import { PageMeta } from "@/components/site/PageMeta";

export default function Catalogue() {
  return (
    <>
      <PageMeta
        title="Wholesale Catalogue — Every Design, Ready to Ship | TajAttire"
        description="Browse TajAttire's full wholesale catalogue of kurtis, gowns and tops — 500+ designs ready to ship, MOQ 100, starting ₹180."
        path="/catalogue"
      />
      <CatalogueSection />
    </>
  );
}
