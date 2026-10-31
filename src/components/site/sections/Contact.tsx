import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useImg } from "@/hooks/useImg";
import { useCategories } from "@/lib/catalog";
import { useBackToClose } from "@/hooks/useBackToClose";
import { healDeadImage } from "@/lib/siteSettings";
import { sendForm, logLead, LIMITS } from "@/lib/forms";
import {
  waLink,
  telLink,
  mailLink,
  PHONE_DISPLAY,
  EMAIL,
  CITY,
  INSTAGRAM_URL,
  INSTAGRAM_HANDLE,
} from "@/lib/contact";
import terms from "@/data/terms.json";
import { Honeypot } from "../Honeypot";
import { SplitHeading } from "../Primitives";
import { IconWhatsApp, IconPhone, IconMail, IconInstagram, IconArrow, IconClose } from "../icons";

type Status = "idle" | "loading" | "success" | "error";

const fieldCls =
  "w-full bg-transparent border-b-[1.5px] border-charcoal/15 py-2.5 text-[16px] md:text-[15px] text-charcoal placeholder:text-charcoal/35 focus:outline-none focus:border-[var(--emerald-deep)] transition-colors";
const labelCls = "block text-[10.5px] uppercase tracking-[0.18em] text-charcoal/60 mb-1";

/* ─────────── Wholesale enquiry form ─────────── */
export function Inquiry() {
  const IMG = useImg();
  const categories = useCategories();
  const [form, setForm] = useState({
    name: "",
    business: "",
    city: "",
    whatsapp: "",
    quantity: "",
  });
  const [interests, setInterests] = useState<string[]>([]);
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));
  const toggle = (v: string) =>
    setInterests((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));

  const pickPhoto = (file: File) => {
    if (!file.type.startsWith("image/"))
      return setPhotoError("Please choose an image (JPG, PNG or WEBP).");
    if (file.size > 8 * 1024 * 1024)
      return setPhotoError("That photo is over 8 MB — please pick a smaller one.");
    setPhotoError("");
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };
  const clearPhoto = () => {
    setPhoto(null);
    setPreview(null);
    setPhotoError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    const result = await sendForm({
      honeypot: trap,
      subject: `New Bulk Enquiry — TajAttire | ${form.name} | ${form.city}`,
      fromName: "TajAttire Website",
      replyName: form.name,
      attachment: photo,
      message:
        `NEW BULK ORDER ENQUIRY\n\n` +
        `Name:         ${form.name}\n` +
        `Business:     ${form.business}\n` +
        `City / State: ${form.city}\n` +
        `WhatsApp:     ${form.whatsapp}\n` +
        `Interest:     ${interests.length ? interests.join(", ") : "Not specified"}\n` +
        `Quantity:     ${form.quantity}\n` +
        (photo
          ? `Reference photo attached (${photo.name}, ${(photo.size / 1024).toFixed(0)} KB)\n`
          : "") +
        `\nSent via tajattire.in`,
    });
    if (result.ok || result.reason !== "too-fast")
      logLead({
        name: form.name,
        phone: form.whatsapp,
        city: form.city,
        message: `Business: ${form.business} | Qty: ${form.quantity} | Interest: ${interests.join(", ")}${result.ok ? "" : " (email delivery failed)"}`,
        product: interests.join(", ") || null,
      });
    // On failure everything typed stays in place for an instant retry
    setStatus(result.ok ? "success" : "error");
  };

  const reset = () => {
    setForm({ name: "", business: "", city: "", whatsapp: "", quantity: "" });
    setInterests([]);
    clearPhoto();
    setStatus("idle");
  };

  return (
    <section id="order" data-bg="light" className="relative bg-cloud pt-32 md:pt-40 pb-24">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16">
        {/* Left: contact details + image */}
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--emerald-deep)] mb-5">
            Contact & enquiry
          </p>
          <SplitHeading
            as="h1"
            text="Ready to stock smart?"
            className="font-display text-charcoal font-light leading-[1.02] text-[clamp(2.4rem,6.5vw,5rem)]"
          />
          <p className="mt-5 text-charcoal/65 max-w-md leading-relaxed">
            Tell us what you need and we'll reply on WhatsApp {terms.responseTime}. Minimum{" "}
            {terms.defaultCategory.moq} per style; custom orders from {terms.custom.moq}.
          </p>

          <ul className="mt-8 grid sm:grid-cols-2 gap-3">
            {[
              {
                href: waLink("Hi TajAttire! I'd like wholesale pricing."),
                icon: <IconWhatsApp size={18} className="text-[#25D366]" />,
                k: "WhatsApp",
                v: PHONE_DISPLAY,
                ext: true,
              },
              { href: telLink, icon: <IconPhone size={18} />, k: "Call", v: PHONE_DISPLAY },
              {
                href: mailLink("Wholesale enquiry"),
                icon: <IconMail size={18} />,
                k: "Email",
                v: EMAIL,
              },
              {
                href: INSTAGRAM_URL,
                icon: <IconInstagram size={18} />,
                k: "Instagram",
                v: INSTAGRAM_HANDLE,
                ext: true,
              },
            ].map((c) => (
              <li key={c.k}>
                <a
                  href={c.href}
                  target={c.ext ? "_blank" : undefined}
                  rel={c.ext ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 rounded-2xl border border-charcoal/10 bg-white px-4 py-3.5 text-[var(--emerald-deep)] active:scale-[0.99] transition-transform [@media(hover:hover)]:hover:border-[var(--emerald-deep)]/40"
                >
                  {c.icon}
                  <span className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-[0.18em] text-charcoal/50">
                      {c.k}
                    </span>
                    <span className="block text-sm text-charcoal truncate">{c.v}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-charcoal/55">{CITY}</p>

          <div className="hidden lg:block mt-10 relative aspect-[4/3] rounded-[26px] overflow-hidden bg-[var(--emerald-deep)]">
            {IMG.form ? (
              <img
                src={IMG.form}
                alt=""
                loading="lazy"
                decoding="async"
                onError={healDeadImage}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <span className="absolute inset-0 grid place-items-center" aria-hidden="true">
                <img
                  src="/images/logo-mark-160.webp"
                  alt=""
                  width={141}
                  height={160}
                  className="w-24 opacity-30"
                />
              </span>
            )}
            <span className="absolute inset-0 bg-[var(--emerald-deep)]/45" aria-hidden="true" />
            <p className="absolute left-8 right-8 bottom-8 font-display italic text-cloud text-3xl leading-tight">
              “Your customers deserve better. So do your margins.”
            </p>
          </div>
        </div>

        {/* Right: form */}
        <div className="rounded-[28px] bg-white border border-charcoal/[0.07] p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_-35px_rgba(10,10,10,0.45)]">
          {status === "success" ? (
            <div className="text-center py-16" role="status">
              <div className="w-14 h-14 rounded-full border-2 border-[var(--gold)] text-[var(--gold)] grid place-items-center mx-auto mb-6">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2 className="font-display text-3xl text-charcoal">We've received your enquiry.</h2>
              <p className="text-charcoal/65 mt-3">
                Our team will reply on WhatsApp {terms.responseTime}.
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-8 text-[11px] uppercase tracking-[0.18em] text-[var(--emerald-deep)] underline underline-offset-4"
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="relative grid gap-6">
              <Honeypot value={trap} onChange={setTrap} />
              <h2 className="font-display text-2xl text-charcoal">Wholesale enquiry</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <label className="block">
                  <span className={labelCls}>Full name</span>
                  <input
                    required
                    maxLength={LIMITS.short}
                    autoComplete="name"
                    value={form.name}
                    onChange={set("name")}
                    className={fieldCls}
                    placeholder="Your name"
                  />
                </label>
                <label className="block">
                  <span className={labelCls}>Business name</span>
                  <input
                    required
                    maxLength={LIMITS.short}
                    autoComplete="organization"
                    value={form.business}
                    onChange={set("business")}
                    className={fieldCls}
                    placeholder="Store / brand"
                  />
                </label>
                <label className="block">
                  <span className={labelCls}>City / state</span>
                  <input
                    required
                    maxLength={LIMITS.short}
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={set("city")}
                    className={fieldCls}
                    placeholder="e.g. Jaipur, Rajasthan"
                  />
                </label>
                <label className="block">
                  <span className={labelCls}>WhatsApp number</span>
                  <input
                    required
                    type="tel"
                    inputMode="tel"
                    minLength={7}
                    maxLength={20}
                    autoComplete="tel"
                    value={form.whatsapp}
                    onChange={set("whatsapp")}
                    className={fieldCls}
                    placeholder="+91 99999 99999"
                  />
                </label>
              </div>

              <fieldset>
                <legend className={`${labelCls} mb-3`}>Interested in</legend>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => {
                    const on = interests.includes(c.name);
                    return (
                      <button
                        key={c.slug}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle(c.name)}
                        className={`rounded-full border px-4 h-10 text-[12px] transition-colors ${on ? "bg-[var(--emerald-deep)] border-[var(--emerald-deep)] text-cloud" : "border-charcoal/15 text-charcoal"}`}
                      >
                        {c.name}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <label className="block">
                <span className={labelCls}>Approximate quantity</span>
                <input
                  required
                  maxLength={LIMITS.short}
                  value={form.quantity}
                  onChange={set("quantity")}
                  className={fieldCls}
                  placeholder={`e.g. ${terms.defaultCategory.moqNumber} pieces per style`}
                />
              </label>

              <div>
                <span className={labelCls}>
                  Reference photo{" "}
                  <span className="normal-case tracking-normal text-charcoal/40">(optional)</span>
                </span>
                {preview ? (
                  <div className="flex items-center gap-4 mt-2">
                    <img
                      src={preview}
                      alt="Selected reference"
                      className="h-20 w-20 rounded-xl object-cover border border-charcoal/10"
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-charcoal truncate">{photo?.name}</p>
                      <button
                        type="button"
                        onClick={clearPhoto}
                        className="text-[11px] text-red-700 underline underline-offset-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const f = e.dataTransfer.files[0];
                      if (f) pickPhoto(f);
                    }}
                    className="mt-2 w-full rounded-2xl border-2 border-dashed border-charcoal/15 py-6 text-[13px] text-charcoal/55 [@media(hover:hover)]:hover:border-[var(--emerald-deep)]/40"
                  >
                    Drop an image or{" "}
                    <span className="text-[var(--emerald-deep)] underline">browse</span> · max 8 MB
                  </button>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  tabIndex={-1}
                  onChange={(e) => e.target.files?.[0] && pickPhoto(e.target.files[0])}
                />
                {photoError && (
                  <p role="alert" className="mt-2 text-[12px] text-red-700">
                    {photoError}
                  </p>
                )}
              </div>

              {status === "error" && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-[13px] text-red-800"
                >
                  Couldn't send just now — everything you typed is still here. Press the button to
                  retry, or email {EMAIL}.
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="pill pill-primary !w-full disabled:opacity-60"
              >
                <span className="pill-label">
                  {status === "loading"
                    ? "Sending…"
                    : status === "error"
                      ? "Retry sending"
                      : "Send enquiry"}
                </span>
                <span className="pill-chip" aria-hidden="true">
                  <IconArrow size={15} />
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─────────── Factory visit popup (shown once per session, on scroll-up) ─────────── */
const VISIT_KEY = "taj:visit-popup";
export function FactoryVisitPopup() {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [trap, setTrap] = useState("");
  const [form, setForm] = useState({
    name: "",
    businessType: "Retailer",
    date: "",
    people: "1",
    whatsapp: "",
  });

  useBackToClose(visible, () => setVisible(false));

  useEffect(() => {
    try {
      if (sessionStorage.getItem(VISIT_KEY)) return;
    } catch {
      /* ignore */
    }
    let last = window.scrollY;
    let max = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      max = Math.max(max, y);
      if (max > 1600 && y < last - 30) {
        setVisible(true);
        try {
          sessionStorage.setItem(VISIT_KEY, "1");
        } catch {
          /* ignore */
        }
        window.removeEventListener("scroll", onScroll);
      }
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const set =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    const r = await sendForm({
      honeypot: trap,
      subject: "Factory Visit Request — TajAttire",
      fromName: "TajAttire Factory Visit",
      replyName: form.name,
      message:
        `FACTORY VISIT REQUEST\n\nName:           ${form.name}\nBusiness type:  ${form.businessType}\n` +
        `Preferred date: ${form.date}\nPeople:         ${form.people}\nWhatsApp:       ${form.whatsapp}\n\nSent via tajattire.in`,
    });
    setStatus(r.ok ? "success" : "error");
  };

  const field =
    "w-full bg-transparent border-b border-white/20 text-cloud py-2 text-[16px] md:text-[14px] focus:outline-none focus:border-[var(--gold)] [color-scheme:dark]";
  const label = "block text-[10px] uppercase tracking-[0.16em] text-cloud/50 mb-1";

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          role="dialog"
          aria-label="Visit our Jaipur unit"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ bottom: "calc(var(--dock-h) + 8px)" }}
          className="fixed z-[80] left-3 right-3 sm:left-auto sm:right-6 sm:w-[380px] max-h-[calc(100svh-var(--dock-h)-100px)] overflow-y-auto rounded-[22px] bg-[#0C0E0D] border border-[var(--gold)]/20 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
          data-lenis-prevent
        >
          <div className="p-6 relative">
            <button
              type="button"
              onClick={() => setVisible(false)}
              aria-label="Close"
              className="absolute top-4 right-4 w-9 h-9 rounded-full grid place-items-center text-cloud/60 active:scale-95"
            >
              <IconClose size={16} />
            </button>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--gold)] mb-2">
              By appointment
            </p>
            <h3 className="font-display text-cloud text-2xl leading-tight pr-8">
              Visit our Jaipur unit
            </h3>
            <p className="text-cloud/55 text-[12px] mt-1">
              See the range in person and meet the team.
            </p>

            {status === "success" ? (
              <div className="py-8 text-center" role="status">
                <p className="font-display text-cloud text-xl">Request received.</p>
                <p className="text-cloud/60 text-xs mt-2">
                  We'll confirm on WhatsApp {terms.responseTime}.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="relative grid gap-4 mt-6">
                <Honeypot value={trap} onChange={setTrap} />
                <label>
                  <span className={label}>Your name</span>
                  <input
                    required
                    maxLength={LIMITS.short}
                    autoComplete="name"
                    value={form.name}
                    onChange={set("name")}
                    className={field}
                  />
                </label>
                <label>
                  <span className={label}>Business type</span>
                  <select
                    value={form.businessType}
                    onChange={set("businessType")}
                    className={`${field} bg-[#0C0E0D]`}
                  >
                    {["Retailer", "Boutique owner", "Wholesaler", "Other"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </label>
                <div className="grid grid-cols-[1.5fr_1fr] gap-4">
                  <label>
                    <span className={label}>Preferred date</span>
                    <input
                      required
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={form.date}
                      onChange={set("date")}
                      className={field}
                    />
                  </label>
                  <label>
                    <span className={label}>People</span>
                    <select
                      value={form.people}
                      onChange={set("people")}
                      className={`${field} bg-[#0C0E0D]`}
                    >
                      {["1", "2", "3", "4", "5+"].map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label>
                  <span className={label}>WhatsApp number</span>
                  <input
                    required
                    type="tel"
                    inputMode="tel"
                    minLength={7}
                    maxLength={20}
                    autoComplete="tel"
                    value={form.whatsapp}
                    onChange={set("whatsapp")}
                    className={field}
                  />
                </label>
                {status === "error" && (
                  <p role="alert" className="text-[12px] text-red-300">
                    Couldn't send — your details are kept. Press the button to retry.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="pill pill-primary !w-full !min-h-[2.9rem] disabled:opacity-60"
                >
                  <span className="pill-label">
                    {status === "loading"
                      ? "Sending…"
                      : status === "error"
                        ? "Retry"
                        : "Request a visit"}
                  </span>
                  <span className="pill-chip !w-9 !h-9" aria-hidden="true">
                    <IconArrow size={14} />
                  </span>
                </button>
              </form>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
