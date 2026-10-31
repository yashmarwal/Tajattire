import type { Product } from "@/lib/catalog";
import { waLink, productEnquiryText } from "@/lib/contact";
import { IconWhatsApp, IconDownload, IconArrow } from "../icons";

interface Props {
  product: Product;
  onOpen: (p: Product) => void;
  catalogueUrl?: string;
  /** First row of a grid gets eager images; the rest lazy-load. */
  eager?: boolean;
  tone?: "light" | "dark";
}

/**
 * Product card: inset photo with label chips, a row of compact info tiles +
 * quick actions, then the name and ONE primary action. The bottom block is
 * pinned to the card bottom so buttons line up across a grid, and the tile
 * row adapts to the card's own width (container queries in styles.css).
 */
export function ProductCard({ product: p, onOpen, catalogueUrl, eager, tone = "light" }: Props) {
  const dark = tone === "dark";
  return (
    <article
      className={`pcard card-lift h-full flex flex-col rounded-[22px] p-2 sm:p-2.5 border ${
        dark
          ? "bg-[#111513] border-white/10"
          : "bg-white border-charcoal/[0.07] shadow-[0_10px_30px_-22px_rgba(10,10,10,0.45)]"
      }`}
    >
      <button
        type="button"
        onClick={() => onOpen(p)}
        className="relative block w-full aspect-[4/5] overflow-hidden rounded-[16px] bg-[#EDE9DF] focus-visible:outline-2 focus-visible:outline-[var(--gold)]"
        aria-label={`View ${p.name}`}
      >
        {p.image ? (
          <img
            src={p.image}
            alt={p.name}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 [@media(hover:hover)]:hover:scale-[1.04]"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-[11px] uppercase tracking-[0.2em] text-charcoal/40">
            Photo coming soon
          </span>
        )}
        <span className="absolute top-2 left-2 right-2 flex flex-wrap gap-1.5 pointer-events-none">
          <span className="rounded-full bg-white/92 text-charcoal px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.12em]">
            {p.category}
          </span>
          {p.badge && (
            <span
              className={`rounded-full px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.12em] ${
                p.badge === "New"
                  ? "bg-[var(--emerald-deep)] text-cloud"
                  : "bg-[var(--gold)] text-deep-black"
              }`}
            >
              {p.badge}
            </span>
          )}
        </span>
      </button>

      <div className="flex flex-col flex-1 px-1 pt-2.5">
        <div className="pcard-tiles">
          <span className={`pcard-tile ${dark ? "!bg-white/[0.06]" : ""}`}>
            <span className={`pcard-tile-k ${dark ? "!text-cloud/50" : ""}`}>Min. order</span>
            <span className={`pcard-tile-v ${dark ? "!text-cloud" : ""}`}>{p.moq}</span>
          </span>
          <span className={`pcard-tile ${dark ? "!bg-white/[0.06]" : ""}`}>
            <span className={`pcard-tile-k ${dark ? "!text-cloud/50" : ""}`}>Dispatch</span>
            <span className={`pcard-tile-v ${dark ? "!text-cloud" : ""}`}>{p.leadTime}</span>
          </span>
          <span className="pcard-actions">
            <a
              href={waLink(productEnquiryText(p.name, p.moq))}
              target="_blank"
              rel="noopener noreferrer"
              className={`pcard-icon ${dark ? "!border-white/15 !text-cloud" : ""}`}
              aria-label={`Ask about ${p.name} on WhatsApp`}
            >
              <IconWhatsApp size={15} />
            </a>
            {catalogueUrl && (
              <a
                href={catalogueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`pcard-icon pcard-optional ${dark ? "!border-white/15 !text-cloud" : ""}`}
                aria-label={`Download the ${p.category} catalogue`}
              >
                <IconDownload size={15} />
              </a>
            )}
          </span>
        </div>

        <h3
          className={`pcard-title mt-3 font-display leading-snug line-clamp-2 min-h-[2.6em] ${dark ? "text-cloud" : "text-charcoal"}`}
          title={p.name}
        >
          {p.name}
        </h3>

        <div className="mt-auto pt-3">
          <button
            type="button"
            onClick={() => onOpen(p)}
            className={`pcard-cta w-full inline-flex items-center justify-center gap-1.5 rounded-full h-10 whitespace-nowrap text-[10.5px] font-semibold uppercase transition-colors active:scale-[0.98] ${
              dark
                ? "bg-[var(--gold)] text-deep-black [@media(hover:hover)]:hover:bg-cloud"
                : "bg-[var(--emerald-deep)] text-cloud [@media(hover:hover)]:hover:bg-deep-black"
            }`}
          >
            Get a quote <IconArrow size={13} />
          </button>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div
      className="h-full rounded-[22px] p-2.5 bg-white border border-charcoal/[0.07]"
      aria-hidden="true"
    >
      <div className="aspect-[4/5] rounded-[16px] bg-[#EDE9DF] animate-pulse" />
      <div className="h-9 mt-3 rounded-xl bg-[#F3F0E8]" />
      <div className="h-5 mt-3 w-3/4 rounded bg-[#F3F0E8]" />
      <div className="h-10 mt-4 rounded-full bg-[#F3F0E8]" />
    </div>
  );
}
