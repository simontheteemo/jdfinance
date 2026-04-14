# JD Finance Website

A static marketing website for JD Finance built with **Astro + Tailwind CSS v4**, hosted on **GitHub Pages**, and deployed via **GitHub Actions**.

## Status: ✅ Implemented

All core files have been created and the site builds successfully.

## Tech Stack

- **Framework:** Astro 5.0 (zero-JS-by-default, excellent SEO)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 (utility-first with CSS variables)
- **Hosting:** GitHub Pages
- **CI/CD:** GitHub Actions
- **SEO:** Sitemap, meta tags, Open Graph, canonical URLs

## Project Structure

```
jdfinance/
├── .github/
│   └── workflows/
│       ├── deploy.yml       # Auto-deploy to GitHub Pages
│       └── ci.yml           # PR checks
├── docs/                    # Complete documentation (7 files)
├── public/
│   └── favicon.svg          # Site favicon
├── src/
│   ├── components/
│   │   ├── Header.astro     # Navigation header
│   │   └── Footer.astro     # Site footer
│   ├── layouts/
│   │   └── BaseLayout.astro # Main layout with SEO
│   ├── pages/
│   │   ├── index.astro      # Home page
│   │   ├── about.astro      # About page
│   │   └── contact.astro    # Contact page
│   └── styles/
│       └── global.css       # Tailwind v4 theme + brand colors
├── astro.config.mjs         # Astro configuration
├── package.json             # Dependencies
└── tsconfig.json            # TypeScript configuration
```

## Quick Start

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Visit [http://localhost:4321](http://localhost:4321)

### Build for production

```bash
npm run build
```

Generates static files in `dist/`

### Preview production build

```bash
npm run preview
```

**Note:** Run `npm run build` first before preview.

## Pages

- `/` — Home page with hero and CTA
- `/about` — About JD Finance (placeholder content)
- `/contact` — Contact information with mailto links

## Customization

### Brand Colors & Fonts

Edit `src/styles/global.css` to update:
- Brand colors (5 shades)
- Accent colors (2 shades)
- Font families (Google Fonts)

### Content

Update placeholder text in:
- `src/pages/about.astro` — company story and approach
- `src/pages/contact.astro` — real email and phone

## Deployment

See [docs/00-getting-started.md](docs/00-getting-started.md) for complete deployment guide covering:
- Local development
- GitHub Pages deployment (default URL)
- Custom domain configuration

### Quick Deploy Checklist

1. **For GitHub Pages default URL:**
   - Update `astro.config.mjs`: add `base: '/jdfinance'`
   - Commit and push to GitHub
   - Enable GitHub Pages in repository settings (Source: GitHub Actions)

2. **For custom domain:**
   - Add `public/CNAME` with your domain
   - Update `astro.config.mjs`: remove `base`, set `site` to custom domain
   - Configure DNS at your registrar
   - Enable custom domain in GitHub Pages settings

## Documentation

Complete documentation in `docs/`:

0. [00-getting-started.md](docs/00-getting-started.md) — complete setup guide (start here!)
1. [01-README.md](docs/01-README.md) — overview and quick reference
2. [02-project-scaffold.md](docs/02-project-scaffold.md) — file-by-file specifications
3. [03-pipeline.md](docs/03-pipeline.md) — GitHub Actions workflows
4. [04-hosting.md](docs/04-hosting.md) — GitHub Pages + custom domain
5. [05-adding-react.md](docs/05-adding-react.md) — React islands integration
6. [06-seo.md](docs/06-seo.md) — SEO optimization guide

## Next Steps

- [ ] Update placeholder content in About page
- [ ] Add real contact information
- [ ] Deploy to GitHub Pages or custom domain
- [ ] (Optional) Add React mortgage calculator (see docs/05-adding-react.md)
- [ ] (Optional) Add analytics (Google Analytics, Plausible)
- [ ] (Optional) Add robots.txt and OG images (see docs/06-seo.md)

## License

All rights reserved © 2026 JD Finance
