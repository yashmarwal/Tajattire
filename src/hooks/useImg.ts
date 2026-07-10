import { useSettings } from "@/hooks/useSiteData";

const IMG_DEFAULTS = {
  hero:       "/hero.jpg",
  craft:      "https://images.unsplash.com/photo-1610189025214-7b6c6c44f6f0?w=1200&q=80",
  cta:        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80",
  form:       "https://images.unsplash.com/photo-1617059062265-1ca7b50d6e92?w=1200&q=80",
  workspace1: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80",
  workspace2: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80",
  workspace3: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
  logo:       "/logo.png",
};

/** Returns site images from Supabase site_settings, falling back to bundled defaults */
export function useImg() {
  const { data: settings } = useSettings();
  return {
    hero:       settings?.hero_image       || IMG_DEFAULTS.hero,
    craft:      settings?.craft_image      || IMG_DEFAULTS.craft,
    cta:        settings?.cta_image        || IMG_DEFAULTS.cta,
    form:       settings?.form_image       || IMG_DEFAULTS.form,
    workspace1: settings?.workspace_img_1  || IMG_DEFAULTS.workspace1,
    workspace2: settings?.workspace_img_2  || IMG_DEFAULTS.workspace2,
    workspace3: settings?.workspace_img_3  || IMG_DEFAULTS.workspace3,
    logo:       settings?.logo_image       || IMG_DEFAULTS.logo,
  };
}
