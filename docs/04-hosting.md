# Hosting (GitHub Pages + Custom Domain)

## GitHub Pages basics

GitHub Pages serves static files from either:
- The root of a branch (old way), or
- A Pages artifact produced by GitHub Actions (what we use)

For our setup, **no branch is published** — the Actions workflow uploads the built `dist/` folder directly as a Pages artifact.

## Default URL

Before configuring a custom domain, the site lives at:

```
https://<your-username>.github.io/jd-finance-site/
```

**⚠️ IMPORTANT: Before your first deployment**, you must update `astro.config.mjs` to include a `base` path.

Because the URL includes `/jd-finance-site/` (the repo name), Astro needs a `base` set while the site is at the default URL:

```js
// astro.config.mjs — BEFORE custom domain is ready
export default defineConfig({
  site: 'https://<your-username>.github.io',
  base: '/jd-finance-site',  // ADD THIS LINE before first deploy
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

**Without this `base` configuration, your first deployment will have broken links and 404 errors on all pages except the homepage.**

Once you switch to a custom domain (next section), update `site` and **remove `base`**.

## Custom domain setup

When you're ready to point `jdfinance.com` at the site:

### Step 1 — add a `CNAME` file to the repo

Create `public/CNAME` containing just the domain, no `https://`, no trailing slash:

```
jdfinance.com
```

When Astro builds, this file is copied to `dist/CNAME` and GitHub Pages reads it to know which domain to serve.

### Step 2 — configure DNS at your registrar

You have two common choices:

**Option A — apex domain (`jdfinance.com`)**

Add four `A` records pointing to GitHub's Pages IPs:

| Type | Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

Also add AAAA records for IPv6 (recommended):

| Type | Name | Value |
|---|---|---|
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |

Plus a CNAME for the `www` variant:

| Type | Name | Value |
|---|---|---|
| CNAME | www | `<your-username>.github.io` |

**Option B — `www` as primary (`www.jdfinance.com`)**

| Type | Name | Value |
|---|---|---|
| CNAME | www | `<your-username>.github.io` |

Plus apex A/AAAA records as above so `jdfinance.com` redirects to `www`.

> Always verify current GitHub Pages IPs at https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site — they change rarely but verify before configuring.

### Step 3 — configure in GitHub

1. Repo → **Settings** → **Pages**
2. Under **Custom domain**, enter `jdfinance.com` and save
3. Wait for DNS check (can take minutes to hours)
4. Once verified, check **Enforce HTTPS** — GitHub provisions a free Let's Encrypt certificate

### Step 4 — update Astro config

```js
// astro.config.mjs — AFTER custom domain is active
export default defineConfig({
  site: 'https://jdfinance.com',
  // NO base property — custom domains serve from root
  // ...
});
```

Commit, push, and the next deploy will use the correct URLs in the sitemap and canonical tags.

## Verification checklist

- [ ] `https://jdfinance.com` loads the Home page
- [ ] `https://jdfinance.com/about` loads the About page
- [ ] `https://www.jdfinance.com` redirects to apex (or vice versa, depending on preference)
- [ ] SSL padlock is green
- [ ] `https://jdfinance.com/sitemap-index.xml` resolves
- [ ] Canonical URLs in page source show `https://jdfinance.com/...`

## Costs

- GitHub Pages: **free** for public repos (and private repos on Pro/Team/Enterprise)
- Bandwidth: soft limit of 100GB/month, plenty for a content site
- Custom domain: cost of the domain registration only
- SSL: free via GitHub's Let's Encrypt integration

## Limitations to be aware of

- **Static only** — no server-side code. If you later need forms, auth, or APIs, either use a third-party service (Formspree, Web3Forms) or migrate hosting (AWS S3 + CloudFront, Cloudflare Pages, Vercel, Netlify).
- **No environment variables at runtime** — all env vars must be build-time (inlined during `npm run build`).
- **Soft bandwidth/build limits** — fine for a company site, not for high-traffic apps.

## Future: migrating off GitHub Pages

If you outgrow Pages (e.g., need forms backend, server-rendered pages, or AWS integration to match your usual stack), Astro deploys cleanly to:

- **AWS S3 + CloudFront** — matches your usual AWS workflow; can keep the same GitHub Actions and swap the deploy step for `aws s3 sync` + `cloudfront create-invalidation`
- **Cloudflare Pages** — similar to GitHub Pages but with serverless functions
- **Vercel / Netlify** — zero-config, with form handling and serverless functions built in

No code changes needed — only the deploy workflow.
