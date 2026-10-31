import { PageMeta } from "@/components/site/PageMeta";
import { Testimonials, InstagramGrid } from "@/components/site/sections/People";

export default function Reviews() {
  return (
    <>
      <PageMeta path="/reviews" />
      <Testimonials />
      <InstagramGrid />
    </>
  );
}
