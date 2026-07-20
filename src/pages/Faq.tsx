import { FAQ } from "@/components/site/Sections";
import { PageMeta } from "@/components/site/PageMeta";

export default function Faq() {
  return (
    <>
      <PageMeta
        title="Frequently Asked Questions | TajAttire"
        description="Answers to common questions about TajAttire's wholesale kurtis, gowns and tops — MOQ, pricing, shipping and ordering."
        path="/faq"
      />
      <FAQ />
    </>
  );
}
