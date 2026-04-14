# JD Finance Website

A static marketing website for JD Finance built with **Astro + Tailwind CSS v4**, hosted on **GitHub Pages**, and deployed via **GitHub Actions**.

## Stack at a glance

| Concern | Choice | Why |
|---|---|---|
| Framework | Astro | Zero-JS-by-default, excellent SEO, supports React islands for future interactivity |
| Language | TypeScript | Type safety across components |
| Styling | Tailwind CSS v4 | Utility-first, theme via CSS variables, easy to modify |
| Hosting | GitHub Pages | Free, simple, integrates with GitHub Actions |
| CI/CD | GitHub Actions | Auto-deploy on push to `main` via `actions/deploy-pages@v4` |
| Custom domain | DNS → GitHub Pages | Configured via `CNAME` file |

## Pages (v1)

- `/` — Home
- `/about` — About
- `/contact` — Contact (mailto link)

## Documentation index

**Start here:**
0. **[00-getting-started.md](./00-getting-started.md)** — complete setup guide from local dev to production

**Reference docs:**
1. **[01-README.md](./01-README.md)** — this file
2. **[02-project-scaffold.md](./02-project-scaffold.md)** — full file-by-file scaffold
3. **[03-pipeline.md](./03-pipeline.md)** — GitHub Actions CI/CD pipeline
4. **[04-hosting.md](./04-hosting.md)** — GitHub Pages + custom domain setup
5. **[05-adding-react.md](./05-adding-react.md)** — how to add React components later (mortgage calculator example)
6. **[06-seo.md](./06-seo.md)** — SEO setup (meta tags, sitemap, robots.txt)

## Quick start

**Note:** Throughout these docs, we use `jd-finance-site` as the project name. Replace this with your preferred repository name (e.g., `jdfinance`, `company-site`, etc.) when following the instructions.

```bash
# Create the project from scaffold (see 02-project-scaffold.md for all files)
npm create astro@latest jd-finance-site -- --template minimal --typescript strict --no-install --no-git
cd jd-finance-site
npm install
npm install -D tailwindcss @tailwindcss/vite
npm install @astrojs/sitemap

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build locally (requires running build first)
npm run preview
```

**Important:** `npm run preview` serves the static files from the `dist/` directory created by `npm run build`. Always run `build` before `preview` to see the latest changes.

## Decisions log

- **Astro over React SPA**: Better SEO (real HTML at request time), better performance (no JS shipped for static pages), and React islands available when needed.
- **Project repo, not user site**: Allows a descriptive repo name (`jd-finance-site`) while still supporting a custom domain.
- **Tailwind v4 with CSS variables**: Brand colors/fonts defined in one place, trivial to rebrand.
- **mailto for contact v1**: No backend needed. Can upgrade to Formspree/Web3Forms later without changing hosting.
