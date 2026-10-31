import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePageTransition } from "@/lib/PageTransitionContext";
import { IconArrow } from "./icons";

export interface StackItem {
  slug: string;
  name: string;
  meta: string; // e.g. "Min. 100 pcs · 7–15 days"
  count: string; // e.g. "5 online"
  cover?: string;
}

const NAV = 88; // just under the fixed header
const PILL = 64; // collapsed height — fully rounded ends (radius = PILL / 2)
const GAP = 10;

/**
 * Phone collection stack. Each card pins under the header; as the next card
 * rises, the pinned card squeezes into a pill (its visible shape shrinks from
 * the bottom, exactly tracking the incoming card) and its photo shrinks into
 * a circle in the pill's corner. Collapsed pills stay stacked above the card
 * being viewed and remain tappable.
 *
 * Progress per card is written to a CSS variable (--p, 0 → 1) on scroll, so
 * nothing re-renders while scrolling.
 */
export function CollectionStack({ items }: { items: StackItem[] }) {
  const navigate = usePageTransition();
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const [H, setH] = useState(420);
  const n = items.length;

  // Card height: as tall as the screen allows once the collapsed pills of
  // the cards above it are accounted for.
  useLayoutEffect(() => {
    const size = () => {
      const free = window.innerHeight - NAV - (n - 1) * (PILL + GAP) - 24;
      const byWidth = Math.round(Math.min(window.innerWidth, 560) * 1.25);
      setH(Math.max(PILL * 4, Math.min(free, byWidth, 480)));
    };
    size();
    window.addEventListener("resize", size);
    return () => window.removeEventListener("resize", size);
  }, [n]);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      for (let i = 0; i < n; i++) {
        const el = refs.current[i];
        if (!el) continue;
        const next = refs.current[i + 1];
        let p = 0;
        if (next) {
          const pinnedTop = NAV + i * (PILL + GAP);
          const d = next.getBoundingClientRect().top - pinnedTop; // H+GAP → PILL+GAP
          p = Math.min(1, Math.max(0, (H + GAP - d) / (H - PILL)));
        }
        el.style.setProperty("--p", p.toFixed(4));
        el.dataset.collapsed = p > 0.6 ? "true" : "false";
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [n, H]);

  const shrink = H - PILL;

  return (
    <ol className="cstack" aria-label="Collections">
      {items.map((it, i) => (
        <li
          key={it.slug}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="sticky"
          style={{
            top: NAV + i * (PILL + GAP),
            height: H,
            marginBottom: i < n - 1 ? GAP : 0,
            // Earlier cards sit above later ones: while collapsing, the next
            // card never overlaps the visible pill, and at the end of the
            // stack the last card tucks *under* the pills instead of covering them.
            zIndex: n - i,
          }}
        >
          <a
            href={`/catalogue/${it.slug}`}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey) return;
              e.preventDefault();
              navigate(`/catalogue/${it.slug}`);
            }}
            aria-label={`${it.name} — ${it.meta}`}
            className="cstack-card"
            style={{
              // visible shape shrinks from the bottom into a pill with round ends
              clipPath: `inset(0 0 calc(var(--p, 0) * ${shrink}px) 0 round ${PILL / 2}px)`,
            }}
          >
            {/* full photo fades as the card collapses */}
            {it.cover ? (
              <img src={it.cover} alt="" loading="lazy" decoding="async" className="cstack-photo" />
            ) : (
              <span className="cstack-photo grid place-items-center" aria-hidden="true">
                <img
                  src="/images/logo-mark-160.webp"
                  alt=""
                  width={141}
                  height={160}
                  className="w-24 opacity-[0.14]"
                />
              </span>
            )}
            <span className="cstack-scrim" aria-hidden="true" />

            {/* expanded content */}
            <span className="cstack-full">
              <span className="block text-[10px] uppercase tracking-[0.28em] text-[var(--gold)] tabular-nums">
                {String(i + 1).padStart(2, "0")} · {it.count}
              </span>
              <span className="block font-display text-cloud text-[2.5rem] leading-none mt-2">
                {it.name}
              </span>
              <span className="block text-cloud/65 text-[12px] mt-2">{it.meta}</span>
              <span className="cstack-go" aria-hidden="true">
                <IconArrow size={16} />
              </span>
            </span>

            {/* collapsed pill content: circular photo in the corner + name */}
            <span className="cstack-pill" aria-hidden="true">
              <span className="cstack-avatar">
                {it.cover ? (
                  <img src={it.cover} alt="" loading="lazy" decoding="async" />
                ) : (
                  <span className="cstack-avatar-blank" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-cloud text-[1.3rem] leading-none truncate">
                  {it.name}
                </span>
                <span className="block text-cloud/55 text-[10.5px] mt-1 truncate">{it.meta}</span>
              </span>
              <span className="cstack-pill-go">
                <IconArrow size={14} />
              </span>
            </span>
          </a>
        </li>
      ))}
      {/* lets the last card hold its pin for a moment before the stack leaves */}
      {n > 1 && <li aria-hidden="true" style={{ height: 120 }} />}
    </ol>
  );
}
