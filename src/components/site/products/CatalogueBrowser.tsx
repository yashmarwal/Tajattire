import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useProducts, type Product } from "@/lib/catalog";
import { useSettings } from "@/hooks/useSiteData";
import { usePageTransition } from "@/lib/PageTransitionContext";
import { scrollToElement } from "@/lib/lenis-store";
import { waLink } from "@/lib/contact";
import terms from "@/data/terms.json";
import { SplitHeading } from "../Primitives";
import { Pill, PillRow } from "../Pill";
import { ProductCard, ProductCardSkeleton } from "./ProductCard";
import { ProductDialog } from "./ProductDialog";
import { IconDownload, IconWhatsApp } from "../icons";

const BATCH = 12;

/** Full products page: category pills (synced with /catalogue/:category),
 * grid rendered in batches, detail dialog, honest empty state. */
export function CatalogueBrowser() {
  const { products, categories, isLoading, isError } = useProducts();
  const { data: settings } = useSettings();
  const { pathname } = useLocation();
  const navigate = usePageTransition();
  const listTop = useRef<HTMLDivElement>(null);

  const slug = pathname.startsWith("/catalogue/")
    ? decodeURIComponent(pathname.split("/")[2] ?? "")
    : "";
  const active = categories.find((c) => c.slug === slug);
  const activeName = active?.name ?? "All";

  const visible = useMemo(
    () =>
      active
        ? products.filter((p) => p.category.toLowerCase() === active.name.toLowerCase())
        : products,
    [products, active],
  );
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of products)
      m.set(p.category.toLowerCase(), (m.get(p.category.toLowerCase()) ?? 0) + 1);
    return m;
  }, [products]);

  const [limit, setLimit] = useState(BATCH);
  const [open, setOpen] = useState<Product | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);

  // New category → start at the top of the list with a fresh batch
  const first = useRef(true);
  useEffect(() => {
    setLimit(BATCH);
    if (first.current) {
      first.current = false;
      return;
    }
    if (listTop.current && listTop.current.getBoundingClientRect().top < 0)
      scrollToElement(listTop.current, false);
  }, [slug]);

  // Render more as the visitor nears the end
  useEffect(() => {
    const el = sentinel.current;
    if (!el || limit >= visible.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.some((e) => e.isIntersecting) && setLimit((l) => l + BATCH),
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [limit, visible.length]);

  const pdfFor = useCallback(
    (category: string) =>
      settings?.[`catalogue_pdf_${category.toLowerCase()}`] || settings?.catalogue_pdf_all || "",
    [settings],
  );

  const choose = (s: string) => {
    const target = s ? `/catalogue/${s}` : "/catalogue";
    if (target === pathname) return;
    // Same page component — swap the URL in place (no cross-fade needed)
    navigate(target, { soft: true });
  };

  const pdf = pdfFor(activeName === "All" ? "all" : activeName);

  return (
    <section data-bg="light" className="relative bg-cloud pt-32 md:pt-40 pb-24">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
        <header className="max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--emerald-deep)] mb-5">
            Wholesale catalogue
          </p>
          <SplitHeading
            as="h1"
            text={active ? `Wholesale ${active.name}.` : "Every design, ready to ship."}
            className="font-display text-charcoal font-light leading-[1.02] text-[clamp(2.4rem,7vw,5.5rem)]"
          />
          <p className="mt-5 text-charcoal/65 max-w-xl leading-relaxed">
            {active?.blurb ? `${active.blurb} ` : ""}Minimum{" "}
            {active?.moq ?? terms.defaultCategory.moq} per style, dispatched in{" "}
            {active?.leadTime ?? terms.defaultCategory.leadTime}. Prices from {terms.startingPrice}.
            Tap any piece for a quote.
          </p>
        </header>

        <div ref={listTop} className="scroll-mt-24" />
        <nav
          aria-label="Categories"
          className="sticky top-20 z-20 -mx-6 px-6 lg:mx-0 lg:px-0 mt-10 py-3 bg-cloud/95"
        >
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {[{ name: "All", slug: "" }, ...categories].map((c) => {
              const on = c.slug === (active?.slug ?? "");
              const n = c.slug ? (counts.get(c.name.toLowerCase()) ?? 0) : products.length;
              return (
                <a
                  key={c.slug || "all"}
                  href={c.slug ? `/catalogue/${c.slug}` : "/catalogue"}
                  onClick={(e) => {
                    e.preventDefault();
                    choose(c.slug);
                  }}
                  aria-current={on ? "page" : undefined}
                  className={`shrink-0 inline-flex items-center gap-2 rounded-full border px-4 h-10 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                    on
                      ? "bg-charcoal border-charcoal text-cloud"
                      : "border-charcoal/15 text-charcoal/75 [@media(hover:hover)]:hover:border-charcoal/40"
                  }`}
                >
                  {c.name}
                  {!isLoading && (
                    <span
                      className={`tabular-nums text-[10px] ${on ? "text-[var(--gold)]" : "text-charcoal/40"}`}
                    >
                      {n}
                    </span>
                  )}
                </a>
              );
            })}
            {pdf && (
              <a
                href={pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 ml-auto inline-flex items-center gap-2 rounded-full bg-[var(--gold)] text-deep-black px-4 h-10 text-[11px] font-semibold uppercase tracking-[0.14em]"
              >
                <IconDownload size={14} />{" "}
                {activeName === "All" ? "Catalogue PDF" : `${activeName} PDF`}
              </a>
            )}
          </div>
        </nav>

        <div className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : visible.length === 0 ? (
            <div className="rounded-[26px] border border-dashed border-charcoal/20 bg-white/60 px-6 py-14 md:py-20 text-center">
              <p className="font-display text-2xl md:text-3xl text-charcoal">
                {isError
                  ? "The catalogue couldn't load just now."
                  : active
                    ? `New ${active.name.toLowerCase()} are being photographed.`
                    : "The online catalogue is being updated."}
              </p>
              <p className="mt-3 text-charcoal/60 max-w-md mx-auto">
                Ask us on WhatsApp and we'll send the latest{" "}
                {active ? active.name.toLowerCase() : "designs"} with prices straight away.
              </p>
              <div className="mt-8 flex justify-center">
                <Pill
                  href={waLink(
                    `Hi TajAttire! Please share your latest ${active ? active.name.toLowerCase() : "catalogue"} with wholesale prices.`,
                  )}
                  variant="wa"
                  icon={<IconWhatsApp size={16} />}
                >
                  Get the lookbook
                </Pill>
              </div>
            </div>
          ) : (
            <motion.ul
              key={slug || "all"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5"
            >
              {visible.slice(0, limit).map((p, i) => (
                <li key={p.id} className="min-w-0">
                  <ProductCard
                    product={p}
                    onOpen={setOpen}
                    catalogueUrl={pdfFor(p.category)}
                    eager={i < 4}
                  />
                </li>
              ))}
            </motion.ul>
          )}
          <div ref={sentinel} aria-hidden="true" />
          {limit < visible.length && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setLimit((l) => l + BATCH)}
                className="rounded-full border border-charcoal/20 px-6 h-11 text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal"
              >
                Show more ({visible.length - limit} left)
              </button>
            </div>
          )}
        </div>

        <div className="mt-20 rounded-[26px] bg-[var(--emerald-deep)] text-cloud px-6 py-10 md:px-12 md:py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <p className="font-display text-[clamp(1.6rem,3.5vw,2.6rem)] leading-tight">
              Can't find the exact style?
            </p>
            <p className="mt-2 text-cloud/70 max-w-lg">
              We make to your design from {terms.custom.moq} per design, in {terms.custom.leadTime}.
            </p>
          </div>
          <PillRow>
            <Pill to="/custom-orders" variant="primary">
              Custom orders
            </Pill>
            <Pill
              href={waLink("Hi TajAttire! Please send me your full wholesale lookbook.")}
              variant="secondary"
              icon={<IconWhatsApp size={16} />}
            >
              Full lookbook
            </Pill>
          </PillRow>
        </div>
      </div>

      <ProductDialog product={open} gallery={visible} onClose={() => setOpen(null)} />
    </section>
  );
}
