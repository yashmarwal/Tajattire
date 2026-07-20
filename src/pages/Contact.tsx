import { Inquiry } from "@/components/site/Sections";
import { PageMeta } from "@/components/site/PageMeta";

export default function Contact() {
  return (
    <>
      <PageMeta
        title="Ready to Stock Smart? Request Your Catalogue | TajAttire"
        description="Get in touch with TajAttire to request your wholesale catalogue and place your first order — MOQ 100, starting ₹180."
        path="/contact"
      />
      <Inquiry />
    </>
  );
}
