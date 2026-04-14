# Project Scaffold

Every file needed to create the JD Finance site from scratch. Create these in a new repo named `jd-finance-site`.

## Folder structure

```
jd-finance-site/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   ├── CNAME                      # add later when custom domain is ready
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── components/
│   │   ├── Header.astro
│   │   └── Footer.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   └── contact.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── tsconfig.json
├── package.json
└── .gitignore
```

## File contents

### `package.json`

```json
{
  "name": "jd-finance-site",
  "type": "module",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "@astrojs/sitemap": "^3.7.0",
    "astro": "^5.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

Run `npm install` after creating this.

**Note:** After running `npm install`, commit the generated `package-lock.json` file to your repository. This ensures consistent dependency versions across all environments and prevents CI/CD failures.

### Troubleshooting: Vite Version Conflicts

If you encounter errors like "Type error: Cannot find module 'vite'" or see multiple Vite versions installed, this is due to a version mismatch between Astro 5 (which uses Vite 6.x) and older versions of `@tailwindcss/vite`.

**Solution:**
```bash
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall with latest compatible versions
npm install

# If issues persist, ensure Vite 6.x is used
npm install vite@latest --save-dev
```

Alternatively, you can add an `overrides` section to `package.json` to force Vite 6.x:
```json
"overrides": {
  "vite": "^6.0.0"
}
```

### `astro.config.mjs`

```js
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
```

### `tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

### `.gitignore`

```
node_modules/
dist/
.astro/
.env
.env.production
.DS_Store
npm-debug.log*
```

### `src/styles/global.css`

This is the **one file to edit for rebranding** — all colors and fonts are defined here.

```css
@import "tailwindcss";

@theme {
  /* Brand colors — swap these to rebrand */
  --color-brand-50:  #f0f4f8;
  --color-brand-100: #d9e2ec;
  --color-brand-500: #486581;
  --color-brand-700: #243b53;
  --color-brand-900: #102a43;

  --color-accent-500: #d4a017;
  --color-accent-600: #b8860b;

  /* Fonts — swap these to re-font */
  --font-sans: 'Fraunces', Georgia, serif;
  --font-display: 'Fraunces', Georgia, serif;
  --font-body: 'Source Sans 3', system-ui, sans-serif;
}

/* Load Google Fonts — swap or remove as needed */
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Source+Sans+3:wght@400;600&display=swap');

html {
  font-family: var(--font-body);
  color: var(--color-brand-900);
}

h1, h2, h3, h4 {
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: -0.02em;
}
```

### `src/layouts/BaseLayout.astro`

```astro
---
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const {
  title,
  description = 'JD Finance — financial services you can trust.',
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="canonical" href={canonicalURL} />

    <title>{title}</title>
    <meta name="description" content={description} />

    {/* Open Graph */}
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />

    {/* Twitter */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
  </head>
  <body class="min-h-screen flex flex-col bg-white">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

### `src/components/Header.astro`

```astro
---
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];
---
<header class="border-b border-brand-100">
  <div class="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
    <a href="/" class="text-xl font-display font-semibold text-brand-900">
      JD Finance
    </a>
    <nav>
      <ul class="flex gap-8">
        {navItems.map(({ href, label }) => (
          <li>
            <a
              href={href}
              class="text-brand-700 hover:text-accent-600 transition-colors"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </div>
</header>
```

### `src/components/Footer.astro`

```astro
---
const year = new Date().getFullYear();
---
<footer class="border-t border-brand-100 mt-16">
  <div class="mx-auto max-w-6xl px-6 py-8 text-sm text-brand-700 flex justify-between">
    <p>&copy; {year} JD Finance. All rights reserved.</p>
    <p><a href="/contact" class="hover:text-accent-600">Contact</a></p>
  </div>
</footer>
```

### `src/pages/index.astro`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  title="JD Finance — Financial services you can trust"
  description="JD Finance provides tailored financial services for individuals and businesses."
>
  <section class="mx-auto max-w-6xl px-6 py-24">
    <h1 class="text-5xl md:text-6xl max-w-3xl">
      Financial clarity, personally delivered.
    </h1>
    <p class="mt-6 max-w-2xl text-lg text-brand-700">
      JD Finance helps you make confident financial decisions with expert advice
      tailored to your goals.
    </p>
    <a
      href="/contact"
      class="mt-10 inline-block bg-brand-900 text-white px-8 py-3 hover:bg-accent-600 transition-colors"
    >
      Get in touch
    </a>
  </section>
</BaseLayout>
```

### `src/pages/about.astro`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  title="About — JD Finance"
  description="Learn about JD Finance, our team, and our approach to financial services."
>
  <section class="mx-auto max-w-3xl px-6 py-24">
    <h1 class="text-5xl">About JD Finance</h1>
    <p class="mt-8 text-lg text-brand-700">
      [Company story placeholder — who you are, what you do, and why clients
      choose you.]
    </p>
    <h2 class="mt-16 text-3xl">Our approach</h2>
    <p class="mt-4 text-brand-700">
      [Approach / values placeholder.]
    </p>
  </section>
</BaseLayout>
```

### `src/pages/contact.astro`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const email = 'hello@jdfinance.com';  // update to real email
const phone = '+1 (555) 123-4567';    // update to real phone
---
<BaseLayout
  title="Contact — JD Finance"
  description="Get in touch with JD Finance."
>
  <section class="mx-auto max-w-3xl px-6 py-24">
    <h1 class="text-5xl">Get in touch</h1>
    <p class="mt-8 text-lg text-brand-700">
      We'd love to hear from you. Reach out via email or phone.
    </p>
    <dl class="mt-10 space-y-4">
      <div>
        <dt class="font-semibold text-brand-900">Email</dt>
        <dd>
          <a href={`mailto:${email}`} class="text-accent-600 hover:underline">
            {email}
          </a>
        </dd>
      </div>
      <div>
        <dt class="font-semibold text-brand-900">Phone</dt>
        <dd>{phone}</dd>
      </div>
    </dl>
    <a
      href={`mailto:${email}`}
      class="mt-10 inline-block bg-brand-900 text-white px-8 py-3 hover:bg-accent-600 transition-colors"
    >
      Send us an email
    </a>
  </section>
</BaseLayout>
```

### `public/favicon.svg`

Placeholder — replace with real logo later.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="4" fill="#102a43"/>
  <text x="16" y="22" font-family="Georgia, serif" font-size="18"
        font-weight="700" fill="#d4a017" text-anchor="middle">JD</text>
</svg>
```

## Verify locally

```bash
npm install
npm run dev     # open http://localhost:4321
npm run build   # produces /dist folder
npm run preview # serves the production build
```
