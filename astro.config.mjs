// @ts-check
import { defineConfig } from 'astro/config';

import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [icon(), sitemap()],

  site: "https://bsm-dev.github.io",
  trailingSlash: "always"
});