import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getStats, updateStat, getMarqueeTags, createMarqueeTag, deleteMarqueeTag,
  getInstagramImages, updateInstagramImage, getSustainabilityCards, updateSustainabilityCard,
  getCollections, updateCollection, getHowItWorks, updateHowItWorksStep,
} from "@/lib/adminApi";
import { ImageUpload } from "../components/ImageUpload";
import type { Stat, MarqueeTag, InstagramImage, SustainabilityCard, Collection, HowItWorksStep } from "@/lib/siteData";

const inputCls = "w-full bg-[#0A0A0A] border border-[rgba(201,168,76,0.2)] text-[#F8F6F1] px-3 py-2 text-sm placeholder:text-[rgba(248,246,241,0.2)] focus:outline-none focus:border-[#C9A84C] transition-colors";
const textareaCls = `${inputCls} resize-none`;

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h3 className="text-[#F8F6F1] font-medium text-base">{title}</h3>
      {subtitle && <p className="text-[rgba(248,246,241,0.35)] text-xs mt-0.5">{subtitle}</p>}
    </div>
  );
}

function SaveBtn({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={loading} className="bg-[#C9A84C] text-[#0A0A0A] px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] disabled:opacity-40 hover:bg-[#D4B55A] transition-colors">
      {loading ? "Saving…" : "Save"}
    </button>
  );
}

/* ─── STATS ─── */
function StatsSection() {
  const qc = useQueryClient();
  const { data: stats = [] } = useQuery({ queryKey: ["stats"], queryFn: getStats });
  const [drafts, setDrafts] = useState<Record<string, Stat>>({});

  useEffect(() => {
    const d: Record<string, Stat> = {};
    stats.forEach(s => { d[s.id] = { ...s }; });
    setDrafts(d);
  }, [stats]);

  const updateM = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Stat> }) => updateStat(id, updates),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["stats"] }); toast.success("Saved!"); },
  });

  const setDraft = (id: string, k: keyof Stat, v: unknown) =>
    setDrafts(d => ({ ...d, [id]: { ...d[id], [k]: v } }));

  return (
    <div>
      <SectionHeader title="Stats / Counters" subtitle="The 4 animated counters displayed on the home page" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map(s => {
          const draft = drafts[s.id] ?? s;
          return (
            <div key={s.id} className="bg-[#141414] border border-[rgba(201,168,76,0.08)] p-5 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-[#C9A84C] mb-1">Value</label>
                  <input type="number" value={draft.value} onChange={e => setDraft(s.id, "value", +e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-[#C9A84C] mb-1">Suffix</label>
                  <input type="text" value={draft.suffix} onChange={e => setDraft(s.id, "suffix", e.target.value)} placeholder="+" className={inputCls} />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-[#C9A84C] mb-1">Prefix</label>
                  <input type="text" value={draft.prefix} onChange={e => setDraft(s.id, "prefix", e.target.value)} placeholder="₹" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-[#C9A84C] mb-1">Label</label>
                <input type="text" value={draft.label} onChange={e => setDraft(s.id, "label", e.target.value)} className={inputCls} />
              </div>
              <div className="flex justify-end">
                <SaveBtn loading={updateM.isPending} onClick={() => updateM.mutate({ id: s.id, updates: drafts[s.id] })} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── MARQUEE ─── */
function MarqueeSection() {
  const qc = useQueryClient();
  const { data: tags = [] } = useQuery({ queryKey: ["marquee"], queryFn: getMarqueeTags });
  const [newTag, setNewTag] = useState("");

  const addM = useMutation({
    mutationFn: (text: string) => createMarqueeTag(text, tags.length),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["marquee"] }); setNewTag(""); toast.success("Tag added!"); },
  });
  const delM = useMutation({
    mutationFn: deleteMarqueeTag,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["marquee"] }),
  });

  return (
    <div className="border-t border-[rgba(201,168,76,0.08)] pt-8">
      <SectionHeader title="Marquee Tags" subtitle="Scrolling ticker text on the home page" />
      <div className="flex flex-wrap gap-2 mb-4">
        {tags.map((t: MarqueeTag) => (
          <div key={t.id} className="flex items-center gap-2 bg-[#141414] border border-[rgba(201,168,76,0.15)] px-3 py-1.5 text-xs">
            <span className="text-[#F8F6F1]">{t.text}</span>
            <button onClick={() => delM.mutate(t.id)} className="text-red-400 hover:text-red-300 text-base leading-none">×</button>
          </div>
        ))}
        {tags.length === 0 && <p className="text-[rgba(248,246,241,0.3)] text-sm">No tags yet.</p>}
      </div>
      <div className="flex gap-3">
        <input
          type="text" value={newTag} onChange={e => setNewTag(e.target.value)}
          onKeyDown={e => e.key === "Enter" && newTag.trim() && addM.mutate(newTag.trim())}
          placeholder="e.g. JAIPUR MADE  (press Enter or click Add)"
          className="flex-1 bg-[#0A0A0A] border border-[rgba(201,168,76,0.2)] text-[#F8F6F1] px-4 py-2 text-sm focus:outline-none focus:border-[#C9A84C] transition-colors"
        />
        <button onClick={() => newTag.trim() && addM.mutate(newTag.trim())} disabled={!newTag.trim() || addM.isPending} className="bg-[#C9A84C] text-[#0A0A0A] px-5 py-2 text-[11px] font-bold uppercase tracking-wider disabled:opacity-40 hover:bg-[#D4B55A] transition-colors">
          Add
        </button>
      </div>
    </div>
  );
}

/* ─── INSTAGRAM GRID ─── */
function InstagramSection() {
  const qc = useQueryClient();
  const { data: images = [] } = useQuery({ queryKey: ["instagram"], queryFn: getInstagramImages });
  const [drafts, setDrafts] = useState<Record<string, InstagramImage>>({});

  useEffect(() => {
    const d: Record<string, InstagramImage> = {};
    images.forEach(img => { d[img.id] = { ...img }; });
    setDrafts(d);
  }, [images]);

  const updateM = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<InstagramImage> }) => updateInstagramImage(id, updates),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["instagram"] }); toast.success("Updated!"); },
  });

  const setDraft = (id: string, k: keyof InstagramImage, v: unknown) =>
    setDrafts(d => ({ ...d, [id]: { ...d[id], [k]: v } }));

  return (
    <div className="border-t border-[rgba(201,168,76,0.08)] pt-8">
      <SectionHeader title="Instagram Grid" subtitle="6 images in the @tajattire section" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {images.map(img => {
          const draft = drafts[img.id] ?? img;
          return (
            <div key={img.id} className="space-y-2">
              <p className="text-[9px] uppercase tracking-[0.2em] text-[rgba(248,246,241,0.3)]">Slot {img.position}</p>
              <ImageUpload
                value={draft.image_url}
                onChange={url => setDraft(img.id, "image_url", url)}
                bucket="site-images"
                aspectRatio="1"
              />
              <input type="text" value={draft.alt} onChange={e => setDraft(img.id, "alt", e.target.value)} placeholder="Alt text" className="w-full bg-[#0A0A0A] border border-[rgba(201,168,76,0.15)] text-[rgba(248,246,241,0.6)] px-2 py-1.5 text-[11px] focus:outline-none focus:border-[rgba(201,168,76,0.4)]" />
              <div className="flex justify-end">
                <SaveBtn loading={updateM.isPending} onClick={() => updateM.mutate({ id: img.id, updates: drafts[img.id] })} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── SUSTAINABILITY ─── */
function SustainabilitySection() {
  const qc = useQueryClient();
  const { data: cards = [] } = useQuery({ queryKey: ["sustainability"], queryFn: getSustainabilityCards });
  const [drafts, setDrafts] = useState<Record<string, SustainabilityCard>>({});

  useEffect(() => {
    const d: Record<string, SustainabilityCard> = {};
    cards.forEach(c => { d[c.id] = { ...c }; });
    setDrafts(d);
  }, [cards]);

  const updateM = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<SustainabilityCard> }) => updateSustainabilityCard(id, updates),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["sustainability"] }); toast.success("Saved!"); },
  });

  const setDraft = (id: string, k: keyof SustainabilityCard, v: unknown) =>
    setDrafts(d => ({ ...d, [id]: { ...d[id], [k]: v } }));

  return (
    <div className="border-t border-[rgba(201,168,76,0.08)] pt-8">
      <SectionHeader title="Sustainability Cards" subtitle="3 numbered cards in the sustainability section" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map(c => {
          const draft = drafts[c.id] ?? c;
          return (
            <div key={c.id} className="bg-[#141414] border border-[rgba(201,168,76,0.08)] p-5 space-y-3">
              <span className="text-[#C9A84C] text-xs font-mono">Card {c.number}</span>
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-[rgba(248,246,241,0.4)] mb-1">Value</label>
                <input type="text" value={draft.value} onChange={e => setDraft(c.id, "value", e.target.value)} placeholder="100%" className={inputCls} />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-[rgba(248,246,241,0.4)] mb-1">Label</label>
                <input type="text" value={draft.label} onChange={e => setDraft(c.id, "label", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-[rgba(248,246,241,0.4)] mb-1">Detail</label>
                <textarea value={draft.detail} onChange={e => setDraft(c.id, "detail", e.target.value)} rows={3} className={textareaCls} />
              </div>
              <div className="flex justify-end">
                <SaveBtn loading={updateM.isPending} onClick={() => updateM.mutate({ id: c.id, updates: drafts[c.id] })} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── COLLECTIONS ─── */
function CollectionsSection() {
  const qc = useQueryClient();
  const { data: collections = [] } = useQuery({ queryKey: ["collections"], queryFn: getCollections });
  const [drafts, setDrafts] = useState<Record<string, Collection>>({});

  useEffect(() => {
    const d: Record<string, Collection> = {};
    collections.forEach(c => { d[c.id] = { ...c }; });
    setDrafts(d);
  }, [collections]);

  const updateM = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Collection> }) => updateCollection(id, updates),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["collections"] }); toast.success("Saved!"); },
  });

  const setDraft = (id: string, k: keyof Collection, v: unknown) =>
    setDrafts(d => ({ ...d, [id]: { ...d[id], [k]: v } }));

  return (
    <div className="border-t border-[rgba(201,168,76,0.08)] pt-8">
      <SectionHeader title="Collections" subtitle="3 category cards shown in the collections section" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {collections.map(c => {
          const draft = drafts[c.id] ?? c;
          return (
            <div key={c.id} className="bg-[#141414] border border-[rgba(201,168,76,0.08)] p-5 space-y-3">
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-[rgba(248,246,241,0.4)] mb-1">Title</label>
                <input type="text" value={draft.title} onChange={e => setDraft(c.id, "title", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-[0.2em] text-[rgba(248,246,241,0.4)] mb-1">Subtitle</label>
                <input type="text" value={draft.subtitle} onChange={e => setDraft(c.id, "subtitle", e.target.value)} placeholder="180+ Designs" className={inputCls} />
              </div>
              <ImageUpload
                label="Cover Image"
                value={draft.image_url}
                onChange={url => setDraft(c.id, "image_url", url)}
                bucket="site-images"
                aspectRatio="4/3"
              />
              <div className="flex justify-end">
                <SaveBtn loading={updateM.isPending} onClick={() => updateM.mutate({ id: c.id, updates: drafts[c.id] })} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── HOW IT WORKS ─── */
function HowItWorksSection() {
  const qc = useQueryClient();
  const { data: steps = [] } = useQuery({ queryKey: ["how_it_works"], queryFn: getHowItWorks });
  const [drafts, setDrafts] = useState<Record<string, HowItWorksStep>>({});

  useEffect(() => {
    const d: Record<string, HowItWorksStep> = {};
    steps.forEach(s => { d[s.id] = { ...s }; });
    setDrafts(d);
  }, [steps]);

  const updateM = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<HowItWorksStep> }) => updateHowItWorksStep(id, updates),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["how_it_works"] }); toast.success("Saved!"); },
  });

  const setDraft = (id: string, k: keyof HowItWorksStep, v: unknown) =>
    setDrafts(d => ({ ...d, [id]: { ...d[id], [k]: v } }));

  return (
    <div className="border-t border-[rgba(201,168,76,0.08)] pt-8">
      <SectionHeader title="How It Works Steps" subtitle="3 steps shown in the process section" />
      <div className="space-y-4">
        {steps.map(s => {
          const draft = drafts[s.id] ?? s;
          return (
            <div key={s.id} className="bg-[#141414] border border-[rgba(201,168,76,0.08)] p-5 flex gap-5 items-start">
              <span className="text-[#C9A84C] font-display text-3xl font-light flex-shrink-0 w-8 text-center">{s.step_no}</span>
              <div className="flex-1 space-y-3">
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-[rgba(248,246,241,0.4)] mb-1">Title</label>
                  <input type="text" value={draft.title} onChange={e => setDraft(s.id, "title", e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-[9px] uppercase tracking-[0.2em] text-[rgba(248,246,241,0.4)] mb-1">Description</label>
                  <textarea value={draft.description} onChange={e => setDraft(s.id, "description", e.target.value)} rows={3} className={textareaCls} />
                </div>
              </div>
              <div className="flex-shrink-0 self-end">
                <SaveBtn loading={updateM.isPending} onClick={() => updateM.mutate({ id: s.id, updates: drafts[s.id] })} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export function ContentAdmin() {
  return (
    <div className="space-y-0">
      <div className="mb-6">
        <h2 className="text-[#F8F6F1] font-medium">Content & Media</h2>
        <p className="text-[rgba(248,246,241,0.35)] text-xs mt-0.5">Stats, marquee tags, images, sustainability, collections, and process steps</p>
      </div>
      <div className="space-y-0">
        <StatsSection />
        <MarqueeSection />
        <InstagramSection />
        <SustainabilitySection />
        <CollectionsSection />
        <HowItWorksSection />
      </div>
    </div>
  );
}
