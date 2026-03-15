// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import compress from "@playform/compress";

// https://astro.build/config
export default defineConfig({
  site: "https://zmni.github.io",
  trailingSlash: "always",

  integrations: [
    icon(),
    sitemap({
      filter: (page) => page !== "https://zmni.github.io/admin/",
    }),
    compress({
      HTML: true,
      CSS: true,
      JavaScript: false,
      Image: false,
      SVG: false,
    }),
  ],

  vite: {
    plugins: [tailwindcss()],

    optimizeDeps: {
      include: ["astro-leaflet > leaflet"],
    },
  },
});
