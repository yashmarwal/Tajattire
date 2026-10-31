import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSettings, updateSetting } from "@/lib/adminApi";
import { mergeCategories, slugify, type Category } from "@/lib/catalog";
import { saveCategories } from "../lib/productMeta";
import { DEFAULT_BUDGET_KB } from "../lib/compress";
import { ConfirmDialog } from "./ConfirmDialog";
import terms from "@/data/terms.json";

const inputCls =
  "w-full bg-[#0A0A0A] border border-[rgba(201,168,76,0.2)] text-[#F8F6F1] px-3 py-2 text-sm focus:outline-none focus:border-[#C9A84C]";
const BUILT_IN = new Set(terms.categories.map((c) => c.name.toLowerCase()));

/** One place for categories. Adding one here makes it appear in the site's
 * filters, product cards, enquiry form, footer and minimum-order table. */
export function CategoriesCard() {
  const qc = useQueryClient();
  const { data: settings = {} } = useQuery({ queryKey: ["settings"], queryFn: getSettings });
  const current = useMemo(
    () => mergeCategories(settings.categories_json),
    [settings.categories_json],
  );
  const [rows, setRows] = useState<Category[]>(current);
  const [saving, setSaving] = useState(false);
  const [removeIdx, setRemoveIdx] = useState<number | null>(null);
  useEffect(() => setRows(current), [current]);

  const dirty = JSON.stringify(rows) !== JSON.stringify(current);
  const update = (i: number, patch: Partial<Category>) =>
    setRows((r) => r.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  const add = () =>
    setRows((r) => [
      ...r,
      {
        name: "",
        slug: "",
        moq: terms.defaultCategory.moq,
        leadTime: terms.defaultCategory.leadTime,
      },
    ]);

  const save = async () => {
    const clean = rows.map((r) => ({ ...r, name: r.name.trim() })).filter((r) => r.name);
    const names = clean.map((r) => r.name.toLowerCase());
    if (new Set(names).size !== names.length)
      return toast.error("Two categories have the same name.");
    if (clean.some((r) => !slugify(r.name)))
      return toast.error("Category names need at least one letter or number.");
    setSaving(true);
    try {
      await saveCategories(clean);
      toast.success("Categories saved — the site updates within a minute");
      qc.invalidateQueries({ queryKey: ["settings"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#141414] border border-[rgba(201,168,76,0.08)]">
      <div className="px-6 py-4 border-b border-white/5">
        <h3 className="text-[#C9A84C] text-[10px] uppercase tracking-[0.3em] font-medium">
          Categories & minimum orders
        </h3>
        <p className="text-[rgba(248,246,241,0.45)] text-xs mt-1">
          Used everywhere on the site: filters, product cards, the enquiry form, the assistant and
          the terms page.
        </p>
      </div>
      <div className="p-6 space-y-3">
        <div className="hidden sm:grid grid-cols-[1.4fr_1fr_1fr_auto] gap-2 text-[10px] uppercase tracking-[0.2em] text-[rgba(248,246,241,0.4)]">
          <span>Name</span>
          <span>Minimum order</span>
          <span>Dispatch time</span>
          <span className="w-8" />
        </div>
        {rows.map((c, i) => {
          const builtIn = BUILT_IN.has(c.name.toLowerCase()) && i < terms.categories.length;
          return (
            <div key={i} className="grid sm:grid-cols-[1.4fr_1fr_1fr_auto] gap-2 items-center">
              <input
                aria-label="Category name"
                value={c.name}
                disabled={builtIn}
                onChange={(e) => update(i, { name: e.target.value })}
                placeholder="e.g. Co-ord sets"
                className={`${inputCls} disabled:opacity-60`}
              />
              <input
                aria-label="Minimum order"
                value={c.moq}
                onChange={(e) => update(i, { moq: e.target.value })}
                placeholder="100 pcs"
                className={inputCls}
              />
              <input
                aria-label="Dispatch time"
                value={c.leadTime}
                onChange={(e) => update(i, { leadTime: e.target.value })}
                placeholder="7–15 days"
                className={inputCls}
              />
              <button
                type="button"
                disabled={builtIn}
                onClick={() => setRemoveIdx(i)}
                aria-label={`Remove ${c.name || "category"}`}
                title={builtIn ? "Built-in categories can't be removed" : "Remove"}
                className="w-8 h-9 text-red-400 border border-red-500/25 disabled:opacity-20"
              >
                ✕
              </button>
            </div>
          );
        })}
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            onClick={add}
            className="px-4 py-2 text-[11px] uppercase tracking-[0.12em] border border-[#C9A84C]/40 text-[#C9A84C]"
          >
            + Add category
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!dirty || saving}
            className="px-4 py-2 text-[11px] uppercase tracking-[0.12em] bg-[#C9A84C] text-[#0A0A0A] font-bold disabled:opacity-40"
          >
            {saving ? "Saving…" : "Save categories"}
          </button>
        </div>
      </div>
      <ConfirmDialog
        open={removeIdx !== null}
        title="Remove this category?"
        message="Products already in it keep their category name but it will no longer appear as a filter. Press Save afterwards to apply."
        confirmText="Remove"
        onConfirm={() => {
          setRows((r) => r.filter((_, j) => j !== removeIdx));
          setRemoveIdx(null);
        }}
        onCancel={() => setRemoveIdx(null)}
      />
    </div>
  );
}

/** Size budget used by the automatic compression on every upload. */
export function CompressionCard() {
  const qc = useQueryClient();
  const { data: settings = {} } = useQuery({ queryKey: ["settings"], queryFn: getSettings });
  const [kb, setKb] = useState(String(settings.image_budget_kb || DEFAULT_BUDGET_KB));
  useEffect(
    () => setKb(String(settings.image_budget_kb || DEFAULT_BUDGET_KB)),
    [settings.image_budget_kb],
  );
  const n = Number(kb);
  const valid = Number.isFinite(n) && n >= 80 && n <= 5000;
  return (
    <div className="bg-[#141414] border border-[rgba(201,168,76,0.08)] p-6">
      <h3 className="text-[#C9A84C] text-[10px] uppercase tracking-[0.3em] font-medium">
        Photo compression
      </h3>
      <p className="text-[rgba(248,246,241,0.5)] text-xs mt-1 mb-4">
        Every photo you upload is resized and saved as WebP to about this size, without visible
        quality loss. GIFs, animated images and videos are never changed.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-[#F8F6F1]">
          Target size
          <input
            type="number"
            min={80}
            max={5000}
            step={10}
            value={kb}
            onChange={(e) => setKb(e.target.value)}
            className={`${inputCls} !w-28`}
            aria-describedby="budget-hint"
          />
          KB
        </label>
        <button
          type="button"
          disabled={!valid || n === Number(settings.image_budget_kb || DEFAULT_BUDGET_KB)}
          onClick={async () => {
            try {
              await updateSetting("image_budget_kb", String(Math.round(n)));
              toast.success("Compression target saved");
              qc.invalidateQueries({ queryKey: ["settings"] });
            } catch {
              toast.error("Couldn't save");
            }
          }}
          className="px-4 py-2 text-[11px] uppercase tracking-[0.12em] bg-[#C9A84C] text-[#0A0A0A] font-bold disabled:opacity-40"
        >
          Save
        </button>
      </div>
      <p
        id="budget-hint"
        className={`text-[11px] mt-2 ${valid ? "text-[rgba(248,246,241,0.35)]" : "text-red-400"}`}
      >
        {valid
          ? "300–500 KB suits product photos; use more for full-screen hero images."
          : "Enter a number between 80 and 5000."}
      </p>
    </div>
  );
}
