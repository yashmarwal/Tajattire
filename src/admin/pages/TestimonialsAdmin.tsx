import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/adminApi";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ListSkeleton } from "../components/Skeleton";
import type { Testimonial } from "@/lib/siteData";

const blank = (): Omit<Testimonial, "id" | "created_at"> => ({
  quote: "", name: "", role: "", stars: 5, position: 0, active: true,
});

const inputCls = "w-full bg-[#0A0A0A] border border-[rgba(201,168,76,0.2)] text-[#F8F6F1] px-3.5 py-2.5 text-sm placeholder:text-[rgba(248,246,241,0.2)] focus:outline-none focus:border-[#C9A84C] transition-colors";

export function TestimonialsAdmin() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: items = [], isLoading } = useQuery({ queryKey: ["admin-testimonials"], queryFn: () => getTestimonials(true) });

  const invalidate = () => { qc.invalidateQueries({ queryKey: ["admin-testimonials"] }); qc.invalidateQueries({ queryKey: ["testimonials"] }); };

  const createM = useMutation({ mutationFn: createTestimonial, onSuccess: () => { invalidate(); setModal(null); toast.success("Testimonial added!"); }, onError: () => toast.error("Failed") });
  const updateM = useMutation({ mutationFn: ({ id, u }: { id: string; u: Partial<Testimonial> }) => updateTestimonial(id, u), onSuccess: () => { invalidate(); setModal(null); toast.success("Saved!"); }, onError: () => toast.error("Failed") });
  const deleteM = useMutation({ mutationFn: deleteTestimonial, onSuccess: () => { invalidate(); setDeleteId(null); toast.success("Deleted"); }, onError: () => toast.error("Failed") });

  const set = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const openAdd = () => { setForm(blank()); setEditing(null); setModal("add"); };
  const openEdit = (t: Testimonial) => { setForm({ quote: t.quote, name: t.name, role: t.role, stars: t.stars, position: t.position, active: t.active }); setEditing(t); setModal("edit"); };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (modal === "add") createM.mutate(form); else if (editing) updateM.mutate({ id: editing.id, u: form }); };

  const saving = createM.isPending || updateM.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[#F8F6F1] font-medium">Testimonials</h2>
          <p className="text-[rgba(248,246,241,0.35)] text-xs mt-0.5">{items.length} total</p>
        </div>
        <button onClick={openAdd} className="bg-[#C9A84C] text-[#0A0A0A] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#D4B55A] transition-colors">
          + Add Testimonial
        </button>
      </div>

      {isLoading ? (
        <ListSkeleton />
      ) : (
        <div className="space-y-3">
          {items.map(t => (
            <div key={t.id} className={`bg-[#141414] border border-[rgba(201,168,76,0.08)] p-5 flex gap-4 ${!t.active ? "opacity-50" : ""}`}>
              <div className="flex-1 min-w-0">
                <p className="text-[#F8F6F1] text-sm leading-relaxed line-clamp-2">"{t.quote}"</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[#C9A84C] text-[11px] font-medium">{t.name}</span>
                  <span className="text-[rgba(248,246,241,0.35)] text-[10px]">{t.role}</span>
                  <span className="text-[#C9A84C] text-[10px]">{"★".repeat(t.stars)}</span>
                  {!t.active && <span className="text-red-400 text-[9px] uppercase border border-red-900 px-1.5 py-0.5">Hidden</span>}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(t)} className="px-3 py-1.5 text-[10px] border border-[rgba(201,168,76,0.25)] text-[#C9A84C] hover:border-[#C9A84C] transition-colors">Edit</button>
                <button onClick={() => setDeleteId(t.id)} className="px-3 py-1.5 text-[10px] border border-[rgba(255,80,80,0.25)] text-red-400 hover:border-red-400 transition-colors">Del</button>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-12 text-[rgba(248,246,241,0.3)] border border-dashed border-[rgba(201,168,76,0.1)]">No testimonials yet.</div>
          )}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !saving && setModal(null)} />
          <div className="relative bg-[#141414] border border-[rgba(201,168,76,0.15)] w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(201,168,76,0.08)] flex-shrink-0">
              <h3 className="text-[#F8F6F1] font-medium">{modal === "add" ? "Add Testimonial" : "Edit Testimonial"}</h3>
              <button onClick={() => setModal(null)} className="text-[rgba(248,246,241,0.4)] hover:text-[#F8F6F1] text-xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.22em] text-[#C9A84C] mb-1.5">Quote</label>
                <textarea value={form.quote} onChange={e => set("quote", e.target.value)} required rows={4} placeholder="Customer testimonial text…" className={`${inputCls} resize-none`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.22em] text-[#C9A84C] mb-1.5">Name</label>
                  <input type="text" value={form.name} onChange={e => set("name", e.target.value)} required placeholder="Priya Sharma" className={inputCls} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.22em] text-[#C9A84C] mb-1.5">Role</label>
                  <input type="text" value={form.role} onChange={e => set("role", e.target.value)} required placeholder="Boutique Owner · Jaipur" className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.22em] text-[#C9A84C] mb-1.5">Stars (1–5)</label>
                  <input type="number" value={form.stars} onChange={e => set("stars", Math.min(5, Math.max(1, +e.target.value)))} min={1} max={5} className={inputCls} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.22em] text-[#C9A84C] mb-1.5">Position</label>
                  <input type="number" value={form.position} onChange={e => set("position", +e.target.value || 0)} min={0} className={inputCls} />
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={e => set("active", e.target.checked)} className="w-4 h-4 accent-[#C9A84C]" />
                <span className="text-[rgba(248,246,241,0.65)] text-sm">Visible on live site</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} disabled={saving} className="flex-1 py-3 text-xs border border-[rgba(255,255,255,0.1)] text-[rgba(248,246,241,0.5)] hover:border-white transition-colors disabled:opacity-40">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 text-xs bg-[#C9A84C] text-[#0A0A0A] font-bold uppercase tracking-[0.1em] disabled:opacity-40 hover:bg-[#D4B55A] transition-colors">
                  {saving ? "Saving…" : modal === "add" ? "Add" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="Delete Testimonial?" message="This will remove it from the live site carousel." confirmText="Delete" loading={deleteM.isPending} onConfirm={() => { if (deleteId) deleteM.mutate(deleteId); }} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
