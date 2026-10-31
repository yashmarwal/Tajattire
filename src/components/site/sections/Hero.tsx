import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useImg } from "@/hooks/useImg";
import { useSettings } from "@/hooks/useSiteData";
import { useIntroDone } from "@/lib/intro";
import { healDeadImage } from "@/lib/siteSettings";
import { waLink, FOUNDED_YEAR } from "@/lib/contact";
import { Pill, PillRow } from "../Pill";
import { IconWhatsApp } from "../icons";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const IMG = useImg();
  const { data: s } = useSettings();
  const introDone = useIntroDone();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-20%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const line1 = s?.hero_headline_1?.trim() || "Where Craft";
  const line2 = s?.hero_headline_2?.trim() || "Meets Commerce.";
  const sub =
    s?.hero_sub?.trim() ||
    "Wholesale kurtis, gowns and contemporary tops, made in Jaipur since 2004. 100 pieces per style, prices from ₹180, delivered across India.";
  const tagline =
    s?.hero_tagline?.trim() || s?.brand_tagline?.trim() || `Jaipur · Since ${FOUNDED_YEAR}`;

  const show = introDone || reduce;

  // The "motion" slots accept MP4/WEBM video or an animated GIF/WebP image
  const isVideo = (u: string) => /\.(mp4|webm|mov|m4v)(\?|$)/i.test(u);
  const desktopMotion = IMG.heroVideo;
  const mobileMotion = IMG.heroVideoMobile || IMG.heroVideo;
  const mediaCls = "absolute inset-0 w-full h-[118%] object-cover opacity-55";
  const heroMotion =
    desktopMotion && isVideo(desktopMotion) && isVideo(mobileMotion) ? (
      <video
        className={mediaCls}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={IMG.hero || undefined}
      >
        {mobileMotion !== desktopMotion && <source src={mobileMotion} media="(max-width: 767px)" />}
        <source src={desktopMotion} />
      </video>
    ) : desktopMotion || IMG.heroVideoMobile ? (
      <picture>
        {(IMG.heroVideoMobile || IMG.heroMobile) && (
          <source
            media="(max-width: 767px)"
            srcSet={
              IMG.heroVideoMobile && !isVideo(IMG.heroVideoMobile)
                ? IMG.heroVideoMobile
                : IMG.heroMobile
            }
          />
        )}
        <img
          src={desktopMotion && !isVideo(desktopMotion) ? desktopMotion : IMG.hero}
          alt=""
          fetchPriority="high"
          decoding="async"
          onError={healDeadImage}
          className={mediaCls}
        />
      </picture>
    ) : (
      IMG.hero && (
        <picture>
          <source media="(max-width: 767px)" srcSet={IMG.heroMobile} />
          <img
            src={IMG.hero}
            alt=""
            fetchPriority="high"
            decoding="async"
            onError={healDeadImage}
            className={mediaCls}
          />
        </picture>
      )
    );
  const rise = (delay: number) => ({
    initial: reduce ? false : { y: "110%" },
    animate: show ? { y: 0 } : undefined,
    transition: { duration: 1, delay, ease: EASE },
  });
  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: show ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.8, delay, ease: EASE },
  });

  return (
    <section
      ref={ref}
      id="top"
      data-bg="dark"
      className="relative min-h-[100svh] w-full overflow-hidden bg-deep-black"
    >
      <motion.div
        style={{ y: imgY }}
        className="absolute inset-0 will-change-transform"
        aria-hidden="true"
      >
        {heroMotion}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.75)_0%,rgba(10,10,10,0.45)_45%,#0A0A0A_100%)]" />
      </motion.div>

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 max-w-[1500px] mx-auto px-6 lg:px-12 pt-36 md:pt-44 pb-28 min-h-[100svh] flex flex-col justify-center"
      >
        <motion.p
          {...fade(0.05)}
          className="text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-[var(--gold)] mb-6 md:mb-8"
        >
          {tagline}
        </motion.p>
        <h1 className="font-display text-cloud leading-[0.95] tracking-[-0.02em] text-[clamp(2.9rem,11vw,9rem)]">
          <span className="reveal-mask block">
            <motion.span className="block font-light" {...rise(0.1)}>
              {line1}
            </motion.span>
          </span>{" "}
          <span className="reveal-mask block">
            <motion.span className="block font-light italic text-[var(--gold)]" {...rise(0.22)}>
              {line2}
            </motion.span>
          </span>
        </h1>

        <motion.p
          {...fade(0.45)}
          className="mt-8 md:mt-10 max-w-xl text-cloud/75 text-[15px] md:text-base leading-relaxed"
        >
          {sub}
        </motion.p>

        <motion.div {...fade(0.6)} className="mt-10">
          <PillRow>
            <Pill to="/catalogue" variant="primary">
              Browse catalogue
            </Pill>
            <Pill
              href={waLink(
                "Hi TajAttire! I'd like wholesale pricing and your minimum order details.",
              )}
              variant="secondary"
              icon={<IconWhatsApp size={16} />}
            >
              WhatsApp to order
            </Pill>
          </PillRow>
        </motion.div>
      </motion.div>

      <motion.div
        {...fade(0.9)}
        aria-hidden="true"
        className="hidden md:flex absolute right-8 bottom-12 flex-col items-center gap-3 z-10"
      >
        <span className="text-[10px] tracking-[0.3em] text-[var(--gold)]/60">SCROLL</span>
        <span className="relative block w-px h-14 overflow-hidden bg-[var(--gold)]/20">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-[var(--gold)] animate-[scroll-cue_2.2s_ease-in-out_infinite]" />
        </span>
      </motion.div>
    </section>
  );
}
