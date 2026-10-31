import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTestimonials, useInstagramImages, useFaqItems } from "@/hooks/useSiteData";
import { DEFAULT_FAQ } from "@/lib/seo";
import { waLink, INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/lib/contact";
import { SplitHeading } from "../Primitives";
import { Pill, PillRow } from "../Pill";
import { IconChevron, IconInstagram, IconWhatsApp } from "../icons";

/* ─────────── Testimonials — only real ones entered by the owner ─────────── */
export function Testimonials() {
  const { data, isLoading } = useTestimonials();
  const items = data ?? [];
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const touchX = useRef(0);

  const go = (d: 1 | -1) => {
    setDir(d);
    setCurrent((p) => (p + d + items.length) % items.length);
  };

  useEffect(() => {
    if (paused || reduce || items.length < 2) return;
    const t = setInterval(() => {
      setDir(1);
      setCurrent((p) => (p + 1) % items.length);
    }, 6000);
    return () => clearInterval(t);
  }, [paused, reduce, items.length, current]);

  return (
    <section
      data-bg="dark"
      className="relative bg-[var(--emerald-deep)] pt-36 md:pt-44 pb-24 md:pb-32 overflow-x-clip"
    >
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)]">Reviews</p>
        <SplitHeading
          as="h1"
          text="What retailers say."
          className="mt-5 font-display text-cloud font-light leading-[1.02] text-[clamp(2.4rem,7vw,5.5rem)]"
        />

        {isLoading ? (
          <div className="mt-12 h-72 max-w-3xl rounded-[26px] bg-white/5" aria-hidden="true" />
        ) : items.length === 0 ? (
          <div className="mt-12 max-w-3xl rounded-[26px] border border-white/10 bg-[#0A2416] p-8 md:p-12">
            <p className="font-display text-cloud text-2xl md:text-3xl leading-snug">
              We're gathering reviews from our retail partners.
            </p>
            <p className="text-cloud/65 mt-3 leading-relaxed">
              Want to hear from a store that stocks TajAttire? Ask us on WhatsApp and we'll put you
              in touch, or visit our Jaipur unit to see the work yourself.
            </p>
            <div className="mt-8">
              <Pill
                href={waLink("Hi TajAttire! Could you share references from retailers you supply?")}
                variant="primary"
                icon={<IconWhatsApp size={16} />}
              >
                Ask for references
              </Pill>
            </div>
          </div>
        ) : (
          <div
            className="relative mt-12 max-w-3xl"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="relative min-h-[300px] md:min-h-[320px]">
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.figure
                  key={current}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir * -40 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  onTouchStart={(e) => {
                    touchX.current = e.touches[0].clientX;
                    setPaused(true);
                  }}
                  onTouchEnd={(e) => {
                    const d = touchX.current - e.changedTouches[0].clientX;
                    if (Math.abs(d) > 40) go(d > 0 ? 1 : -1);
                    setPaused(false);
                  }}
                  className="rounded-[26px] border border-[var(--gold)]/20 bg-[#0A2416] p-8 md:p-12"
                >
                  <div
                    className="flex gap-1 mb-6 text-[var(--gold)]"
                    aria-label={`${items[current].stars || 5} out of 5`}
                  >
                    {Array.from({
                      length: Math.max(1, Math.min(5, items[current].stars || 5)),
                    }).map((_, j) => (
                      <span key={j} aria-hidden="true">
                        ★
                      </span>
                    ))}
                  </div>
                  <blockquote className="font-display italic text-cloud leading-snug text-[clamp(1.25rem,2.6vw,1.75rem)]">
                    “{items[current].quote}”
                  </blockquote>
                  <figcaption className="mt-8">
                    <span className="block text-cloud font-medium text-sm">
                      {items[current].name}
                    </span>
                    {items[current].role && (
                      <span className="block text-cloud/55 text-[11px] uppercase tracking-[0.18em] mt-1">
                        {items[current].role}
                      </span>
                    )}
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
            {items.length > 1 && (
              <div className="flex items-center gap-5 mt-8">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous review"
                  className="w-11 h-11 rounded-full border border-[var(--gold)]/40 text-[var(--gold)] grid place-items-center active:scale-95"
                >
                  <IconChevron dir="left" />
                </button>
                <span
                  className="text-xs tabular-nums tracking-[0.2em] text-cloud/60"
                  aria-live="polite"
                >
                  {current + 1} / {items.length}
                </span>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next review"
                  className="w-11 h-11 rounded-full border border-[var(--gold)]/40 text-[var(--gold)] grid place-items-center active:scale-95"
                >
                  <IconChevron />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─────────── Instagram — only the owner's own images ─────────── */
export function InstagramGrid() {
  const { data } = useInstagramImages();
  const images = (data ?? []).filter((i) => i.image_url);
  return (
    <section data-bg="light" className="relative bg-cloud py-24 md:py-32">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--emerald-deep)] mb-5">
              Follow the journey
            </p>
            <h2 className="font-display text-[var(--emerald-deep)] font-light leading-[1.05] text-[clamp(2rem,5vw,4rem)]">
              {INSTAGRAM_HANDLE} <span className="italic">on Instagram</span>
            </h2>
          </div>
          <Pill href={INSTAGRAM_URL} variant="secondary-dark" icon={<IconInstagram size={16} />}>
            Follow us
          </Pill>
        </div>
        {images.length > 0 && (
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
            {images.slice(0, 6).map((img) => (
              <li key={img.id}>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-square overflow-hidden rounded-[14px] bg-[#EDE9DF]"
                >
                  <img
                    src={img.image_url}
                    alt={img.alt || "TajAttire on Instagram"}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out [@media(hover:hover)]:group-hover:scale-105"
                  />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

/* ─────────── FAQ ─────────── */
export function FAQ() {
  const { data } = useFaqItems();
  const items =
    data && data.length > 0 ? data.map((f) => ({ q: f.question, a: f.answer })) : DEFAULT_FAQ;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section data-bg="light" className="relative bg-cloud pt-36 md:pt-44 pb-24 md:pb-32">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12 grid lg:grid-cols-[1fr_1.6fr] gap-12 lg:gap-20">
        <div className="lg:sticky lg:top-28 self-start">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--emerald-deep)] mb-5">
            Frequently asked
          </p>
          <SplitHeading
            as="h1"
            text="Questions buyers"
            className="font-display text-[var(--emerald-deep)] font-light leading-[1.02] text-[clamp(2.4rem,6vw,5rem)]"
          />
          <SplitHeading
            text="always ask us."
            delay={0.15}
            className="font-display italic text-[var(--emerald-deep)] font-light leading-[1.02] text-[clamp(2.4rem,6vw,5rem)]"
          />
          <p className="mt-6 text-charcoal/60 max-w-sm leading-relaxed">
            Everything to know before your first wholesale order. Still unsure? Ask us directly.
          </p>
          <div className="mt-8">
            <PillRow>
              <Pill
                href={waLink("Hi TajAttire! I have a question about ordering.")}
                variant="wa"
                icon={<IconWhatsApp size={16} />}
              >
                Ask on WhatsApp
              </Pill>
            </PillRow>
          </div>
        </div>
        <div>
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-charcoal/10">
                <h2>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="font-display text-charcoal text-[1.25rem] md:text-[1.45rem] leading-snug">
                      {item.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 w-8 h-8 rounded-full border border-[var(--gold)]/50 text-[var(--gold)] grid place-items-center transition-transform duration-300"
                      style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M6 2v8M2 6h8" />
                      </svg>
                    </span>
                  </button>
                </h2>
                {/* grid-rows trick: height animates without measuring, content stays in the DOM for crawlers */}
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 pr-10 text-charcoal/70 leading-relaxed border-l-2 border-[var(--gold)] pl-5">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
