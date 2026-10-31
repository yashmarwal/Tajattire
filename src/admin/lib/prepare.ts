import { useQuery } from "@tanstack/react-query";
import { getSettings } from "@/lib/adminApi";
import { convertHeicIfNeeded } from "./heic";
import { compressImage, DEFAULT_BUDGET_KB, type CompressResult } from "./compress";

/** The owner-configurable size budget (Settings → Image compression). */
export function useImageBudgetKb(): number {
  const { data } = useQuery({ queryKey: ["settings"], queryFn: getSettings });
  const n = Number(data?.image_budget_kb);
  return Number.isFinite(n) && n >= 80 && n <= 5000 ? n : DEFAULT_BUDGET_KB;
}

/** HEIC → JPEG, then compress within the budget. Non-images pass straight through. */
export async function prepareForUpload(file: File, budgetKb: number): Promise<CompressResult> {
  const isHeic =
    /\.hei[cf]$/i.test(file.name) || file.type === "image/heic" || file.type === "image/heif";
  const base = isHeic ? await convertHeicIfNeeded(file) : file;
  if (!base.type.startsWith("image/"))
    return { file: base, before: file.size, after: base.size, skipped: "not an image" };
  const r = await compressImage(base, { maxBytes: budgetKb * 1024 });
  return { ...r, before: file.size };
}
