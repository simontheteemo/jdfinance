# SEO Setup

Astro gives you most SEO wins for free — server-rendered HTML, fast load times, easy per-page meta tags. This doc covers what's in the scaffold and what to do beyond it.

## Already handled by the scaffold

### Per-page titles and descriptions

`BaseLayout.astro` accepts `title` and `description` props. Every page passes its own:

```astro
<BaseLayout
  title="About — JD Finance"
  description="Learn about JD Finance, our team, and our approach."
>
```

This produces proper `<title>`, `<meta name="description">`, Open Graph, and Twitter card tags per page.

### Canonical URLs

`BaseLayout` computes `canonicalURL` from `Astro.site` (set in `astro.config.mjs`) and the current path, so every page self-references cleanly.

### Sitemap

`@astrojs/sitemap` generates `sitemap-index.xml` and `sitemap-0.xml` at build time. After deploy, they're available at:

```
https://jdfinance.com/sitemap-index.xml
```

Submit this to Google Search Console and Bing Webmaster Tools.

### Fast load times

- Zero JS on static pages → excellent LCP and FID
- Tailwind v4 produces a tiny CSS bundle (only classes you use)
- Static HTML means first byte is essentially instant

## Things to add

### `robots.txt`

Create `public/robots.txt` **after configuring your custom domain**. If you're deploying to the default GitHub Pages URL first, use that URL temporarily.

**For custom domain (final version):**

```
User-agent: *
Allow: /

Sitemap: https://jdfinance.com/sitemap-index.xml
```

**For default GitHub Pages URL (temporary):**

```
User-agent: *
Allow: /

Sitemap: https://<your-username>.github.io/jd-finance-site/sitemap-index.xml
```

Remember to update the sitemap URL when you transition to your custom domain.

### Open Graph image

Social platforms show a preview image when someone shares your URL. Add a `public/og-image.png` (1200×630 recommended) and reference it in `BaseLayout.astro`:

```astro
---
interface Props {
  title: string;
  description?: string;
  ogImage?: string;
}

const {
  title,
  description = '...',
  ogImage = '/og-image.png',
} = Astro.props;

const ogImageURL = new URL(ogImage, Astro.site);
---
<!-- in <head> -->
<meta property="og:image" content={ogImageURL} />
<meta name="twitter:image" content={ogImageURL} />
```

### Structured data (JSON-LD)

For a financial services company, add `Organization` and `LocalBusiness` schema to improve rich results in search. In `BaseLayout.astro`, add to `<head>`:

```astro
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FinancialService",
  "name": "JD Finance",
  "url": Astro.site?.toString(),
  "logo": new URL('/favicon.svg', Astro.site).toString(),
  "description": description,
  // add when you have them:
  // "address": { ... },
  // "telephone": "+1-555-123-4567",
  // "email": "hello@jdfinance.com",
})} />
```

### Favicon and PWA icons

Replace the placeholder `public/favicon.svg` with the real logo, and add:

- `public/apple-touch-icon.png` (180×180)
- `public/favicon-32x32.png`
- `public/favicon-16x16.png`

Reference them in `BaseLayout.astro`:

```astro
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
```

## After launch

1. **Verify the domain** in [Google Search Console](https://search.google.com/search-console) — use the DNS TXT method.
2. **Submit sitemap** in Search Console: `https://jdfinance.com/sitemap-index.xml`.
3. **Check Core Web Vitals** with [PageSpeed Insights](https://pagespeed.web.dev/). Astro usually scores 95+ out of the box.
4. **Validate structured data** with [Schema.org validator](https://validator.schema.org/) or Google's [Rich Results Test](https://search.google.com/test/rich-results).
5. **Test social previews** with [opengraph.xyz](https://www.opengraph.xyz/) before sharing on LinkedIn / Twitter.
6. **Repeat for Bing** at [Bing Webmaster Tools](https://www.bing.com/webmasters/).

## Content SEO (not technical)

Technical SEO gets you indexable. Ranking still depends on content:

- Each page should have a clear, unique `<h1>`
- Use `<h2>`/`<h3>` for structure, not styling
- Write a unique, descriptive `description` per page (~150–160 chars)
- Internal links between pages (Home → About, About → Contact, etc.) — already partly done via nav
- Target keywords naturally (e.g., "financial services [city]", "mortgage advice [city]") if local SEO matters

## Ongoing

- Run [Lighthouse](https://developer.chrome.com/docs/lighthouse/overview/) locally before each release — `npm run build && npm run preview` then open DevTools → Lighthouse
- Check Search Console monthly for crawl errors, indexing status, and performance queries
- Update content regularly — stale sites rank lower over time
