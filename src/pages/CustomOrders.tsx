import { CustomOrder } from "@/components/site/Sections";
import { PageMeta } from "@/components/site/PageMeta";

export default function CustomOrders() {
  return (
    <>
      <PageMeta
        title="Custom Private Label Orders — Build Something Yours | TajAttire"
        description="Custom collections and private-label manufacturing for kurtis, gowns and tops — build a range that's uniquely yours with TajAttire."
        path="/custom-orders"
      />
      <CustomOrder />
    </>
  );
}
