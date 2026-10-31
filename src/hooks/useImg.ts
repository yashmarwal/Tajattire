import { useSettings } from "@/hooks/useSiteData";

/** Bundled fallbacks — only the owner's own photo and logo. Section photos the
 * owner hasn't uploaded yet render a branded panel instead of stock imagery. */
export const IMG_DEFAULTS = {
  hero: "/images/hero-1024.webp",
  heroMobile: "/images/hero-640.webp",
  logo: "/images/logo-mark-96.webp",
};

/**
 * Site images from the admin (site_settings), falling back to the bundled
 * defaults. `ready` is false only on a first-ever visit while the single
 * settings request is in flight — components show a neutral panel during
 * that moment rather than a default that would then be swapped.
 */
export function useImg() {
  const { data: s, isError } = useSettings();
  const ready = s !== undefined || isError;
  const pick = (v: string | undefined, fallback: string) => (ready ? v || fallback : "");
  const heroDesktop = pick(s?.hero_image, IMG_DEFAULTS.hero);
  return {
    ready,
    hero: heroDesktop,
    heroMobile: ready
      ? s?.hero_image_mobile || (s?.hero_image ? s.hero_image : IMG_DEFAULTS.heroMobile)
      : "",
    heroVideo: s?.hero_video || "",
    heroVideoMobile: s?.hero_video_mobile || "",
    craft: pick(s?.craft_image, IMG_DEFAULTS.hero),
    cta: pick(s?.cta_image, ""),
    form: pick(s?.form_image, ""),
    logo: pick(s?.logo_image, IMG_DEFAULTS.logo),
  };
}
