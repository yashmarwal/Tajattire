import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

/** Preloads the two fonts used above the fold (hero serif + body sans) so the
 * first paint uses them instead of swapping in late. File names are hashed,
 * so they're looked up from the finished bundle. */
function preloadCriticalFonts(patterns: RegExp[]): Plugin {
  return {
    name: "preload-critical-fonts",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(_html, ctx) {
        if (!ctx.bundle) return [];
        const files = Object.keys(ctx.bundle).filter((f) => f.endsWith(".woff2"));
        return patterns
          .map((re) => files.find((f) => re.test(f)))
          .filter((f): f is string => Boolean(f))
          .map((f) => ({
            tag: "link",
            attrs: {
              rel: "preload",
              href: `/${f}`,
              as: "font",
              type: "font/woff2",
              crossorigin: "",
            },
            injectTo: "head" as const,
          }));
      },
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    preloadCriticalFonts([
      /cormorant-garamond-latin-300-normal.*\.woff2$/,
      /cormorant-garamond-latin-300-italic.*\.woff2$/,
      /inter-latin-400-normal.*\.woff2$/,
    ]),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/@supabase/")) return "supabase";
          if (id.includes("node_modules/framer-motion") || id.includes("node_modules/motion-"))
            return "motion";
          if (
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react/") ||
            id.includes("node_modules/scheduler") ||
            id.includes("node_modules/react-router")
          )
            return "react";
        },
      },
    },
  },
});
