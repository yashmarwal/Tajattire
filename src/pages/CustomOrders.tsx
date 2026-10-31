import { PageMeta } from "@/components/site/PageMeta";
import { CustomOrder, HowItWorks } from "@/components/site/sections/Story";

export default function CustomOrders() {
  return (
    <>
      <PageMeta path="/custom-orders" />
      <CustomOrder />
      <HowItWorks />
    </>
  );
}
