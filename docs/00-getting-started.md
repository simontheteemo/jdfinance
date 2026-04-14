# Getting Started

This guide walks you through the complete setup process from creating your local project to deploying it live on GitHub Pages.

## Prerequisites

- **Node.js 22+** installed ([download here](https://nodejs.org/))
- **Git** installed ([download here](https://git-scm.com/))
- **GitHub account** ([sign up here](https://github.com/))
- **Code editor** (VS Code, Cursor, or your preferred editor)

Verify installations:

```bash
node --version    # should show v22.x or higher
git --version     # should show git version 2.x or higher
```

## Three-Stage Deployment Timeline

This project goes through three distinct stages:

```
Stage 1: Local Development
    ↓
Stage 2: GitHub Pages (Default URL)
    ↓
Stage 3: Custom Domain (Production)
```

Each stage requires different configuration. Follow this guide sequentially to avoid broken deployments.

---

## Stage 1: Local Development

### Step 1 — Create the project structure

Follow **[02-project-scaffold.md](./02-project-scaffold.md)** to create all files with the exact content specified. The key files are:

- `package.json` with dependencies
- `astro.config.mjs` for Astro configuration
- `tsconfig.json` for TypeScript settings
- `.gitignore` to exclude `node_modules` and `dist`
- All source files in `src/` directory

**Shortcut:** If you're starting from scratch, you can create the basic structure with:

```bash
npm create astro@latest jd-finance-site -- --template minimal --typescript strict
cd jd-finance-site
```

Then follow the scaffold doc to add the remaining files and configurations.

### Step 2 — Install dependencies

```bash
npm install
```

This creates a `package-lock.json` file that locks your dependency versions. **Commit this file** — it's essential for reproducible builds in CI/CD.

### Step 3 — Start the dev server

```bash
npm run dev
```

Visit [http://localhost:4321](http://localhost:4321) to see your site. The dev server supports hot-reloading — changes to `.astro`, `.tsx`, and `.css` files update instantly.

### Step 4 — Test the production build locally

```bash
npm run build
npm run preview
```

This builds the static site into `dist/` and serves it locally. Always test the production build before deploying — dev mode and production can behave differently.

**Verify:**
- Home page loads at `http://localhost:4321/`
- About page loads at `http://localhost:4321/about`
- Contact page loads at `http://localhost:4321/contact`
- Styles are applied correctly
- No console errors in browser DevTools

---

## Stage 2: Deploy to GitHub Pages (Default URL)

### Step 1 — Initialize Git repository

```bash
git init
git add .
git commit -m "Initial commit: JD Finance site scaffold

- Add Astro + Tailwind CSS v4 setup
- Add three pages: Home, About, Contact
- Add GitHub Actions workflow for deployment
- Configure sitemap and SEO basics"
```

### Step 2 — Create GitHub repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `jd-finance-site` (or your preferred name)
3. Description: "JD Finance marketing website"
4. Visibility: **Public** (required for free GitHub Pages)
5. **Do not** initialize with README, .gitignore, or license (you already have these)
6. Click **Create repository**

### Step 3 — Connect local repo to GitHub

```bash
# Replace <your-username> with your GitHub username
git remote add origin https://github.com/<your-username>/jd-finance-site.git
git branch -M main
git push -u origin main
```

### Step 4 — Configure `base` path for GitHub Pages

**⚠️ CRITICAL:** Before the workflow runs, update `astro.config.mjs` to include a `base` path:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://<your-username>.github.io',  // Update with your username
  base: '/jd-finance-site',                    // ADD THIS LINE
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

Commit and push this change:

```bash
git add astro.config.mjs
git commit -m "Configure base path for GitHub Pages"
git push
```

### Step 5 — Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top navigation)
3. Click **Pages** (left sidebar)
4. Under **Build and deployment** → **Source**, select **GitHub Actions**
5. Save (if prompted)

### Step 6 — Trigger deployment

The workflow in `.github/workflows/deploy.yml` automatically runs on push to `main`. Check the deployment:

1. Go to **Actions** tab in your repository
2. You should see a workflow run called "Deploy to GitHub Pages"
3. Wait for both jobs (build and deploy) to complete (usually 2-3 minutes)
4. Click the workflow run to see logs if there are any errors

### Step 7 — Verify deployment

Your site is now live at:

```
https://<your-username>.github.io/jd-finance-site/
```

**Test all pages:**
- Home: `https://<your-username>.github.io/jd-finance-site/`
- About: `https://<your-username>.github.io/jd-finance-site/about`
- Contact: `https://<your-username>.github.io/jd-finance-site/contact`

**Common issues:**
- 404 errors on subpages → `base` path is missing or incorrect in `astro.config.mjs`
- Broken CSS/images → Same `base` path issue
- Build fails → Check Actions logs for errors

---

## Stage 3: Custom Domain (Production)

Follow **[04-hosting.md](./04-hosting.md)** for detailed DNS configuration and custom domain setup.

### Quick overview:

### Step 1 — Add CNAME file

Create `public/CNAME` with your domain (no `https://`, no trailing slash):

```
jdfinance.com
```

### Step 2 — Update Astro config

Remove the `base` path and update `site`:

```js
// astro.config.mjs
export default defineConfig({
  site: 'https://jdfinance.com',  // Update to your domain
  // REMOVE the base property
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

### Step 3 — Configure DNS

Add A records and CNAME at your domain registrar (see **04-hosting.md** for exact IP addresses).

### Step 4 — Enable custom domain in GitHub

1. Repository → **Settings** → **Pages**
2. Under **Custom domain**, enter `jdfinance.com`
3. Wait for DNS check (can take minutes to hours)
4. Once verified, check **Enforce HTTPS**

### Step 5 — Commit and deploy

```bash
git add public/CNAME astro.config.mjs
git commit -m "Configure custom domain"
git push
```

Your site is now live at `https://jdfinance.com`!

---

## Summary: What Changes Between Stages

| Configuration | Stage 1 (Local) | Stage 2 (GitHub Pages) | Stage 3 (Custom Domain) |
|---------------|----------------|------------------------|-------------------------|
| `astro.config.mjs` → `site` | `http://localhost:4321` (optional) | `https://<user>.github.io` | `https://jdfinance.com` |
| `astro.config.mjs` → `base` | Not set | `/jd-finance-site` | Not set (remove it) |
| `public/CNAME` | Doesn't exist | Doesn't exist | `jdfinance.com` |
| `public/robots.txt` | Optional | Optional | Add with custom domain URL |
| Access URL | `http://localhost:4321` | `https://<user>.github.io/jd-finance-site/` | `https://jdfinance.com` |

---

## Ongoing Development Workflow

After initial setup, your workflow looks like this:

```bash
# 1. Make changes to source files
# 2. Test locally
npm run dev

# 3. Build and preview
npm run build
npm run preview

# 4. Commit and push
git add .
git commit -m "Describe your changes"
git push

# 5. GitHub Actions automatically deploys
# Wait 2-3 minutes, then check your live site
```

---

## Troubleshooting

### "Build failed" in GitHub Actions

1. Check the Actions tab for error logs
2. Common issues:
   - Missing `package-lock.json` → Run `npm install` locally and commit it
   - Syntax errors in `.astro` files → Test with `npm run build` locally first
   - Missing dependencies → Ensure all imports are in `package.json`

### "Page shows 404 after deployment"

1. Verify `base` path is set correctly in `astro.config.mjs` for Stage 2
2. Ensure you're accessing the correct URL (with repo name in path)
3. Check GitHub Pages is enabled in repository settings

### "Styles not loading"

1. Check browser DevTools Network tab for 404s on CSS files
2. Usually caused by incorrect `base` path
3. Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)

### "Deployment succeeds but changes not visible"

1. Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)
2. GitHub Pages CDN can cache for a few minutes
3. Check the deployment timestamp in Actions to confirm latest version deployed

---

## Next Steps

- **Add React calculator:** Follow **[05-adding-react.md](./05-adding-react.md)**
- **Optimize SEO:** Follow **[06-seo.md](./06-seo.md)**
- **Customize branding:** Edit color variables in `src/styles/global.css`
- **Add more pages:** Create new `.astro` files in `src/pages/`
- **Set up analytics:** Add Google Analytics or Plausible to `BaseLayout.astro`

---

## Resources

- [Astro Documentation](https://docs.astro.build/)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
