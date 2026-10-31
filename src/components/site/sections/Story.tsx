import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useImg } from "@/hooks/useImg";
import { useSettings, useStats, useSustainabilityCards } from "@/hooks/useSiteData";
import { parseWorkspaceMedia } from "@/lib/siteData";
import { healDeadImage } from "@/lib/siteSettings";
import { waLink, mailLink, FOUNDED_YEAR } from "@/lib/contact";
import terms from "@/data/terms.json";
import { SplitHeading, FadeLines, CurtainImage, CountUp, DrawRule } from "../Primitives";
import { Pill, PillRow } from "../Pill";
import { StackCards } from "../StackCards";
import { Lightbox, type LightboxItem } from "../Lightbox";
import { IconWhatsApp, IconMail, IconPlay } from "../icons";

const yearsInBusiness = new Date().getFullYear() - FOUNDED_YEAR;

/* ─────────── Stats ─────────── */
export function Stats() {
  const { data: dbStats } = useStats();
  const items =
    dbStats && dbStats.length > 0
      ? dbStats.map((s) => ({
          v: s.value,
          prefix: s.prefix || "",
          suffix: s.suffix || "",
          label: s.label,
        }))
      : [
          { v: 500, prefix: "", suffix: "+", label: "Designs ready to ship" },
          { v: 180, prefix: "₹", suffix: "", label: "Starting wholesale price" },
          {
            v: terms.defaultCategory.moqNumber,
            prefix: "",
            suffix: "",
            label: "Pieces minimum per style",
          },
          { v: 20, prefix: "", suffix: "+", label: "States delivered across India" },
        ];
  return (
    <section data-bg="light" className="relative bg-cloud py-24 md:py-32">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--emerald-deep)] mb-12">
          By the numbers
        </p>
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {items.map((it, i) => (
            <div key={i} className="min-w-0">
              <dt className="sr-only">{it.label}</dt>
              <dd>
                <CountUp
                  end={it.v}
                  prefix={it.prefix}
                  suffix={it.suffix}
                  className="font-display text-[var(--emerald-deep)] font-light leading-none text-[clamp(2.6rem,9vw,6rem)]"
                />
                <DrawRule className="my-5 w-16" />
                <span className="block text-[11px] uppercase tracking-[0.22em] text-charcoal/65">
                  {it.label}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ─────────── CTA band ─────────── */
export function CtaBand() {
  const IMG = useImg();
  const { data: settings } = useSettings();
  const pdf = settings?.catalogue_pdf_all || "";
  return (
    <section data-bg="dark" className="relative overflow-hidden bg-[var(--emerald-deep)]">
      {IMG.cta && (
        <div className="absolute inset-0" aria-hidden="true">
          <img
            src={IMG.cta}
            alt=""
            loading="lazy"
            decoding="async"
            onError={healDeadImage}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[var(--emerald-deep)]/85" />
        </div>
      )}
      <div className="relative max-w-5xl mx-auto px-6 py-24 md:py-36 text-center">
        <SplitHeading
          text="Your next bestseller is already in our catalogue."
          className="font-display text-cloud font-light leading-[1.05] text-[clamp(2rem,6.5vw,4.5rem)]"
        />
        <p className="mt-6 font-display italic text-[var(--gold)] text-xl md:text-3xl">
          The only question is when you'd like to start.
        </p>
        <div className="mt-10 flex justify-center">
          <PillRow align="center">
            {pdf ? (
              <Pill href={pdf} newTab variant="primary">
                Download catalogue
              </Pill>
            ) : (
              <Pill to="/catalogue" variant="primary">
                Browse catalogue
              </Pill>
            )}
            <Pill
              href={waLink("Hi TajAttire! I'd like to start a wholesale order.")}
              variant="secondary"
              icon={<IconWhatsApp size={16} />}
            >
              WhatsApp us
            </Pill>
          </PillRow>
        </div>
      </div>
    </section>
  );
}

/* ─────────── Custom orders page ─────────── */
export function CustomOrder() {
  const steps = [
    {
      n: "01",
      t: "Share your reference",
      d: "Send sketches, photos or a sample on WhatsApp or email — fabric, prints, colours and sizes.",
    },
    {
      n: "02",
      t: "Quote within 24 hours",
      d: `We confirm fabric, price per piece and timeline. Minimum ${terms.custom.moq} per design.`,
    },
    {
      n: "03",
      t: "Sample, then bulk",
      d: `Approve a sample, then we manufacture in ${terms.custom.leadTime} with your labels and packaging.`,
    },
  ];
  return (
    <section
      data-bg="dark"
      className="relative bg-[var(--emerald-deep)] pt-36 md:pt-44 pb-24 md:pb-32 overflow-hidden"
    >
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-6">
          Custom & private label
        </p>
        <SplitHeading
          as="h1"
          text="Can't find your style?"
          className="font-display text-cloud font-light leading-[1.02] text-[clamp(2.5rem,8vw,6.5rem)]"
        />
        <SplitHeading
          text="We make it."
          delay={0.15}
          className="font-display italic text-[var(--gold)] font-light leading-[1.02] text-[clamp(2.5rem,8vw,6.5rem)]"
        />
        <p className="mt-8 max-w-xl text-cloud/75 leading-relaxed">
          From fabric selection to the final stitch — share your reference and we'll build your
          private-label range in our Jaipur unit.
        </p>
        <ul className="mt-8 flex flex-wrap gap-2">
          {[
            "Custom prints",
            "Fabric selection",
            "Embroidery",
            "Woven labels",
            "Hang tags",
            "Branded cartons",
          ].map((p) => (
            <li
              key={p}
              className="rounded-full border border-cloud/25 bg-white/5 px-3.5 py-1.5 text-[10.5px] uppercase tracking-[0.14em] text-cloud/85"
            >
              {p}
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <PillRow>
            <Pill
              href={waLink("Hi TajAttire! I'd like to discuss a custom / private-label order.")}
              variant="primary"
              icon={<IconWhatsApp size={16} />}
            >
              Discuss on WhatsApp
            </Pill>
            <Pill
              href={mailLink(
                "Custom order — reference images",
                "Hi TajAttire,\n\nPlease find my reference images attached.\n\nQuantity per design:\nFabric preference:\nDelivery city:\n",
              )}
              variant="secondary"
              icon={<IconMail size={16} />}
            >
              Email references
            </Pill>
          </PillRow>
        </div>

        <ol className="mt-20 grid md:grid-cols-3 gap-4 md:gap-6">
          {steps.map((s, i) => (
            <motion.li
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[22px] border border-white/10 bg-[#0E1E15]/60 p-6 md:p-8"
            >
              <span className="font-display text-[var(--gold)] text-4xl tabular-nums">{s.n}</span>
              <h2 className="font-display text-cloud text-2xl mt-4">{s.t}</h2>
              <p className="text-cloud/65 text-sm leading-relaxed mt-2">{s.d}</p>
            </motion.li>
          ))}
        </ol>
        <p className="mt-10 text-[var(--gold)]/70 text-[11px] uppercase tracking-[0.25em]">
          Minimum {terms.custom.moq} per design · {terms.custom.leadTime} production ·{" "}
          {terms.payment.split(" (")[0]}
        </p>
      </div>
    </section>
  );
}

/* ─────────── Craft ─────────── */
export function Craft() {
  const IMG = useImg();
  return (
    <section
      id="craft"
      data-bg="light"
      className="relative bg-cloud pt-36 md:pt-44 pb-24 md:pb-32 overflow-hidden"
    >
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
        <CurtainImage
          src={IMG.craft}
          alt="TajAttire garments"
          className="aspect-[4/5] w-full rounded-[26px]"
          onError={healDeadImage}
        />
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--emerald-deep)] mb-6">
            Our craft
          </p>
          <SplitHeading
            as="h1"
            text="Not just fabric."
            className="font-display text-[var(--emerald-deep)] font-light leading-[1.02] text-[clamp(2.4rem,6vw,5rem)]"
          />
          <SplitHeading
            text="A standard."
            delay={0.15}
            className="font-display italic text-[var(--emerald-deep)] font-light leading-[1.02] text-[clamp(2.4rem,6vw,5rem)]"
          />
          <FadeLines
            className="mt-10 space-y-5"
            lineClass="text-charcoal/80 leading-relaxed border-l-2 border-[var(--gold)] pl-5"
            lines={[
              "Every kurti that leaves our floor is checked twice before it is packed.",
              "We work with skilled hands, not just machines — your customers can feel the difference.",
              "From first sample to final shipment, we treat your order as our reputation on the line.",
            ]}
          />
          <DrawRule className="mt-12" />
          <dl className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-[11px] uppercase tracking-[0.18em] text-charcoal/65">
            {[
              [terms.designCount, "Designs"],
              [terms.startingPrice, "From"],
              [String(terms.defaultCategory.moqNumber), "Min. pcs"],
              [String(FOUNDED_YEAR), "Founded"],
            ].map(([v, l]) => (
              <div key={l} className="flex flex-col">
                <dt className="order-2">{l}</dt>
                <dd className="order-1 font-display text-[var(--emerald-deep)] text-2xl normal-case tracking-normal tabular-nums">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ─────────── Why TajAttire — stacking cards ─────────── */
const WHYS = [
  {
    n: "01",
    title: "A minimum that respects your reality",
    copy: `${terms.defaultCategory.moqNumber} pieces per style. Not 500, not 1,000 — we built our model around what it really takes to stock a store.`,
    badge: terms.defaultCategory.moq,
  },
  {
    n: "02",
    title: "Pricing built for retail margins",
    copy: `Wholesale rates from ${terms.startingPrice} per piece, so you can compete on price and still earn a healthy margin.`,
    badge: `From ${terms.startingPrice}`,
  },
  {
    n: "03",
    title: "Quality you can put your name on",
    copy: "Every dispatch is quality-checked twice. Defective pieces are replaced in your next order.",
    badge: "Checked twice",
  },
  {
    n: "04",
    title: "Across India, on schedule",
    copy: `Catalogue orders dispatch in ${terms.defaultCategory.leadTime} via ${terms.couriers}, to ${terms.states} states and counting.`,
    badge: terms.defaultCategory.leadTime,
  },
];

export function Why({ next }: { next?: ReactNode }) {
  return (
    <section
      data-bg="dark"
      className="relative bg-[var(--emerald-deep)] pt-24 md:pt-32 overflow-x-clip"
    >
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <SplitHeading
            text="The partner your margins have been waiting for."
            className="font-display text-cloud font-light max-w-3xl leading-[1.05] text-[clamp(2rem,5.5vw,4.5rem)]"
          />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)]">
            Why TajAttire
          </span>
        </div>
      </div>
      {/* Cards are width-limited individually so the section that slides over them can be full width */}
      <StackCards
        next={next}
        cards={WHYS.map((w) => (
          <div key={w.n} className="max-w-4xl mx-auto px-6">
            <article className="relative rounded-[26px] border border-[var(--gold)]/20 bg-[#0A2416] p-7 md:p-12 shadow-[0_-18px_40px_rgba(0,0,0,0.35)]">
              <div className="flex items-start justify-between gap-6">
                <span className="font-display text-[var(--gold)]/50 text-5xl md:text-7xl leading-none tabular-nums">
                  {w.n}
                </span>
                <span className="rounded-full border border-[var(--gold)]/60 text-[var(--gold)] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] whitespace-nowrap">
                  {w.badge}
                </span>
              </div>
              <h3 className="font-display text-cloud text-[1.8rem] md:text-[2.6rem] font-light leading-tight mt-8">
                {w.title}
              </h3>
              <p className="text-cloud/70 leading-relaxed mt-3 max-w-2xl">{w.copy}</p>
            </article>
          </div>
        ))}
      />
    </section>
  );
}

/* ─────────── How it works ─────────── */
const STEPS = [
  {
    n: "01",
    title: "Browse the collection",
    copy: "Explore kurtis, gowns and tops online, or ask for the full lookbook on WhatsApp.",
  },
  {
    n: "02",
    title: "Send your enquiry",
    copy: "WhatsApp, call or use the form. Share styles, quantities and your delivery city — we reply within 2 business hours.",
  },
  {
    n: "03",
    title: "Confirm and receive",
    copy: `Pay the advance, we produce or dispatch in ${terms.defaultCategory.leadTime}, quality-checked and on schedule.`,
  },
];

export function HowItWorks() {
  return (
    <section data-bg="light" className="relative bg-cloud py-24 md:py-32">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="mb-14 md:mb-20 max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--emerald-deep)]">
            How it works
          </p>
          <SplitHeading
            text="From first look to first shipment."
            className="mt-5 font-display text-[var(--emerald-deep)] font-light leading-[1.05] text-[clamp(2.1rem,6vw,4.8rem)]"
          />
        </div>
        <ol className="grid md:grid-cols-3 gap-10 md:gap-8">
          {STEPS.map((s, i) => (
            <motion.li
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <DrawRule className="mb-6" />
              <span className="font-display text-[var(--gold)] text-5xl md:text-6xl tabular-nums">
                {s.n}
              </span>
              <h3 className="font-display text-[var(--emerald-deep)] text-2xl md:text-3xl mt-4">
                {s.title}
              </h3>
              <p className="text-charcoal/70 leading-relaxed mt-3">{s.copy}</p>
            </motion.li>
          ))}
        </ol>
        <div className="mt-14">
          <Pill to="/contact" variant="secondary-dark">
            Send an enquiry
          </Pill>
        </div>
      </div>
    </section>
  );
}

/* ─────────── Sustainability — only the owner's own cards ─────────── */
export function SustainabilitySection() {
  const { data: cards } = useSustainabilityCards();
  if (!cards || cards.length === 0) return null;
  return (
    <section data-bg="dark" className="relative bg-[#0A2416] py-24 md:py-32">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12 grid md:grid-cols-2 gap-12 md:gap-16 items-start">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-6">
            Responsibility
          </p>
          <SplitHeading
            text="Made responsibly."
            className="font-display text-cloud font-light leading-[1.05] text-[clamp(2rem,5vw,4rem)]"
          />
          <SplitHeading
            text="Worn proudly."
            delay={0.15}
            className="font-display italic text-cloud font-light leading-[1.05] text-[clamp(2rem,5vw,4rem)]"
          />
        </div>
        <div className="grid gap-4">
          {cards.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[22px] border border-[var(--gold)]/20 p-6 md:p-8"
            >
              <div className="font-display text-[var(--gold)] text-4xl">{c.value}</div>
              <div className="text-cloud text-[11px] uppercase tracking-[0.2em] mt-2">
                {c.label}
              </div>
              {c.detail && <p className="text-cloud/60 text-sm leading-relaxed mt-3">{c.detail}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── Inside the workspace + gallery ─────────── */
export function ManufacturingTeaser() {
  const { data: settings } = useSettings();
  const media = parseWorkspaceMedia(settings?.workspace_media_json).filter((m) => m.url);
  const [lb, setLb] = useState<number | null>(null);
  const items: LightboxItem[] = media.map((m) => ({
    src: m.url,
    alt: m.label || "TajAttire workspace",
    type: m.type,
    caption: m.label,
  }));

  return (
    <section data-bg="dark" className="relative bg-deep-black py-24 md:py-32">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-[1fr_1.1fr] gap-10 md:gap-16 items-end mb-12">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-6">
              Inside our workspace
            </p>
            <SplitHeading
              text="See how we"
              className="font-display text-cloud font-light leading-[1.05] text-[clamp(2rem,5vw,4rem)]"
            />
            <SplitHeading
              text="make everything."
              delay={0.15}
              className="font-display italic text-cloud font-light leading-[1.05] text-[clamp(2rem,5vw,4rem)]"
            />
          </div>
          <div>
            <FadeLines
              lineClass="text-cloud/70 leading-relaxed mb-4"
              lines={[
                "From fabric rolls to finished, tagged and packed garments — every step happens in our Jaipur unit, and buyers are welcome to visit.",
              ]}
            />
            <dl className="flex flex-wrap gap-8 mt-6 text-[11px] uppercase tracking-[0.2em] text-cloud/55">
              <div className="flex flex-col">
                <dt className="order-2">Years in business</dt>
                <dd className="order-1 font-display text-[var(--gold)] text-3xl normal-case tracking-normal tabular-nums">
                  {yearsInBusiness}
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="order-2">Active designs</dt>
                <dd className="order-1 font-display text-[var(--gold)] text-3xl normal-case tracking-normal tabular-nums">
                  {terms.designCount}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {media.length > 0 && (
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {media.slice(0, 6).map((m, i) => (
              <li key={m.id} className={i === 0 ? "col-span-2 md:col-span-1 md:row-span-2" : ""}>
                <button
                  type="button"
                  onClick={() => setLb(i)}
                  className="group relative block w-full h-full overflow-hidden rounded-[20px] bg-[#13201A] aspect-[4/3] md:aspect-auto md:min-h-[220px]"
                  aria-label={`Open ${m.label || "photo"}`}
                >
                  {m.type === "video" ? (
                    <>
                      <video
                        src={m.url}
                        muted
                        loop
                        autoPlay
                        playsInline
                        preload="metadata"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <span
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/55 text-white grid place-items-center"
                        aria-hidden="true"
                      >
                        <IconPlay size={13} />
                      </span>
                    </>
                  ) : (
                    <img
                      src={m.url}
                      alt={m.label || ""}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out [@media(hover:hover)]:group-hover:scale-105"
                    />
                  )}
                  {m.label && (
                    <span className="absolute left-3 bottom-3 rounded-full bg-black/55 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--gold)]">
                      {m.label}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10">
          <PillRow>
            <Pill
              href={waLink("Hi TajAttire! I'd like to book a visit to your Jaipur unit.")}
              variant="primary"
              icon={<IconWhatsApp size={16} />}
            >
              Book a factory visit
            </Pill>
            {media.length > 6 && (
              <Pill onClick={() => setLb(0)} variant="secondary">
                All photos & videos ({media.length})
              </Pill>
            )}
          </PillRow>
        </div>
      </div>
      <AnimatePresence>
        {lb !== null && <Lightbox items={items} index={lb} onClose={() => setLb(null)} />}
      </AnimatePresence>
    </section>
  );
}
