# Pipeline (GitHub Actions)

Auto-deploy the site to GitHub Pages on every push to `main`.

## How it works

GitHub Pages now supports deploying directly from a GitHub Actions workflow using `actions/deploy-pages`. No `gh-pages` branch, no personal access tokens — it uses the built-in `GITHUB_TOKEN` with a dedicated `pages` environment.

**Flow:**

```
push to main
     │
     ▼
┌─────────────────┐
│  build job      │  checkout → setup Node → npm ci → npm run build
│                 │  → upload ./dist as Pages artifact
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  deploy job     │  downloads artifact → publishes to GitHub Pages
│  (needs: build) │
└─────────────────┘
         │
         ▼
  https://<user>.github.io/jd-finance-site/   (or custom domain)
```

## The workflow file

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:  # allows manual runs from the Actions tab

# Only one deploy at a time; cancel any in-progress runs
concurrency:
  group: pages
  cancel-in-progress: true

# Permissions needed for actions/deploy-pages
permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## One-time repo setup

After pushing this workflow for the first time:

1. Go to the repo on GitHub → **Settings** → **Pages**
2. Under **Build and deployment** → **Source**, select **GitHub Actions**
3. Push to `main` (or run the workflow manually from the Actions tab)

That's it — subsequent pushes will auto-deploy.

## PR checks (optional but recommended)

Add `.github/workflows/ci.yml` to catch broken builds before merging:

```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
```

Later you can add `npm run lint`, `npm run test`, or `astro check` (for TypeScript diagnostics) as the project grows.

## Troubleshooting

| Symptom | Cause / Fix |
|---|---|
| `Error: Resource not accessible by integration` | Missing permissions. Ensure `pages: write` and `id-token: write` are set. |
| Pages deploys but site shows 404s on subpages | `site` in `astro.config.mjs` is wrong, or base path mismatch. For a project repo without custom domain, add `base: '/jd-finance-site'`. With custom domain, omit `base`. |
| Assets load but styles broken | Same as above — base path issue. |
| Build fails with "npm ci" error | Commit your `package-lock.json`. |
| Deployment succeeds but site not updating | Hard refresh (Ctrl+Shift+R). GitHub Pages CDN can cache for a few minutes. |

## Secrets / env vars

None needed for this project. If you later add services (e.g., Formspree endpoint, analytics IDs), add them under **Settings → Secrets and variables → Actions** and reference as `${{ secrets.FORMSPREE_ID }}`.
