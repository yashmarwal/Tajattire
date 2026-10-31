import { useState } from "react";
import { motion } from "framer-motion";
import { useTestimonials, useFaqItems } from "@/hooks/useSiteData";
import { DEFAULT_FAQ } from "@/lib/seo";
import { waLink, GSTIN, FOUNDED_YEAR } from "@/lib/contact";
import { SplitHeading } from "../Primitives";
import { Pill, PillRow } from "../Pill";
import { IconWhatsApp } from "../icons";

/* ─────────── Reviews: a wall of real quotes + ways to verify us ─────────── */
const Stars = ({ n, className = "" }: { n: number; className?: string }) => (
  <span className={`inline-flex gap-0.5 ${className}`} aria-label={`${n} out of 5`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        width="14"
        height="14"
        viewBox="0 0 24 24"
        aria-hidden="true"
        fill={i < n ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
      </svg>
    ))}
  </span>
);

export function Testimonials() {
  const { data } = useTestimonials();
  const items = (data ?? []).filter((t) => t.quote?.trim());
  const avg = items.length
    ? items.reduce((s, t) => s + Math.max(1, Math.min(5, t.stars || 5)), 0) / items.length
    : 0;

  const proofs = [
    {
      k: "01",
      title: "Order a sample first",
      copy: "Samples cost a nominal charge that's adjusted against your first bulk order — judge the stitching yourself.",
      cta: {
        label: "Ask for a sample",
        href: waLink("Hi TajAttire! I'd like to order a sample before a bulk order."),
      },
    },
    {
      k: "02",
      title: "Visit our Jaipur unit",
      copy: "Buyers are welcome by appointment to see the range, the floor and the quality checks in person.",
      cta: {
        label: "Book a visit",
        href: waLink("Hi TajAttire! I'd like to book a visit to your Jaipur unit."),
      },
    },
    {
      k: "03",
      title: "Speak to a store we supply",
      copy: "Ask us and we'll connect you with a retailer who already stocks TajAttire.",
      cta: {
        label: "Ask for references",
        href: waLink("Hi TajAttire! Could you share references from retailers you supply?"),
      },
    },
    {
      k: "04",
      title: `Registered business since ${FOUNDED_YEAR}`,
      copy: `GST-registered wholesale manufacturer in Jaipur. GSTIN ${GSTIN}.`,
    },
  ];

  return (
    <section data-bg="light" className="relative bg-cloud pt-36 md:pt-44 pb-24 md:pb-32">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <header className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--emerald-deep)] mb-5">
              Reviews & trust
            </p>
            <SplitHeading
              as="h1"
              text="Trusted the"
              className="font-display text-charcoal font-light leading-[1.02] text-[clamp(2.4rem,7vw,5.5rem)]"
            />
            <SplitHeading
              text="old-fashioned way."
              delay={0.12}
              className="font-display italic text-[var(--emerald-deep)] font-light leading-[1.02] text-[clamp(2.4rem,7vw,5.5rem)]"
            />
          </div>
          <div className="lg:min-h-[136px] flex items-end">
            {items.length > 0 ? (
              <div className="rounded-[26px] bg-[var(--emerald-deep)] text-cloud p-7 flex items-center gap-6">
                <span className="font-display text-6xl leading-none tabular-nums">
                  {avg.toFixed(1)}
                </span>
                <span>
                  <Stars n={Math.round(avg)} className="text-[var(--gold)]" />
                  <span className="block text-[12px] text-cloud/70 mt-1.5">
                    From {items.length} retailer review{items.length > 1 ? "s" : ""}
                  </span>
                </span>
              </div>
            ) : (
              <p className="text-charcoal/65 leading-relaxed max-w-md">
                We'd rather you check than take our word for it. Here are four ways to see our work
                for yourself — reviews from our retail partners will appear here as they share them.
              </p>
            )}
          </div>
        </header>

        <div className="mt-14 md:mt-16">
          <h2 className="font-display text-charcoal text-[clamp(1.6rem,3.5vw,2.6rem)] leading-tight">
            Four ways to check us yourself.
          </h2>
          <ul className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {proofs.map((p) => (
              <li
                key={p.k}
                className="rounded-[24px] bg-white border border-charcoal/[0.07] p-6 flex flex-col"
              >
                <span className="font-display text-[var(--gold)] text-3xl tabular-nums">{p.k}</span>
                <h3 className="font-display text-charcoal text-xl mt-4 leading-snug">{p.title}</h3>
                <p className="text-charcoal/65 text-sm leading-relaxed mt-2 flex-1">{p.copy}</p>
                {p.cta && (
                  <a
                    href={p.cta.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--emerald-deep)]"
                  >
                    <IconWhatsApp size={14} /> {p.cta.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Real reviews come after the proof tiles, so when they load nothing above them moves */}
        {items.length > 0 && (
          <div className="mt-16 md:mt-20">
            <h2 className="font-display text-charcoal text-[clamp(1.6rem,3.5vw,2.6rem)] leading-tight">
              What retailers say
            </h2>
            <ul className="mt-8 columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-5 [column-fill:_balance]">
              {items.map((t, i) => (
                <motion.li
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                  transition={{ duration: 0.7, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="break-inside-avoid mb-4 md:mb-5"
                >
                  <figure
                    className={`rounded-[24px] p-7 md:p-8 border ${i === 0 ? "bg-[var(--deep-black)] text-cloud border-transparent" : "bg-white text-charcoal border-charcoal/[0.07]"}`}
                  >
                    <Stars
                      n={Math.max(1, Math.min(5, t.stars || 5))}
                      className="text-[var(--gold)]"
                    />
                    <blockquote
                      className={`font-display leading-snug mt-5 ${i === 0 ? "text-[1.6rem] md:text-[1.9rem]" : "text-[1.25rem]"}`}
                    >
                      “{t.quote}”
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-3">
                      <span
                        className={`w-9 h-9 rounded-full grid place-items-center text-[13px] font-semibold ${i === 0 ? "bg-[var(--gold)] text-deep-black" : "bg-[var(--emerald-deep)] text-cloud"}`}
                        aria-hidden="true"
                      >
                        {t.name.trim().charAt(0).toUpperCase()}
                      </span>
                      <span>
                        <span className="block text-sm font-medium">{t.name}</span>
                        {t.role && (
                          <span
                            className={`block text-[11px] uppercase tracking-[0.16em] ${i === 0 ? "text-cloud/55" : "text-charcoal/50"}`}
                          >
                            {t.role}
                          </span>
                        )}
                      </span>
                    </figcaption>
                  </figure>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-16 rounded-[26px] bg-[var(--emerald-deep)] px-6 py-10 md:px-12 md:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <p className="font-display text-cloud text-[clamp(1.5rem,3vw,2.2rem)] leading-tight max-w-xl">
            Stock TajAttire?{" "}
            <span className="italic text-[var(--gold)]">We'd love to hear how it sells.</span>
          </p>
          <PillRow>
            <Pill
              href={waLink("Hi TajAttire! I'd like to share a review of your products.")}
              variant="primary"
              icon={<IconWhatsApp size={16} />}
            >
              Share your review
            </Pill>
          </PillRow>
        </div>
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
