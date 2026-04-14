import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // GitHub Pages configuration (update when custom domain is ready)
  site: 'https://simontheteemo.github.io',
  base: '/jdfinance',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
