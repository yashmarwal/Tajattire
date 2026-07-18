import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getCatalogueItems, createCatalogueItem, updateCatalogueItem, deleteCatalogueItem } from "@/lib/adminApi";
import { ImageUpload } from "../components/ImageUpload";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { CatalogueGridSkeleton } from "../components/Skeleton";
import type { CatalogueItem } from "@/lib/siteData";

const CATS = ["Kurtis", "Gowns", "Tops"] as const;
type Cat = typeof CATS[number];

const blank = (): Omit<CatalogueItem, "id" | "created_at"> => ({
  name: "", category: "Kurtis", image_url: "", label: "", price: "₹180 onwards · MOQ 100 pcs", position: 0, active: true,
});

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.22em] text-[#C9A84C] mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-[#0A0A0A] border border-[rgba(201,168,76,0.2)] text-[#F8F6F1] px-3.5 py-2.5 text-sm placeholder:text-[rgba(248,246,241,0.2)] focus:outline-none focus:border-[#C9A84C] transition-colors";

export function CatalogueAdmin() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Cat | "All">("All");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<CatalogueItem | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-catalogue"],
    queryFn: () => getCatalogueItems(undefined, true),
  });

  const displayed = filter === "All" ? items : items.filter(i => i.category === filter);

  const invalidate = () => { qc.invalidateQueries({ queryKey: ["admin-catalogue"] }); qc.invalidateQueries({ queryKey: ["catalogue"] }); };

  const createM = useMutation({
    mutationFn: createCatalogueItem,
    onSuccess: () => { invalidate(); setModal(null); toast.success("Product added!"); },
    onError: () => toast.error("Failed to add product"),
  });

  const updateM = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CatalogueItem> }) => updateCatalogueItem(id, updates),
    onSuccess: () => { invalidate(); setModal(null); toast.success("Product updated!"); },
    onError: () => toast.error("Update failed"),
  });

  const deleteM = useMutation({
    mutationFn: deleteCatalogueItem,
    onSuccess: () => { invalidate(); setDeleteId(null); toast.success("Product deleted"); },
    onError: () => toast.error("Delete failed"),
  });

  const set = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const openAdd = () => { setForm(blank()); setEditing(null); setModal("add"); };
  const openEdit = (item: CatalogueItem) => {
    setForm({ name: item.name, category: item.category, image_url: item.image_url, label: item.label, price: item.price, position: item.position, active: item.active });
    setEditing(item);
    setModal("edit");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modal === "add") createM.mutate(form);
    else if (modal === "edit" && editing) updateM.mutate({ id: editing.id, updates: form });
  };

  const saving = createM.isPending || updateM.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[#F8F6F1] font-medium">Catalogue Products</h2>
          <p className="text-[rgba(248,246,241,0.35)] text-xs mt-0.5">{items.length} total · {items.filter(i => i.active).length} active</p>
        </div>
        <button id="add-product-btn" onClick={openAdd} className="bg-[#C9A84C] text-[#0A0A0A] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#D4B55A] transition-colors">
          + Add Product
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["All", ...CATS] as const).map(c => (
          <button
            key={c}
            onClick={() => setFilter(c as Cat | "All")}
            className={`px-4 py-1.5 text-[11px] transition-colors ${filter === c ? "bg-[#C9A84C] text-[#0A0A0A] font-semibold" : "border border-[rgba(201,168,76,0.2)] text-[rgba(248,246,241,0.5)] hover:border-[#C9A84C] hover:text-[#F8F6F1]"}`}
          >
            {c} {c !== "All" ? `(${items.filter(i => i.category === c).length})` : `(${items.length})`}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <CatalogueGridSkeleton />
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 text-[rgba(248,246,241,0.3)] border border-dashed border-[rgba(201,168,76,0.1)]">
          No products. Click "Add Product" to get started.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {displayed.map(item => (
            <div key={item.id} className={`bg-[#141414] border border-[rgba(201,168,76,0.08)] overflow-hidden group ${!item.active ? "opacity-50" : ""}`}>
              <div className="relative aspect-[3/4] overflow-hidden bg-[#1C1C1C]">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="flex items-center justify-center h-full text-[rgba(248,246,241,0.2)] text-xs">No image</div>
                )}
                <span className="absolute top-2 left-2 bg-[#C9A84C] text-[#0A0A0A] text-[9px] uppercase tracking-wider px-2 py-0.5 font-semibold">
                  {item.category}
                </span>
                {!item.active && (
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-[9px] px-2 py-0.5">HIDDEN</span>
                )}
              </div>
              <div className="p-3">
                <p className="text-[#F8F6F1] text-xs font-medium truncate" title={item.name}>{item.name}</p>
                <p className="text-[rgba(248,246,241,0.35)] text-[10px] mt-0.5 truncate">{item.price}</p>
                <div className="flex gap-1.5 mt-3">
                  <button onClick={() => openEdit(item)} className="flex-1 py-1.5 text-[10px] border border-[rgba(201,168,76,0.25)] text-[#C9A84C] hover:border-[#C9A84C] hover:bg-[rgba(201,168,76,0.05)] transition-colors">Edit</button>
                  <button onClick={() => setDeleteId(item.id)} className="flex-1 py-1.5 text-[10px] border border-[rgba(255,80,80,0.25)] text-red-400 hover:border-red-400 hover:bg-[rgba(255,80,80,0.05)] transition-colors">Del</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {modal && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !saving && setModal(null)} />
          <div className="relative bg-[#141414] border border-[rgba(201,168,76,0.15)] w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(201,168,76,0.08)] flex-shrink-0">
              <h3 className="text-[#F8F6F1] font-medium">{modal === "add" ? "Add Product" : "Edit Product"}</h3>
              <button onClick={() => setModal(null)} className="text-[rgba(248,246,241,0.4)] hover:text-[#F8F6F1] text-xl">×</button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
              <ImageUpload
                label="Product Image"
                value={form.image_url}
                onChange={url => set("image_url", url)}
                bucket="product-images"
                aspectRatio="3/4"
              />

              <Field label="Category">
                <select value={form.category} onChange={e => set("category", e.target.value)} className={inputCls}>
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>

              <Field label="Product Name">
                <input type="text" value={form.name} onChange={e => set("name", e.target.value)} required placeholder="e.g. Block Print Cotton Kurti" className={inputCls} />
              </Field>

              <Field label="Display Label (shown on card)">
                <input type="text" value={form.label} onChange={e => set("label", e.target.value)} placeholder="e.g. KURTI — COTTON PRINTED" className={inputCls} />
              </Field>

              <Field label="Price Text">
                <input type="text" value={form.price} onChange={e => set("price", e.target.value)} placeholder="₹180 onwards · MOQ 100 pcs" className={inputCls} />
              </Field>

              <Field label="Position (display order)">
                <input type="number" value={form.position} onChange={e => set("position", +e.target.value || 0)} min={0} className={inputCls} />
              </Field>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => set("active", e.target.checked)} className="w-4 h-4 accent-[#C9A84C]" />
                <span className="text-[rgba(248,246,241,0.65)] text-sm">Visible on live site</span>
              </label>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} disabled={saving} className="flex-1 py-3 text-xs border border-[rgba(255,255,255,0.1)] text-[rgba(248,246,241,0.5)] hover:border-white hover:text-[#F8F6F1] transition-colors disabled:opacity-40">
                  Cancel
                </button>
                <button type="submit" disabled={saving || !form.image_url} className="flex-1 py-3 text-xs bg-[#C9A84C] text-[#0A0A0A] font-bold uppercase tracking-[0.1em] disabled:opacity-40 hover:bg-[#D4B55A] transition-colors">
                  {saving ? "Saving…" : modal === "add" ? "Add Product" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Product?"
        message="This will permanently remove the product from your catalogue and from the live site."
        confirmText="Delete Product"
        loading={deleteM.isPending}
        onConfirm={() => { if (deleteId) deleteM.mutate(deleteId); }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
