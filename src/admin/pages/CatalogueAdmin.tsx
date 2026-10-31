import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getCatalogueItems,
  createCatalogueItem,
  updateCatalogueItem,
  deleteCatalogueItem,
  getSettings,
} from "@/lib/adminApi";
import { mergeCategories, parseProductMeta, BADGES, type Badge } from "@/lib/catalog";
import { ImageUpload } from "../components/ImageUpload";
import { BulkUpload } from "../components/BulkUpload";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { CatalogueGridSkeleton } from "../components/Skeleton";
import { patchProductMeta } from "../lib/productMeta";
import { deleteStoredFile } from "../lib/upload";
import type { CatalogueItem } from "@/lib/siteData";

const DEFAULT_PRICE = "₹180 onwards · MOQ 100 pcs";
type Form = Omit<CatalogueItem, "id" | "created_at"> & { badge: Badge | ""; home: boolean };
const blank = (category: string, position: number): Form => ({
  name: "",
  category,
  image_url: "",
  label: "",
  price: DEFAULT_PRICE,
  position,
  active: true,
  badge: "",
  home: false,
});

const inputCls =
  "w-full bg-[#0A0A0A] border border-[rgba(201,168,76,0.2)] text-[#F8F6F1] px-3.5 py-2.5 text-sm placeholder:text-[rgba(248,246,241,0.25)] focus:outline-none focus:border-[#C9A84C]";
const chip = (on: boolean) =>
  `px-3 py-1.5 text-[11px] transition-colors ${on ? "bg-[#C9A84C] text-[#0A0A0A] font-semibold" : "border border-[rgba(201,168,76,0.2)] text-[rgba(248,246,241,0.6)] hover:border-[#C9A84C] hover:text-[#F8F6F1]"}`;

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-[0.22em] text-[#C9A84C] mb-1.5">
        {label}
      </span>
      {children}
      {hint && <span className="block text-[10px] text-[rgba(248,246,241,0.35)] mt-1">{hint}</span>}
    </label>
  );
}

const prettyName = (file: string) =>
  file
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .slice(0, 80) || "New product";

export function CatalogueAdmin() {
  const qc = useQueryClient();
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-catalogue"],
    queryFn: () => getCatalogueItems(undefined, true),
  });
  const { data: settings = {} } = useQuery({ queryKey: ["settings"], queryFn: getSettings });
  const categories = useMemo(
    () => mergeCategories(settings.categories_json),
    [settings.categories_json],
  );
  const meta = useMemo(
    () => parseProductMeta(settings.product_meta_json),
    [settings.product_meta_json],
  );

  const [filter, setFilter] = useState<string>("All");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<CatalogueItem | null>(null);
  const [form, setForm] = useState<Form>(blank("Kurtis", 0));
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<{ ids: string[] } | null>(null);
  const [showBulkAdd, setShowBulkAdd] = useState(false);
  const [bulkCategory, setBulkCategory] = useState(categories[0]?.name ?? "Kurtis");
  const [dragId, setDragId] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  const sorted = useMemo(() => [...items].sort((a, b) => a.position - b.position), [items]);
  const displayed =
    filter === "All"
      ? sorted
      : sorted.filter((i) => i.category.toLowerCase() === filter.toLowerCase());
  const nextPosition = sorted.length ? Math.max(...sorted.map((i) => i.position)) + 1 : 0;

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-catalogue"] });
    qc.invalidateQueries({ queryKey: ["catalogue"] });
    qc.invalidateQueries({ queryKey: ["settings"] });
  };

  const saveM = useMutation({
    mutationFn: async (f: Form) => {
      const { badge, home, ...row } = f;
      const saved =
        modal === "edit" && editing
          ? await updateCatalogueItem(editing.id, row)
          : await createCatalogueItem(row);
      await patchProductMeta({
        [editing && modal === "edit" ? editing.id : saved.id]: { badge, home },
      });
      // The old photo is removed only once the product really points at the new one
      if (modal === "edit" && editing && editing.image_url && editing.image_url !== row.image_url)
        void deleteStoredFile(editing.image_url);
      return saved;
    },
    onSuccess: () => {
      refresh();
      toast.success(modal === "edit" ? "Product updated" : "Product added");
      setModal(null);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't save"),
  });

  const openAdd = () => {
    setForm(blank(filter !== "All" ? filter : (categories[0]?.name ?? "Kurtis"), nextPosition));
    setEditing(null);
    setModal("add");
  };
  const openEdit = (it: CatalogueItem) => {
    setForm({
      name: it.name,
      category: it.category,
      image_url: it.image_url,
      label: it.label,
      price: it.price,
      position: it.position,
      active: it.active,
      badge: meta[it.id]?.badge ?? "",
      home: !!meta[it.id]?.home,
    });
    setEditing(it);
    setModal("edit");
  };

  /* ── selection + bulk actions ── */
  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const allVisibleSelected = displayed.length > 0 && displayed.every((i) => selected.has(i.id));
  const ids = [...selected];

  const bulk = async (label: string, fn: () => Promise<unknown>) => {
    setWorking(true);
    try {
      await fn();
      toast.success(label);
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setWorking(false);
    }
  };
  const bulkUpdate = (updates: Partial<CatalogueItem>, label: string) =>
    bulk(label, () => Promise.all(ids.map((id) => updateCatalogueItem(id, updates))));
  const bulkMeta = (patch: { badge?: Badge | ""; home?: boolean }, label: string) =>
    bulk(label, () => patchProductMeta(Object.fromEntries(ids.map((id) => [id, patch]))));
  const doDelete = (delIds: string[]) =>
    bulk(`${delIds.length} product${delIds.length > 1 ? "s" : ""} removed`, async () => {
      const victims = items.filter((i) => delIds.includes(i.id));
      for (const v of victims) await deleteCatalogueItem(v.id);
      await patchProductMeta(Object.fromEntries(delIds.map((id) => [id, null])));
      for (const v of victims) void deleteStoredFile(v.image_url);
      setSelected(new Set());
      setConfirm(null);
    });

  /* ── reorder (drag on desktop, arrows everywhere) ── */
  const persistOrder = async (order: CatalogueItem[]) => {
    const changed = order.map((it, i) => ({ it, i })).filter(({ it, i }) => it.position !== i);
    if (!changed.length) return;
    qc.setQueryData<CatalogueItem[]>(
      ["admin-catalogue"],
      order.map((it, i) => ({ ...it, position: i })),
    );
    try {
      await Promise.all(changed.map(({ it, i }) => updateCatalogueItem(it.id, { position: i })));
      toast.success("Order saved");
      qc.invalidateQueries({ queryKey: ["catalogue"] });
    } catch {
      toast.error("Couldn't save the new order");
      qc.invalidateQueries({ queryKey: ["admin-catalogue"] });
    }
  };
  const moveTo = (id: string, beforeId: string | null) => {
    const order = sorted.filter((i) => i.id !== id);
    const moving = sorted.find((i) => i.id === id);
    if (!moving) return;
    const at = beforeId ? order.findIndex((i) => i.id === beforeId) : order.length;
    order.splice(at < 0 ? order.length : at, 0, moving);
    void persistOrder(order);
  };
  const nudge = (id: string, dir: -1 | 1) => {
    const vis = displayed;
    const idx = vis.findIndex((i) => i.id === id);
    const target = vis[idx + dir];
    if (!target) return;
    if (dir === -1) moveTo(id, target.id);
    else
      moveTo(
        id,
        vis[idx + 2]?.id ?? sorted[sorted.findIndex((i) => i.id === target.id) + 1]?.id ?? null,
      );
  };

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[#F8F6F1] font-medium">Products</h2>
          <p className="text-[rgba(248,246,241,0.4)] text-xs mt-0.5">
            {items.length} total · {items.filter((i) => i.active).length} visible · drag cards (or
            use ◀ ▶) to change the order on the site
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowBulkAdd((v) => !v)}
            className="border border-[#C9A84C]/40 text-[#C9A84C] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] hover:bg-[#C9A84C]/10"
          >
            {showBulkAdd ? "Close" : "Add many"}
          </button>
          <button
            id="add-product-btn"
            type="button"
            onClick={openAdd}
            className="bg-[#C9A84C] text-[#0A0A0A] px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] hover:bg-[#D4B55A]"
          >
            + Add product
          </button>
        </div>
      </div>

      {showBulkAdd && (
        <div className="bg-[#141414] border border-[rgba(201,168,76,0.12)] p-5 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[#F8F6F1] text-sm">Add one product per photo, in category</span>
            <select
              value={bulkCategory}
              onChange={(e) => setBulkCategory(e.target.value)}
              className={`${inputCls} !w-auto`}
              aria-label="Category for new products"
            >
              {categories.map((c) => (
                <option key={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <BulkUpload
            bucket="product-images"
            hint="The file name becomes the product name — you can edit it afterwards. Photos are optimised automatically."
            onUploaded={async (f) => {
              const position = (qc.getQueryData<CatalogueItem[]>(["admin-catalogue"]) ?? []).reduce(
                (m, i) => Math.max(m, i.position + 1),
                0,
              );
              await createCatalogueItem({
                name: prettyName(f.name),
                category: bulkCategory,
                image_url: f.url,
                label: "",
                price: DEFAULT_PRICE,
                position,
                active: true,
              });
              await qc.invalidateQueries({ queryKey: ["admin-catalogue"] });
              qc.invalidateQueries({ queryKey: ["catalogue"] });
            }}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {["All", ...categories.map((c) => c.name)].map((c) => (
          <button key={c} type="button" onClick={() => setFilter(c)} className={chip(filter === c)}>
            {c} (
            {c === "All"
              ? items.length
              : items.filter((i) => i.category.toLowerCase() === c.toLowerCase()).length}
            )
          </button>
        ))}
      </div>

      {/* Bulk action bar */}
      <div className="sticky top-0 z-20 bg-[#0A0A0A]/95 border border-[rgba(201,168,76,0.12)] px-4 py-3 flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-xs text-[rgba(248,246,241,0.7)] mr-2">
          <input
            type="checkbox"
            className="w-4 h-4 accent-[#C9A84C]"
            checked={allVisibleSelected}
            onChange={() =>
              setSelected(allVisibleSelected ? new Set() : new Set(displayed.map((i) => i.id)))
            }
          />
          {selected.size ? `${selected.size} selected` : "Select all"}
        </label>
        {selected.size > 0 && (
          <>
            <select
              aria-label="Move selected to category"
              className={`${inputCls} !w-auto !py-1.5 text-xs`}
              value=""
              disabled={working}
              onChange={(e) =>
                e.target.value &&
                bulkUpdate({ category: e.target.value }, `Moved to ${e.target.value}`)
              }
            >
              <option value="">Category…</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              aria-label="Label for selected"
              className={`${inputCls} !w-auto !py-1.5 text-xs`}
              value=""
              disabled={working}
              onChange={(e) => {
                const v = e.target.value;
                if (v)
                  bulkMeta(
                    { badge: v === "none" ? "" : (v as Badge) },
                    v === "none" ? "Labels removed" : `Labelled “${v}”`,
                  );
              }}
            >
              <option value="">Label…</option>
              {BADGES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
              <option value="none">No label</option>
            </select>
            <button
              type="button"
              disabled={working}
              onClick={() => bulkMeta({ home: true }, "Shown on homepage")}
              className={chip(false)}
            >
              On homepage
            </button>
            <button
              type="button"
              disabled={working}
              onClick={() => bulkMeta({ home: false }, "Removed from homepage")}
              className={chip(false)}
            >
              Off homepage
            </button>
            <button
              type="button"
              disabled={working}
              onClick={() => bulkUpdate({ active: true }, "Now visible")}
              className={chip(false)}
            >
              Show
            </button>
            <button
              type="button"
              disabled={working}
              onClick={() => bulkUpdate({ active: false }, "Hidden from site")}
              className={chip(false)}
            >
              Hide
            </button>
            <button
              type="button"
              disabled={working}
              onClick={() => setConfirm({ ids })}
              className="px-3 py-1.5 text-[11px] border border-red-500/40 text-red-400 hover:bg-red-500/10"
            >
              Remove…
            </button>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="ml-auto text-[11px] text-[rgba(248,246,241,0.5)] underline"
            >
              Clear
            </button>
          </>
        )}
      </div>

      {isLoading ? (
        <CatalogueGridSkeleton />
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 text-[rgba(248,246,241,0.4)] border border-dashed border-[rgba(201,168,76,0.15)]">
          No products here yet. Use “Add product” or “Add many”.
        </div>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {displayed.map((item, idx) => {
            const m = meta[item.id];
            const isSel = selected.has(item.id);
            return (
              <li
                key={item.id}
                draggable
                onDragStart={(e) => {
                  setDragId(item.id);
                  e.dataTransfer.effectAllowed = "move";
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragId && dragId !== item.id) moveTo(dragId, item.id);
                  setDragId(null);
                }}
                onDragEnd={() => setDragId(null)}
                data-product-id={item.id}
                className={`relative bg-[#141414] border overflow-hidden ${isSel ? "border-[#C9A84C]" : "border-[rgba(201,168,76,0.08)]"} ${!item.active ? "opacity-55" : ""} ${dragId === item.id ? "opacity-40" : ""}`}
              >
                <div className="relative aspect-[3/4] bg-[#1C1C1C]">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt=""
                      loading="lazy"
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  ) : (
                    <div className="grid place-items-center h-full text-xs text-white/25">
                      No image
                    </div>
                  )}
                  <label
                    className="absolute top-2 left-2 w-7 h-7 bg-black/70 grid place-items-center cursor-pointer"
                    title="Select"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 accent-[#C9A84C]"
                      checked={isSel}
                      onChange={() => toggle(item.id)}
                      aria-label={`Select ${item.name}`}
                    />
                  </label>
                  <span className="absolute top-2 right-2 flex flex-col items-end gap-1">
                    {m?.badge && (
                      <span className="bg-[#C9A84C] text-[#0A0A0A] text-[9px] uppercase px-1.5 py-0.5 font-semibold">
                        {m.badge}
                      </span>
                    )}
                    {m?.home && (
                      <span className="bg-emerald-600 text-white text-[9px] uppercase px-1.5 py-0.5">
                        Homepage
                      </span>
                    )}
                    {!item.active && (
                      <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.5">HIDDEN</span>
                    )}
                  </span>
                </div>
                <div className="p-3">
                  <p className="text-[#F8F6F1] text-xs font-medium truncate" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-[rgba(248,246,241,0.4)] text-[10px] mt-0.5">{item.category}</p>
                  <div className="flex gap-1 mt-3">
                    <button
                      type="button"
                      onClick={() => nudge(item.id, -1)}
                      disabled={idx === 0}
                      aria-label={`Move ${item.name} earlier`}
                      className="px-2 py-1.5 text-[10px] border border-white/10 text-white/60 disabled:opacity-25"
                    >
                      ◀
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="flex-1 py-1.5 text-[10px] border border-[rgba(201,168,76,0.3)] text-[#C9A84C] hover:bg-[#C9A84C]/10"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirm({ ids: [item.id] })}
                      aria-label={`Remove ${item.name}`}
                      className="px-2 py-1.5 text-[10px] border border-red-500/30 text-red-400"
                    >
                      ✕
                    </button>
                    <button
                      type="button"
                      onClick={() => nudge(item.id, 1)}
                      disabled={idx === displayed.length - 1}
                      aria-label={`Move ${item.name} later`}
                      className="px-2 py-1.5 text-[10px] border border-white/10 text-white/60 disabled:opacity-25"
                    >
                      ▶
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {modal && (
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-label={modal === "add" ? "Add product" : "Edit product"}
        >
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => !saveM.isPending && setModal(null)}
          />
          <div className="relative bg-[#141414] border border-[rgba(201,168,76,0.15)] w-full max-w-lg max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h3 className="text-[#F8F6F1] font-medium">
                {modal === "add" ? "Add product" : "Edit product"}
              </h3>
              <button
                type="button"
                onClick={() => setModal(null)}
                aria-label="Close"
                className="text-white/50 hover:text-white text-xl"
              >
                ×
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveM.mutate(form);
              }}
              className="overflow-y-auto p-6 space-y-4"
            >
              <ImageUpload
                label="Product photo"
                value={form.image_url}
                onChange={(url) => set("image_url", url)}
                bucket="product-images"
                aspectRatio="4/5"
                deleteReplaced={false}
              />
              <Field label="Product name">
                <input
                  required
                  maxLength={120}
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Block Print Cotton Kurti"
                  className={inputCls}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Category">
                  <select
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                    className={inputCls}
                  >
                    {categories.map((c) => (
                      <option key={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Label">
                  <select
                    value={form.badge}
                    onChange={(e) => set("badge", e.target.value as Badge | "")}
                    className={inputCls}
                  >
                    <option value="">None</option>
                    {BADGES.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field
                label="Price text"
                hint="Shown in the product popup, e.g. “₹180 onwards · MOQ 100 pcs”"
              >
                <input
                  maxLength={80}
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.home}
                  onChange={(e) => set("home", e.target.checked)}
                  className="w-4 h-4 accent-[#C9A84C]"
                />
                <span className="text-[rgba(248,246,241,0.75)] text-sm">
                  Show on homepage (in its own “The edit” section)
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => set("active", e.target.checked)}
                  className="w-4 h-4 accent-[#C9A84C]"
                />
                <span className="text-[rgba(248,246,241,0.75)] text-sm">
                  Visible on the website
                </span>
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  disabled={saveM.isPending}
                  className="flex-1 py-3 text-xs border border-white/10 text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveM.isPending || !form.image_url || !form.name.trim()}
                  className="flex-1 py-3 text-xs bg-[#C9A84C] text-[#0A0A0A] font-bold uppercase tracking-[0.1em] disabled:opacity-40"
                >
                  {saveM.isPending ? "Saving…" : modal === "add" ? "Add product" : "Save changes"}
                </button>
              </div>
              {!form.image_url && (
                <p className="text-[11px] text-[rgba(248,246,241,0.4)]">
                  Add a photo to enable saving.
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirm}
        title={
          confirm && confirm.ids.length > 1
            ? `Remove ${confirm.ids.length} products?`
            : "Remove this product?"
        }
        message="They will disappear from the website straight away, and their photos are deleted from storage. This can't be undone."
        confirmText="Remove"
        loading={working}
        onConfirm={() => confirm && doDelete(confirm.ids)}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
