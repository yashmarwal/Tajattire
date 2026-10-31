import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/lib/catalog";
import { useBackToClose } from "@/hooks/useBackToClose";
import { useScrollLock } from "@/lib/scrollLock";
import { sendForm, logLead, LIMITS } from "@/lib/forms";
import { waLink, telLink, mailLink, productEnquiryText, PHONE_DISPLAY, EMAIL } from "@/lib/contact";
import { Honeypot } from "../Honeypot";
import { Lightbox } from "../Lightbox";
import { IconWhatsApp, IconPhone, IconMail, IconClose, IconArrow } from "../icons";

type Status = "idle" | "loading" | "success" | "error";

function QuickForm({
  product,
  onDone,
  dark = false,
}: {
  product: Product;
  onDone: () => void;
  dark?: boolean;
}) {
  const [form, setForm] = useState({ name: "", whatsapp: "", quantity: "" });
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    const result = await sendForm({
      honeypot: trap,
      subject: `Quick Enquiry — ${product.name} | TajAttire`,
      fromName: "TajAttire Quick Enquiry",
      replyName: form.name,
      message:
        `QUICK PRODUCT ENQUIRY\n\n` +
        `Product:   ${product.name} (${product.category})\n` +
        `Name:      ${form.name}\n` +
        `WhatsApp:  ${form.whatsapp}\n` +
        `Quantity:  ${form.quantity || "Not specified"} (minimum ${product.moq})\n\n` +
        `Sent via tajattire.in`,
    });
    if (result.ok || result.reason !== "too-fast")
      logLead({
        name: form.name,
        phone: form.whatsapp,
        message: `Quick enquiry for: ${product.name} | Qty: ${form.quantity}${result.ok ? "" : " (email delivery failed)"}`,
        product: product.name,
      });
    setStatus(result.ok ? "success" : "error");
  };

  if (status === "success") {
    return (
      <div className="text-center py-5" role="status">
        <p className={`font-display text-xl ${dark ? "text-white" : "text-charcoal"}`}>
          Enquiry sent — thank you.
        </p>
        <p className={`text-sm mt-1 ${dark ? "text-white/70" : "text-charcoal/60"}`}>
          We'll reply on WhatsApp within 2 business hours.
        </p>
        <button
          type="button"
          onClick={onDone}
          className={`mt-4 text-xs uppercase tracking-[0.18em] underline underline-offset-4 ${dark ? "text-white" : "text-[var(--emerald-deep)]"}`}
        >
          Close
        </button>
      </div>
    );
  }

  const field = dark
    ? "w-full bg-transparent border-b border-white/30 py-2 text-[16px] text-white placeholder:text-white/45 focus:outline-none focus:border-white"
    : "w-full bg-transparent border-b border-charcoal/20 py-2 text-[15px] text-charcoal placeholder:text-charcoal/35 focus:outline-none focus:border-[var(--emerald-deep)]";
  const lbl = dark
    ? "block text-[10px] uppercase tracking-[0.2em] text-white/65 mb-1"
    : "block text-[10px] uppercase tracking-[0.2em] text-charcoal/55 mb-1";
  return (
    <form onSubmit={submit} className="relative grid gap-4" noValidate={false}>
      <Honeypot value={trap} onChange={setTrap} />
      <label className="block">
        <span className={lbl}>Your name</span>
        <input
          required
          maxLength={LIMITS.short}
          autoComplete="name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className={field}
          placeholder="Full name"
        />
      </label>
      <label className="block">
        <span className={lbl}>WhatsApp number</span>
        <input
          required
          type="tel"
          inputMode="tel"
          minLength={7}
          maxLength={20}
          autoComplete="tel"
          value={form.whatsapp}
          onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
          className={field}
          placeholder="+91 99999 99999"
        />
      </label>
      <label className="block">
        <span className={lbl}>Quantity (min. {product.moq})</span>
        <input
          maxLength={LIMITS.short}
          value={form.quantity}
          onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
          className={field}
          placeholder={`e.g. ${product.moq}`}
        />
      </label>
      {status === "error" && (
        <p role="alert" className={dark ? "text-red-200 text-xs" : "text-red-700 text-xs"}>
          Couldn't send just now — your details are still here. Press Send to retry, or use
          WhatsApp.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="pill pill-primary !w-full disabled:opacity-60"
      >
        <span className="pill-label">
          {status === "loading" ? "Sending…" : status === "error" ? "Retry" : "Send enquiry"}
        </span>
        <span className="pill-chip" aria-hidden="true">
          <IconArrow size={15} />
        </span>
      </button>
    </form>
  );
}

/** Desktop: centred two-column dialog. Phones: floating frosted card. */
export function ProductDialog({
  product,
  gallery,
  onClose,
}: {
  product: Product | null;
  gallery: Product[];
  onClose: () => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [compact, setCompact] = useState(() => window.matchMedia("(max-width: 767px)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const on = () => setCompact(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useBackToClose(!!product, onClose);

  useEffect(() => {
    setShowForm(false);
    setLightbox(null);
  }, [product?.id]);

  useScrollLock(!!product);
  useEffect(() => {
    if (!product) return;
    const t = setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && lightbox === null && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [product, onClose, lightbox]);

  const lbItems = gallery
    .filter((g) => g.image)
    .map((g) => ({ src: g.image, alt: g.name, caption: g.name }));
  const lbIndex = product
    ? Math.max(
        0,
        gallery.filter((g) => g.image).findIndex((g) => g.id === product.id),
      )
    : 0;
  const message = product ? productEnquiryText(product.name, product.moq) : "";

  return createPortal(
    <>
      <AnimatePresence>
        {product && compact && (
          // Phones: floating card — full-bleed photo that melts into a frosted
          // blur of itself, with the name, terms and actions on top.
          <motion.div
            key="card"
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          >
            <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="pd-title"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.96 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-[min(88vw,400px)] h-[min(82svh,680px)] overflow-hidden rounded-[34px] bg-[#1b1d1c] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
            >
              {product.image && (
                <>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* frosted lower half: a blurred copy of the same photo, revealed by a mask */}
                  <img
                    src={product.image}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl"
                    style={{
                      maskImage: "linear-gradient(to bottom, transparent 34%, #000 62%)",
                      WebkitMaskImage: "linear-gradient(to bottom, transparent 34%, #000 62%)",
                    }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-black/35"
                    style={{
                      maskImage: "linear-gradient(to bottom, transparent 40%, #000 75%)",
                      WebkitMaskImage: "linear-gradient(to bottom, transparent 40%, #000 75%)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setLightbox(lbIndex)}
                    className="absolute inset-x-0 top-0 h-[46%]"
                    aria-label="Open photo full screen"
                  />
                </>
              )}

              <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-3 pointer-events-none">
                <span className="flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-white/20 backdrop-blur-md text-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]">
                    {product.category}
                  </span>
                  {product.badge && (
                    <span className="rounded-full bg-[var(--gold)] text-deep-black px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]">
                      {product.badge}
                    </span>
                  )}
                </span>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="pointer-events-auto w-10 h-10 rounded-full bg-black/35 backdrop-blur-md text-white grid place-items-center active:scale-95"
                >
                  <IconClose size={16} />
                </button>
              </div>

              <div
                className="absolute inset-x-0 bottom-0 max-h-[64%] overflow-y-auto overscroll-contain px-5 pb-5 pt-6 text-center text-white"
                data-lenis-prevent
                style={{ paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
              >
                {showForm ? (
                  <div className="text-left">
                    <h2
                      id="pd-title"
                      className="font-display text-[1.6rem] leading-tight text-center mb-4"
                    >
                      {product.name}
                    </h2>
                    <QuickForm product={product} onDone={onClose} dark />
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="mt-4 block mx-auto text-[11px] text-white/70 underline underline-offset-4"
                    >
                      ← Back
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="font-display text-[2.1rem] leading-none tabular-nums">
                      {product.moq}
                    </p>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/70 mt-1.5">
                      minimum per style
                    </p>
                    <h2
                      id="pd-title"
                      className="font-display text-[1.55rem] leading-tight mt-4 line-clamp-2"
                    >
                      {product.name}
                    </h2>
                    <p className="text-[12px] text-white/75 mt-1.5">
                      Dispatch in {product.leadTime}
                      {product.price ? ` · ${product.price}` : ""}
                    </p>
                    <a
                      href={waLink(message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 flex items-center justify-center gap-2 w-full h-12 rounded-full bg-white/85 backdrop-blur-md text-charcoal text-[12px] font-semibold uppercase tracking-[0.16em] active:scale-[0.98] transition-transform"
                    >
                      <IconWhatsApp size={16} className="text-[#128C7E]" /> Get a quote
                    </a>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <a
                        href={telLink}
                        aria-label={`Call ${PHONE_DISPLAY}`}
                        className="h-11 rounded-full bg-black/35 backdrop-blur-md grid place-items-center text-[11px] font-semibold uppercase tracking-[0.12em] active:scale-95"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <IconPhone size={14} /> Call
                        </span>
                      </a>
                      <a
                        href={mailLink(`Wholesale enquiry — ${product.name}`, message)}
                        aria-label={`Email ${EMAIL}`}
                        className="h-11 rounded-full bg-black/35 backdrop-blur-md grid place-items-center text-[11px] font-semibold uppercase tracking-[0.12em] active:scale-95"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <IconMail size={14} /> Email
                        </span>
                      </a>
                      <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        aria-label="Prefer a quick form?"
                        className="h-11 rounded-full bg-black/35 backdrop-blur-md text-[11px] font-semibold uppercase tracking-[0.12em] active:scale-95"
                      >
                        Form
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
        {product && !compact && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[100] flex items-end md:items-center justify-center md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          >
            <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="pd-title"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full md:max-w-4xl max-h-[88svh] md:max-h-[86vh] overflow-y-auto overscroll-contain bg-[#F8F6F1] rounded-t-[26px] md:rounded-[26px] shadow-2xl md:grid md:grid-cols-[1.05fr_1fr]"
              data-lenis-prevent
              style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            >
              <div className="md:hidden flex justify-center pt-2.5" aria-hidden="true">
                <span className="w-10 h-1 rounded-full bg-charcoal/20" />
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-white/90 text-charcoal grid place-items-center shadow active:scale-95"
              >
                <IconClose size={16} />
              </button>

              {/* Photo: compact strip on phones, full column on desktop */}
              <button
                type="button"
                onClick={() => product.image && setLightbox(lbIndex)}
                className="relative block w-full overflow-hidden bg-[#EDE9DF] h-48 sm:h-64 md:h-full md:min-h-[520px] md:rounded-l-[26px] mt-2 md:mt-0"
                aria-label="Open photo full screen"
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                {product.image && (
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/55 text-white px-3 py-1 text-[10px] uppercase tracking-[0.18em]">
                    Tap to enlarge
                  </span>
                )}
              </button>

              <div className="p-5 sm:p-7 md:p-9 flex flex-col">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="rounded-full bg-charcoal/[0.06] text-charcoal px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]">
                    {product.category}
                  </span>
                  {product.badge && (
                    <span className="rounded-full bg-[var(--gold)] text-deep-black px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]">
                      {product.badge}
                    </span>
                  )}
                </div>
                <h2
                  id="pd-title"
                  className="font-display text-charcoal text-[1.7rem] md:text-[2.2rem] leading-tight pr-10"
                >
                  {product.name}
                </h2>
                {product.price && (
                  <p className="mt-1.5 text-sm text-charcoal/60">{product.price}</p>
                )}

                <dl className="grid grid-cols-2 gap-2 mt-5">
                  <div className="rounded-2xl bg-white px-4 py-3 border border-charcoal/[0.07]">
                    <dt className="text-[10px] uppercase tracking-[0.16em] text-charcoal/50">
                      Minimum order
                    </dt>
                    <dd className="mt-0.5 text-[15px] font-semibold text-charcoal tabular-nums">
                      {product.moq} per style
                    </dd>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3 border border-charcoal/[0.07]">
                    <dt className="text-[10px] uppercase tracking-[0.16em] text-charcoal/50">
                      Dispatch
                    </dt>
                    <dd className="mt-0.5 text-[15px] font-semibold text-charcoal tabular-nums">
                      {product.leadTime}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 md:mt-auto pt-2">
                  {showForm ? (
                    <>
                      <QuickForm product={product} onDone={onClose} />
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="mt-4 text-[11px] text-charcoal/55 underline underline-offset-4"
                      >
                        ← Back to WhatsApp / call / email
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-charcoal/65 mb-3">
                        Ask for current pricing and availability:
                      </p>
                      <div className="grid gap-2">
                        <a
                          href={waLink(message)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pill pill-wa !w-full"
                        >
                          <span className="pill-label">WhatsApp — pre-filled</span>
                          <span className="pill-chip" aria-hidden="true">
                            <IconWhatsApp size={16} />
                          </span>
                        </a>
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={telLink}
                            className="flex items-center justify-center gap-2 rounded-full border border-charcoal/15 h-12 text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal active:scale-[0.98]"
                            aria-label={`Call ${PHONE_DISPLAY}`}
                          >
                            <IconPhone size={15} /> Call
                          </a>
                          <a
                            href={mailLink(`Wholesale enquiry — ${product.name}`, message)}
                            className="flex items-center justify-center gap-2 rounded-full border border-charcoal/15 h-12 text-[11px] font-semibold uppercase tracking-[0.14em] text-charcoal active:scale-[0.98]"
                            aria-label={`Email ${EMAIL}`}
                          >
                            <IconMail size={15} /> Email
                          </a>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowForm(true)}
                          className="mt-1 text-[12px] text-[var(--emerald-deep)] underline underline-offset-4"
                        >
                          Prefer a quick form?
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {product && lightbox !== null && (
          <Lightbox items={lbItems} index={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </>,
    document.body,
  );
}
