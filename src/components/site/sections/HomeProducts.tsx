import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useProducts, type Product } from "@/lib/catalog";
import { useSettings } from "@/hooks/useSiteData";
import { usePageTransition } from "@/lib/PageTransitionContext";
import terms from "@/data/terms.json";
import { SplitHeading } from "../Primitives";
import { Pill } from "../Pill";
import { ProductCard } from "../products/ProductCard";
import { ProductDialog } from "../products/ProductDialog";
import { IconChevron, IconArrow } from "../icons";

/* ─────────── Collections → filtered catalogue ─────────── */
export function Collections() {
  const { products, categories } = useProducts();
  const navigate = usePageTransition();
  const coverFor = (name: string) =>
    products.find((p) => p.category.toLowerCase() === name.toLowerCase() && p.image)?.image;
  const countFor = (name: string) =>
    products.filter((p) => p.category.toLowerCase() === name.toLowerCase()).length;
  const WORDS = ["One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const rangesTitle = `${WORDS[categories.length - 1] ?? categories.length} ranges.`;

  return (
    <section id="collections" data-bg="dark" className="relative bg-deep-black py-24 md:py-36">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-5">
              01 — Collections
            </p>
            <SplitHeading
              key={rangesTitle}
              text={rangesTitle}
              className="font-display text-cloud font-light leading-[1.02] text-[clamp(2.3rem,6.5vw,5rem)]"
            />
            <SplitHeading
              text="One standard."
              delay={0.12}
              className="font-display italic text-[var(--gold)] font-light leading-[1.02] text-[clamp(2.3rem,6.5vw,5rem)]"
            />
          </div>
          <p className="text-cloud/60 max-w-sm leading-relaxed">
            Every range ships from {terms.defaultCategory.moqNumber} pieces per style. Pick a
            collection to see what's ready now.
          </p>
        </div>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {categories.map((c, i) => {
            const cover = coverFor(c.name);
            const n = countFor(c.name);
            return (
              <motion.li
                key={c.slug}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <a
                  href={`/catalogue/${c.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/catalogue/${c.slug}`);
                  }}
                  className="group relative block aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-[24px] bg-[#13201A] border border-white/[0.06]"
                >
                  {cover ? (
                    <img
                      src={cover}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-[1.2s] ease-out [@media(hover:hover)]:group-hover:scale-105"
                    />
                  ) : (
                    <span aria-hidden="true" className="absolute inset-0 grid place-items-center">
                      <img
                        src="/images/logo-mark-160.webp"
                        alt=""
                        width={141}
                        height={160}
                        className="w-28 opacity-[0.12]"
                      />
                    </span>
                  )}
                  <span
                    className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0)_35%,rgba(10,10,10,0.85)_100%)]"
                    aria-hidden="true"
                  />
                  <span className="absolute left-5 right-5 bottom-5 flex items-end justify-between gap-4">
                    <span>
                      <span className="block text-[10px] uppercase tracking-[0.28em] text-[var(--gold)] tabular-nums">
                        {String(i + 1).padStart(2, "0")} ·{" "}
                        {n > 0 ? `${n} online` : "Lookbook on request"}
                      </span>
                      <span className="block font-display text-cloud text-[2.2rem] md:text-[2.6rem] leading-none mt-2">
                        {c.name}
                      </span>
                      <span className="block text-cloud/60 text-[12px] mt-2">
                        Min. {c.moq} · {c.leadTime}
                      </span>
                    </span>
                    <span
                      className="shrink-0 w-11 h-11 rounded-full bg-[var(--gold)] text-deep-black grid place-items-center transition-transform duration-500 [@media(hover:hover)]:group-hover:-rotate-45"
                      aria-hidden="true"
                    >
                      <IconArrow size={16} />
                    </span>
                  </span>
                </a>
              </motion.li>
            );
          })}
        </ul>

        {/* Custom collection band */}
        <div className="mt-6 md:mt-8 rounded-[24px] border border-[var(--gold)]/25 bg-[var(--emerald-deep)] px-6 py-10 md:px-12 md:py-12 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--gold)] mb-3">
              Build something yours
            </p>
            <p className="font-display text-cloud text-[clamp(1.7rem,4vw,2.8rem)] leading-tight">
              Want a collection <span className="italic text-[var(--gold)]">nobody else has?</span>
            </p>
            <p className="mt-3 text-cloud/70 max-w-xl leading-relaxed text-[15px]">
              Custom prints, fabric selection, embroidery and your own labels — from{" "}
              {terms.custom.moq} per design.
            </p>
          </div>
          <Pill to="/custom-orders" variant="primary" className="shrink-0">
            Start a custom order
          </Pill>
        </div>
      </div>
    </section>
  );
}

/* ─────────── Editorial section header ─────────── */
function SectionHeader({
  eyebrow,
  count,
  titleA,
  titleB,
  copy,
  dark,
  controls,
}: {
  eyebrow: string;
  count: number;
  titleA: string;
  titleB: string;
  copy: string;
  dark?: boolean;
  controls?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 md:mb-12">
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-5">
          <span
            className={`text-[10px] uppercase tracking-[0.3em] ${dark ? "text-[var(--gold)]" : "text-[var(--emerald-deep)]"}`}
          >
            {eyebrow}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold tabular-nums ${dark ? "bg-white/10 text-cloud" : "bg-charcoal/[0.07] text-charcoal"}`}
          >
            {count}
          </span>
        </div>
        <h2
          className={`font-display font-light leading-[1.02] text-[clamp(2.2rem,6vw,4.6rem)] ${dark ? "text-cloud" : "text-charcoal"}`}
        >
          {titleA}{" "}
          <span className={`italic ${dark ? "text-[var(--gold)]" : "text-[var(--emerald-deep)]"}`}>
            {titleB}
          </span>
        </h2>
        <p className={`mt-4 leading-relaxed ${dark ? "text-cloud/60" : "text-charcoal/60"}`}>
          {copy}
        </p>
      </div>
      {controls}
    </div>
  );
}

/* ─────────── Most loved (best sellers) — native scroll-snap carousel ─────────── */
export function MostLoved() {
  const { products } = useProducts();
  const { data: settings } = useSettings();
  const items = useMemo(() => products.filter((p) => p.badge === "Best seller"), [products]);
  const [open, setOpen] = useState<Product | null>(null);
  const rowRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const navigate = usePageTransition();

  const onScroll = useCallback(() => {
    const row = rowRef.current;
    if (!row) return;
    const max = row.scrollWidth - row.clientWidth;
    setProgress(max > 0 ? row.scrollLeft / max : 1);
    const first = row.children[0] as HTMLElement | undefined;
    if (first) {
      const step =
        first.getBoundingClientRect().width + parseFloat(getComputedStyle(row).columnGap || "16");
      setIndex(Math.min(items.length - 1, Math.round(row.scrollLeft / step)));
    }
  }, [items.length]);

  useEffect(() => {
    onScroll();
  }, [onScroll]);

  const step = (dir: 1 | -1) => {
    const row = rowRef.current;
    const first = row?.children[0] as HTMLElement | undefined;
    if (!row || !first) return;
    const w =
      first.getBoundingClientRect().width + parseFloat(getComputedStyle(row).columnGap || "16");
    row.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  if (items.length === 0) return null;
  const atStart = progress <= 0.01;
  const atEnd = progress >= 0.99;
  const pdfFor = (c: string) =>
    settings?.[`catalogue_pdf_${c.toLowerCase()}`] || settings?.catalogue_pdf_all || "";

  return (
    <section
      data-bg="light"
      className="relative bg-cloud pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden"
      aria-labelledby="most-loved"
    >
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12" id="most-loved">
        <SectionHeader
          eyebrow="Most loved"
          count={items.length}
          titleA="What retailers"
          titleB="reorder."
          copy="Our best-selling styles right now — tap any piece for pricing and availability."
          controls={
            <div className="flex items-center justify-between md:justify-end gap-5">
              <a
                href="/catalogue"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/catalogue");
                }}
                className="hidden md:inline-flex pill pill-tertiary"
              >
                <span className="pill-label !text-[var(--emerald-deep)]">See everything</span>
                <span
                  className="pill-chip !border-[var(--emerald-deep)]/40 !text-[var(--emerald-deep)]"
                  aria-hidden="true"
                >
                  <IconArrow size={14} />
                </span>
              </a>
              <span
                className="md:hidden whitespace-nowrap text-xs tabular-nums tracking-[0.2em] text-charcoal/60"
                aria-live="polite"
              >
                {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
              <div className="flex gap-2 md:hidden">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  disabled={atStart}
                  aria-label="Previous"
                  className="w-11 h-11 rounded-full border border-charcoal/20 grid place-items-center disabled:opacity-30 active:scale-95"
                >
                  <IconChevron dir="left" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  disabled={atEnd}
                  aria-label="Next"
                  className="w-11 h-11 rounded-full border border-charcoal/20 grid place-items-center disabled:opacity-30 active:scale-95"
                >
                  <IconChevron />
                </button>
              </div>
            </div>
          }
        />
      </div>

      <div className="max-w-[1500px] mx-auto">
        <ul ref={rowRef} onScroll={onScroll} className="snap-row" aria-label="Best sellers">
          {items.map((p, i) => (
            <li key={p.id} className="min-w-0">
              <ProductCard
                product={p}
                onOpen={setOpen}
                catalogueUrl={pdfFor(p.category)}
                eager={i < 2}
              />
            </li>
          ))}
        </ul>
        <div className="px-6 lg:px-12 -mt-4" aria-hidden="true">
          <div className="h-[2px] rounded-full bg-charcoal/10 overflow-hidden">
            <div
              className="h-full w-full bg-[var(--emerald-deep)] origin-left transition-transform duration-200"
              style={{ transform: `scaleX(${Math.max(0.08, progress)})` }}
            />
          </div>
        </div>
        <div className="hidden md:flex justify-end gap-2 px-6 lg:px-12 mt-5">
          <button
            type="button"
            onClick={() => step(-1)}
            disabled={atStart}
            aria-label="Previous"
            className="w-11 h-11 rounded-full border border-charcoal/20 grid place-items-center disabled:opacity-30"
          >
            <IconChevron dir="left" />
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            disabled={atEnd}
            aria-label="Next"
            className="w-11 h-11 rounded-full border border-charcoal/20 grid place-items-center disabled:opacity-30"
          >
            <IconChevron />
          </button>
        </div>
      </div>
      <ProductDialog product={open} gallery={items} onClose={() => setOpen(null)} />
    </section>
  );
}

/* ─────────── Owner's homepage picks — its own editorial layout ─────────── */
export function HomePicks() {
  const { products } = useProducts();
  const items = useMemo(() => products.filter((p) => p.home && p.image).slice(0, 5), [products]);
  const [open, setOpen] = useState<Product | null>(null);
  if (items.length === 0) return null;
  const [lead, ...rest] = items;

  return (
    <section
      data-bg="dark"
      className="relative bg-[#0E1E15] py-24 md:py-32"
      aria-labelledby="home-picks"
    >
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12" id="home-picks">
        <SectionHeader
          dark
          eyebrow="The edit"
          count={items.length}
          titleA="Picked by"
          titleB="our studio."
          copy="Pieces we'd put on your shelf first this season."
        />
        <div className="grid gap-4 md:gap-5 lg:grid-cols-[1.25fr_1fr]">
          <button
            type="button"
            onClick={() => setOpen(lead)}
            className="group relative block text-left overflow-hidden rounded-[26px] aspect-[4/5] lg:aspect-auto lg:min-h-[640px] bg-black"
          >
            <img
              src={lead.image}
              alt={lead.name}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out [@media(hover:hover)]:group-hover:scale-[1.03]"
            />
            <span
              className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(0,0,0,0.8))]"
              aria-hidden="true"
            />
            <span className="absolute left-6 right-6 bottom-6 md:left-8 md:bottom-8">
              <span className="text-[10px] uppercase tracking-[0.28em] text-[var(--gold)]">
                {lead.category} · Min. {lead.moq}
              </span>
              <span className="block font-display text-cloud text-[clamp(1.9rem,4vw,3rem)] leading-tight mt-2">
                {lead.name}
              </span>
              <span className="inline-flex items-center gap-2 mt-4 text-[11px] uppercase tracking-[0.18em] text-cloud/85">
                Get a quote <IconArrow size={14} />
              </span>
            </span>
          </button>
          <ul className="grid grid-cols-2 gap-4 md:gap-5">
            {rest.map((p) => (
              <li key={p.id} className="min-w-0">
                <button
                  type="button"
                  onClick={() => setOpen(p)}
                  className="group block w-full text-left"
                >
                  <span className="relative block aspect-[4/5] overflow-hidden rounded-[20px] bg-black">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out [@media(hover:hover)]:group-hover:scale-[1.04]"
                    />
                  </span>
                  <span className="block mt-3 text-[10px] uppercase tracking-[0.22em] text-[var(--gold)]">
                    {p.category}
                  </span>
                  <span className="block font-display text-cloud text-lg leading-snug line-clamp-2">
                    {p.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <ProductDialog product={open} gallery={items} onClose={() => setOpen(null)} />
    </section>
  );
}
