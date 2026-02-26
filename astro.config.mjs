// @ts-check
import { defineConfig } from "astro/config"

import tailwindcss from "@tailwindcss/vite"
import icon from "astro-icon"
import sitemap from "@astrojs/sitemap"

// https://astro.build/config
export default defineConfig({
  site: "https://zmni.github.io",
  trailingSlash: "always",

  integrations: [
    icon(),

    sitemap({
      filter: page => page !== "https://zmni.github.io/admin/",
    }),
  ],

  vite: {
    plugins: [tailwindcss()],

    optimizeDeps: {
      include: ["astro-leaflet > leaflet"],
    },

    build: {
      rollupOptions: {
        output: {
          entryFileNames: "assets/[hash].js",
          chunkFileNames: "assets/[hash].js",
          assetFileNames: "assets/[hash][extname]",
        },
      },
    },
  },
})
