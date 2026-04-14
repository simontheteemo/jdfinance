import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // Update this to your real domain when you have it
  site: 'https://jdfinance.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
