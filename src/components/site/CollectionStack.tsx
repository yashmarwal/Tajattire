import { useLayoutEffect, useRef, useState } from "react";
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
 * Phone collection stack, fully scroll-driven.
 *
 * One frame pins under the header and holds every card. As you scroll:
 *  • each card rises into its slot; the card above it squeezes into a pill
 *    whose bottom edge always meets the rising card (never overlapping it);
 *  • the LAST card squeezes into a pill too, pushed by the content that
 *    follows the stack;
 *  • once every card is a pill, the frame releases and the whole column of
 *    pills scrolls away together — pills never stack over each other.
 *
 * The squeeze is a clip-path inset driven by --p (0 → 1); photo, avatar and
 * text move with transform/opacity. Nothing re-renders while scrolling.
 */
export function CollectionStack({ items }: { items: StackItem[] }) {
  const navigate = usePageTransition();
  const outer = useRef<HTMLDivElement>(null);
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const [H, setH] = useState(420);
  const n = items.length;

  const slot = (k: number) => k * (PILL + GAP); // pinned position of card k inside the frame
  const frameH = slot(n - 1) + H; // pills of every earlier card + the open card
  const travel = n * (H - PILL); // scroll needed until every card is a pill

  // Card height: as tall as the screen allows below the earlier cards' pills.
  useLayoutEffect(() => {
    const size = () => {
      const free = window.innerHeight - NAV - (n - 1) * (PILL + GAP) - 20;
      const byWidth = Math.round(Math.min(window.innerWidth, 560) * 1.25);
      setH(Math.max(PILL * 4, Math.min(free, byWidth, 480)));
    };
    size();
    window.addEventListener("resize", size);
    return () => window.removeEventListener("resize", size);
  }, [n]);

  useLayoutEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const box = outer.current;
      if (!box) return;
      // s = how far the frame has been scrolled while pinned
      const s = Math.min(travel, Math.max(0, NAV - box.getBoundingClientRect().top));
      const ys: number[] = [];
      for (let k = 0; k < n; k++) ys[k] = Math.max(k * (PILL + GAP), k * (H + GAP) - s);
      for (let k = 0; k < n; k++) {
        const el = refs.current[k];
        if (!el) continue;
        let p: number;
        if (k < n - 1) {
          // squeezed by the card rising below it
          const d = ys[k + 1] - k * (PILL + GAP);
          p = (H + GAP - d) / (H - PILL);
        } else {
          // the last card is squeezed by the content that follows the stack
          p = (s - (n - 1) * (H - PILL)) / (H - PILL);
        }
        p = Math.min(1, Math.max(0, p));
        el.style.transform = `translate3d(0, ${ys[k]}px, 0)`;
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
  }, [n, H, travel]);

  const shrink = H - PILL;

  return (
    // The negative bottom margin lets the content after the stack rise right
    // under the last card while it squeezes, then sit just below the pills.
    <div ref={outer} style={{ height: frameH + travel, marginBottom: -(H - PILL) }}>
      <ol className="cstack sticky" style={{ top: NAV, height: frameH }} aria-label="Collections">
        {items.map((it, i) => (
          <li
            key={it.slug}
            ref={(el) => {
              refs.current[i] = el;
            }}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: H,
              transform: `translate3d(0, ${i * (H + GAP)}px, 0)`,
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
                <img
                  src={it.cover}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="cstack-photo"
                />
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
      </ol>
    </div>
  );
}
