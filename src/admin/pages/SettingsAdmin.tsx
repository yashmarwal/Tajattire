import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSettings, updateSetting } from "@/lib/adminApi";
import { ImageUpload } from "@/admin/components/ImageUpload";
import { MediaUpload } from "@/admin/components/MediaUpload";

const inputCls = "w-full bg-[#0A0A0A] border border-[rgba(201,168,76,0.2)] text-[#F8F6F1] px-3.5 py-2.5 text-sm placeholder:text-[rgba(248,246,241,0.2)] focus:outline-none focus:border-[#C9A84C] transition-colors";
const textareaCls = `${inputCls} resize-none`;

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[#141414] border border-[rgba(201,168,76,0.08)]">
      <div className="px-6 py-4 border-b border-[rgba(201,168,76,0.06)]">
        <h3 className="text-[#C9A84C] text-[10px] uppercase tracking-[0.3em] font-medium">{title}</h3>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.22em] text-[rgba(248,246,241,0.5)] mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-[rgba(248,246,241,0.25)] text-[10px] mt-1">{hint}</p>}
    </div>
  );
}

/** Wraps ImageUpload with instant-save to Supabase site_settings */
function SettingImage({
  label,
  hint,
  settingKey,
  bucket,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  settingKey: string;
  bucket?: "site-images" | "product-images";
  value: string;
  onChange: (key: string, url: string) => void;
}) {
  const handleChange = async (url: string) => {
    onChange(settingKey, url);
    try {
      await updateSetting(settingKey, url);
      toast.success(`${label} updated!`);
    } catch {
      toast.error("Failed to save image");
    }
  };

  return (
    <div>
      {hint && <p className="text-[rgba(248,246,241,0.25)] text-[10px] mb-3">{hint}</p>}
      <ImageUpload
        value={value || undefined}
        onChange={handleChange}
        bucket={bucket ?? "site-images"}
        label={label}
        aspectRatio="16/9"
      />
    </div>
  );
}

/** Wraps MediaUpload (image/video/pdf + URL fallback) with instant-save to Supabase site_settings */
function SettingMedia({
  label,
  hint,
  settingKey,
  accept,
  aspectRatio,
  maxSizeMb,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  settingKey: string;
  accept?: string;
  aspectRatio?: string;
  maxSizeMb?: number;
  value: string;
  onChange: (key: string, url: string) => void;
}) {
  const handleChange = async (url: string) => {
    onChange(settingKey, url);
    try {
      await updateSetting(settingKey, url);
      toast.success(url ? `${label} updated!` : `${label} removed`);
    } catch {
      toast.error("Failed to save");
    }
  };

  return (
    <MediaUpload
      value={value || undefined}
      onChange={handleChange}
      label={label}
      helpText={hint}
      accept={accept}
      aspectRatio={aspectRatio}
      maxSizeMb={maxSizeMb}
    />
  );
}

export function SettingsAdmin() {
  const qc = useQueryClient();
  const { data: settings = {} } = useQuery({ queryKey: ["settings"], queryFn: getSettings });

  const [form, setForm] = useState({
    hero_headline_1: "", hero_headline_2: "", hero_sub: "",
    brand_tagline: "", whatsapp_number: "", contact_email: "",
  });

  // Image/video/file URLs — saved individually on upload, no "Save" button needed
  const [imgs, setImgs] = useState<Record<string, string>>({
    hero_image: "", craft_image: "", cta_image: "",
    form_image: "", logo_image: "", hero_video: "",
    catalogue_pdf_all: "", catalogue_pdf_kurtis: "", catalogue_pdf_gowns: "", catalogue_pdf_tops: "",
  });

  useEffect(() => {
    if (Object.keys(settings).length) {
      setForm({
        hero_headline_1: settings.hero_headline_1 ?? "",
        hero_headline_2: settings.hero_headline_2 ?? "",
        hero_sub: settings.hero_sub ?? "",
        brand_tagline: settings.brand_tagline ?? "",
        whatsapp_number: settings.whatsapp_number ?? "",
        contact_email: settings.contact_email ?? "",
      });
      setImgs(prev => ({
        ...prev,
        hero_image:      settings.hero_image      ?? "",
        craft_image:     settings.craft_image     ?? "",
        cta_image:       settings.cta_image       ?? "",
        form_image:      settings.form_image      ?? "",
        logo_image:      settings.logo_image      ?? "",
        hero_video:      settings.hero_video       ?? "",
        catalogue_pdf_all:    settings.catalogue_pdf_all    ?? "",
        catalogue_pdf_kurtis: settings.catalogue_pdf_kurtis ?? "",
        catalogue_pdf_gowns:  settings.catalogue_pdf_gowns  ?? "",
        catalogue_pdf_tops:   settings.catalogue_pdf_tops   ?? "",
      }));
    }
  }, [settings]);

  const handleImgChange = (key: string, url: string) => {
    setImgs(prev => ({ ...prev, [key]: url }));
    qc.invalidateQueries({ queryKey: ["settings"] });
  };

  const saveM = useMutation({
    mutationFn: async (data: typeof form) => {
      await Promise.all(Object.entries(data).map(([k, v]) => updateSetting(k, v)));
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["settings"] }); toast.success("Settings saved!"); },
    onError: () => toast.error("Save failed"),
  });

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-[#F8F6F1] font-medium">Site Settings</h2>
        <p className="text-[rgba(248,246,241,0.35)] text-xs mt-0.5">Text changes require Save. Image changes save instantly on upload.</p>
      </div>

      {/* ── TEXT SETTINGS ── */}
      <SectionCard title="Hero Section Text">
        <Field label="Headline Line 1" hint='Large display text — e.g. "Where Craft"'>
          <input type="text" value={form.hero_headline_1} onChange={e => set("hero_headline_1", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Headline Line 2" hint='Second line — e.g. "Meets Commerce."'>
          <input type="text" value={form.hero_headline_2} onChange={e => set("hero_headline_2", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Sub-headline">
          <textarea value={form.hero_sub} onChange={e => set("hero_sub", e.target.value)} rows={3} className={textareaCls} />
        </Field>
      </SectionCard>

      <SectionCard title="Brand Identity">
        <Field label="Brand Tagline" hint='Small caps above hero — e.g. "HANDCRAFTED HERITAGE"'>
          <input type="text" value={form.brand_tagline} onChange={e => set("brand_tagline", e.target.value)} className={inputCls} />
        </Field>
      </SectionCard>

      <SectionCard title="Contact Information">
        <Field label="WhatsApp Number" hint="Country code without + — e.g. 917976667197">
          <input type="text" value={form.whatsapp_number} onChange={e => set("whatsapp_number", e.target.value)} className={inputCls} placeholder="917976667197" />
        </Field>
        <Field label="Contact Email">
          <input type="email" value={form.contact_email} onChange={e => set("contact_email", e.target.value)} className={inputCls} placeholder="info@tajattire.in" />
        </Field>
      </SectionCard>

      <div className="flex justify-end">
        <button
          onClick={() => saveM.mutate(form)}
          disabled={saveM.isPending}
          className="bg-[#C9A84C] text-[#0A0A0A] px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] disabled:opacity-40 hover:bg-[#D4B55A] transition-colors"
        >
          {saveM.isPending ? "Saving…" : "Save Text Settings"}
        </button>
      </div>

      {/* ── IMAGE SETTINGS ── */}
      <div className="pt-2">
        <h2 className="text-[#F8F6F1] font-medium">Site Images</h2>
        <p className="text-[rgba(248,246,241,0.35)] text-xs mt-0.5">
          Upload or paste a URL — changes take effect immediately on the live site.
        </p>
      </div>

      <SectionCard title="Hero Background">
        <SettingImage
          label="Hero Background Image"
          hint="Full-screen image behind the headline. Recommended: 1920×1080 JPG."
          settingKey="hero_image"
          value={imgs.hero_image}
          onChange={handleImgChange}
        />
        <SettingMedia
          label="Hero Background Video (optional)"
          hint="If set, this plays instead of the image above (muted, looping). MP4 recommended, under 15MB for fast loading."
          settingKey="hero_video"
          accept="video/*"
          aspectRatio="16/9"
          maxSizeMb={60}
          value={imgs.hero_video}
          onChange={handleImgChange}
        />
      </SectionCard>

      <SectionCard title="Downloadable Catalogues (PDF)">
        <SettingMedia
          label="Full Catalogue PDF (all categories)"
          hint="Shown as the general 'Download Catalogue' option. Used as a fallback for any category without its own PDF."
          settingKey="catalogue_pdf_all"
          accept="application/pdf"
          maxSizeMb={30}
          value={imgs.catalogue_pdf_all}
          onChange={handleImgChange}
        />
        <SettingMedia
          label="Kurtis Catalogue PDF"
          settingKey="catalogue_pdf_kurtis"
          accept="application/pdf"
          maxSizeMb={30}
          value={imgs.catalogue_pdf_kurtis}
          onChange={handleImgChange}
        />
        <SettingMedia
          label="Gowns Catalogue PDF"
          settingKey="catalogue_pdf_gowns"
          accept="application/pdf"
          maxSizeMb={30}
          value={imgs.catalogue_pdf_gowns}
          onChange={handleImgChange}
        />
        <SettingMedia
          label="Tops Catalogue PDF"
          settingKey="catalogue_pdf_tops"
          accept="application/pdf"
          maxSizeMb={30}
          value={imgs.catalogue_pdf_tops}
          onChange={handleImgChange}
        />
      </SectionCard>

      <SectionCard title="Craft / Philosophy Section">
        <SettingImage
          label="Craft Section Image"
          hint="Left-side portrait in the 'Not Just Fabric. A Philosophy.' section. Recommended: 800×1100 JPG."
          settingKey="craft_image"
          value={imgs.craft_image}
          onChange={handleImgChange}
        />
      </SectionCard>

      <SectionCard title="CTA Band">
        <SettingImage
          label="CTA Band Background"
          hint="Full-width section with 'Your next bestseller is already in our catalog.' Recommended: 1920×1080 JPG."
          settingKey="cta_image"
          value={imgs.cta_image}
          onChange={handleImgChange}
        />
      </SectionCard>

      <SectionCard title="Enquiry Form Side Image">
        <SettingImage
          label="Enquiry Form Left Image"
          hint="Displayed on the left half of the order enquiry form. Recommended: 900×1200 JPG."
          settingKey="form_image"
          value={imgs.form_image}
          onChange={handleImgChange}
        />
      </SectionCard>

      <div className="bg-[#141414] border border-[rgba(201,168,76,0.08)] px-6 py-4 text-xs text-[rgba(248,246,241,0.5)]">
        Looking for <b className="text-[#C9A84C]">workspace photos & videos</b> ("Inside Our Workspace")? That's managed under{" "}
        <b className="text-[#C9A84C]">Content &amp; Media → Workspace Gallery</b> — you can add as many as you like there, not just 3.
      </div>

      <SectionCard title="Brand Logo">
        <SettingImage
          label="Logo Image"
          hint="Shown in Navbar and Footer. Use a PNG with transparent background. Recommended: 200×80 PNG."
          settingKey="logo_image"
          bucket="site-images"
          value={imgs.logo_image ?? ""}
          onChange={handleImgChange}
        />
      </SectionCard>
    </div>
  );
}
