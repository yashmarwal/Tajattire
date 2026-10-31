import { getSettings, updateSetting } from "@/lib/adminApi";
import { parseProductMeta, mergeCategories, type ProductMeta, type Category } from "@/lib/catalog";

/** Read-modify-write the product labels/homepage flags, always starting from
 * the freshest stored copy so two edits never overwrite each other. */
export async function patchProductMeta(changes: Record<string, Partial<ProductMeta> | null>) {
  const settings = await getSettings();
  const meta = parseProductMeta(settings.product_meta_json);
  for (const [id, patch] of Object.entries(changes)) {
    if (patch === null) {
      delete meta[id];
      continue;
    }
    const next = { ...(meta[id] ?? {}), ...patch };
    if (!next.badge) delete next.badge;
    if (!next.home) delete next.home;
    if (Object.keys(next).length) meta[id] = next;
    else delete meta[id];
  }
  await updateSetting("product_meta_json", JSON.stringify(meta));
  return meta;
}

/** Categories as stored by the admin (only overrides/additions are saved). */
export async function saveCategories(list: Category[]) {
  const payload = list.map(({ name, moq, leadTime, blurb }) => ({
    name,
    moq,
    leadTime,
    ...(blurb ? { blurb } : {}),
  }));
  await updateSetting("categories_json", JSON.stringify(payload));
  return mergeCategories(JSON.stringify(payload));
}
