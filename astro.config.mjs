import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://www.jdfinance.co.nz',
  base: '',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
