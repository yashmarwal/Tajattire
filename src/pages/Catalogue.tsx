import { useLocation } from "react-router-dom";
import { PageMeta } from "@/components/site/PageMeta";
import { CatalogueBrowser } from "@/components/site/products/CatalogueBrowser";

export default function Catalogue() {
  const { pathname } = useLocation();
  return (
    <>
      <PageMeta path={pathname.replace(/\/+$/, "")} />
      <CatalogueBrowser />
    </>
  );
}
