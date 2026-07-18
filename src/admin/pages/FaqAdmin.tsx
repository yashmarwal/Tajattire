import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getFaqItems, createFaqItem, updateFaqItem, deleteFaqItem } from "@/lib/adminApi";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ListSkeleton } from "../components/Skeleton";
import type { FaqItem } from "@/lib/siteData";

const blank = (): Omit<FaqItem, "id" | "created_at"> => ({ question: "", answer: "", position: 0, active: true });
const inputCls = "w-full bg-[#0A0A0A] border border-[rgba(201,168,76,0.2)] text-[#F8F6F1] px-3.5 py-2.5 text-sm placeholder:text-[rgba(248,246,241,0.2)] focus:outline-none focus:border-[#C9A84C] transition-colors";

export function FaqAdmin() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [form, setForm] = useState(blank());
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: items = [], isLoading } = useQuery({ queryKey: ["admin-faq"], queryFn: () => getFaqItems(true) });

  const invalidate = () => { qc.invalidateQueries({ queryKey: ["admin-faq"] }); qc.invalidateQueries({ queryKey: ["faq"] }); };

  const createM = useMutation({ mutationFn: createFaqItem, onSuccess: () => { invalidate(); setModal(null); toast.success("FAQ item added!"); } });
  const updateM = useMutation({ mutationFn: ({ id, u }: { id: string; u: Partial<FaqItem> }) => updateFaqItem(id, u), onSuccess: () => { invalidate(); setModal(null); toast.success("Saved!"); } });
  const deleteM = useMutation({ mutationFn: deleteFaqItem, onSuccess: () => { invalidate(); setDeleteId(null); toast.success("Deleted"); } });

  const set = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const openAdd = () => { setForm(blank()); setEditing(null); setModal("add"); };
  const openEdit = (item: FaqItem) => { setForm({ question: item.question, answer: item.answer, position: item.position, active: item.active }); setEditing(item); setModal("edit"); };
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (modal === "add") createM.mutate(form); else if (editing) updateM.mutate({ id: editing.id, u: form }); };

  const saving = createM.isPending || updateM.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[#F8F6F1] font-medium">FAQ Items</h2>
          <p className="text-[rgba(248,246,241,0.35)] text-xs mt-0.5">{items.length} total · {items.filter(i => i.active).length} active</p>
        </div>
        <button onClick={openAdd} className="bg-[#C9A84C] text-[#0A0A0A] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] hover:bg-[#D4B55A] transition-colors">
          + Add FAQ
        </button>
      </div>

      {isLoading ? (
        <ListSkeleton />
      ) : (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={item.id} className={`bg-[#141414] border border-[rgba(201,168,76,0.08)] ${!item.active ? "opacity-50" : ""}`}>
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <span className="text-[#C9A84C] text-[10px] font-mono w-5 flex-shrink-0">{String(idx + 1).padStart(2, "0")}</span>
                <p className="text-[#F8F6F1] text-sm flex-1 leading-snug">{item.question}</p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {!item.active && <span className="text-red-400 text-[9px] uppercase border border-red-900 px-1.5 py-0.5">Hidden</span>}
                  <button onClick={e => { e.stopPropagation(); openEdit(item); }} className="px-3 py-1 text-[10px] border border-[rgba(201,168,76,0.2)] text-[#C9A84C] hover:border-[#C9A84C] transition-colors">Edit</button>
                  <button onClick={e => { e.stopPropagation(); setDeleteId(item.id); }} className="px-3 py-1 text-[10px] border border-[rgba(255,80,80,0.2)] text-red-400 hover:border-red-400 transition-colors">Del</button>
                  <span className="text-[rgba(248,246,241,0.3)] text-xs">{expandedId === item.id ? "▲" : "▼"}</span>
                </div>
              </div>
              {expandedId === item.id && (
                <div className="px-5 pb-4 border-t border-[rgba(201,168,76,0.05)]">
                  <p className="text-[rgba(248,246,241,0.55)] text-sm leading-relaxed pt-3 pl-9">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-12 text-[rgba(248,246,241,0.3)] border border-dashed border-[rgba(201,168,76,0.1)]">No FAQ items. Click "Add FAQ" to start.</div>
          )}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => !saving && setModal(null)} />
          <div className="relative bg-[#141414] border border-[rgba(201,168,76,0.15)] w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(201,168,76,0.08)] flex-shrink-0">
              <h3 className="text-[#F8F6F1] font-medium">{modal === "add" ? "Add FAQ Item" : "Edit FAQ Item"}</h3>
              <button onClick={() => setModal(null)} className="text-[rgba(248,246,241,0.4)] hover:text-[#F8F6F1] text-xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.22em] text-[#C9A84C] mb-1.5">Question</label>
                <input type="text" value={form.question} onChange={e => set("question", e.target.value)} required placeholder="e.g. What is the minimum order quantity?" className={inputCls} />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.22em] text-[#C9A84C] mb-1.5">Answer</label>
                <textarea value={form.answer} onChange={e => set("answer", e.target.value)} required rows={5} placeholder="Detailed answer…" className={`${inputCls} resize-none`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.22em] text-[#C9A84C] mb-1.5">Position</label>
                  <input type="number" value={form.position} onChange={e => set("position", +e.target.value || 0)} min={0} className={inputCls} />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer pb-2">
                    <input type="checkbox" checked={form.active} onChange={e => set("active", e.target.checked)} className="w-4 h-4 accent-[#C9A84C]" />
                    <span className="text-[rgba(248,246,241,0.65)] text-sm">Visible</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} disabled={saving} className="flex-1 py-3 text-xs border border-[rgba(255,255,255,0.1)] text-[rgba(248,246,241,0.5)] hover:border-white transition-colors disabled:opacity-40">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 text-xs bg-[#C9A84C] text-[#0A0A0A] font-bold uppercase tracking-[0.1em] disabled:opacity-40 hover:bg-[#D4B55A] transition-colors">
                  {saving ? "Saving…" : modal === "add" ? "Add" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="Delete FAQ?" message="This will remove the question from the live site's FAQ section." confirmText="Delete" loading={deleteM.isPending} onConfirm={() => { if (deleteId) deleteM.mutate(deleteId); }} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
