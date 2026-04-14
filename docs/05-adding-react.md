# Adding React Components Later

This doc covers how to add React (or Vue / Svelte / Solid) components to the Astro site when you need interactivity — e.g., a mortgage calculator.

## Mental model: Astro Islands

Astro renders everything to static HTML by default. When you need a component to be interactive in the browser, you mark it as an **island** using a `client:*` directive. Astro then:

1. Renders the island's initial HTML at build time (so it's still in the HTML for SEO)
2. Ships the framework runtime (React, in our case) only on pages that use islands
3. Hydrates the island in the browser per the directive you chose

**Key point:** static pages (Home, About, Contact) ship zero JS. Only the calculator page ships React.

## Step-by-step: adding the mortgage calculator

### Step 1 — install the React integration

From the project root:

```bash
npx astro add react
```

Confirm the prompts. This command automatically:
- Installs `@astrojs/react`, `react`, `react-dom`, `@types/react`, `@types/react-dom`
- Updates `astro.config.mjs` to include the React integration
- Updates `tsconfig.json` with JSX settings

After the command, `astro.config.mjs` will look like:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://jdfinance.com',
  integrations: [sitemap(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

And `tsconfig.json` will be updated with JSX settings:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

These settings enable the modern JSX transform, so you don't need to import React in every `.tsx` file.

### Step 2 — write the component in plain React + TypeScript

Create `src/components/MortgageCalculator.tsx`:

```tsx
import { useState, useMemo } from 'react';

// Note: With modern React 17+ and the new JSX transform, you don't need to
// import React explicitly. However, if you encounter TypeScript errors in
// strict mode, you may need to add: import React from 'react';

export default function MortgageCalculator() {
  const [principal, setPrincipal] = useState(500_000);
  const [ratePct, setRatePct] = useState(6.5);
  const [years, setYears] = useState(30);

  const monthlyPayment = useMemo(() => {
    const monthlyRate = ratePct / 100 / 12;
    const n = years * 12;
    if (monthlyRate === 0) return principal / n;
    return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
  }, [principal, ratePct, years]);

  const totalPaid = monthlyPayment * years * 12;
  const totalInterest = totalPaid - principal;

  const formatCurrency = (n: number) =>
    n.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });

  return (
    <div className="rounded-lg border border-brand-100 p-8 bg-white shadow-sm">
      <div className="grid gap-6 md:grid-cols-3">
        <Field label="Loan amount" suffix="$">
          <input
            type="number"
            min="0"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full rounded border border-brand-100 px-3 py-2"
          />
        </Field>
        <Field label="Interest rate" suffix="%">
          <input
            type="number"
            step="0.01"
            min="0"
            value={ratePct}
            onChange={(e) => setRatePct(Number(e.target.value))}
            className="w-full rounded border border-brand-100 px-3 py-2"
          />
        </Field>
        <Field label="Term (years)">
          <input
            type="number"
            min="1"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full rounded border border-brand-100 px-3 py-2"
          />
        </Field>
      </div>

      <dl className="mt-8 grid gap-4 md:grid-cols-3 text-center">
        <Result label="Monthly payment" value={formatCurrency(monthlyPayment)} highlight />
        <Result label="Total paid" value={formatCurrency(totalPaid)} />
        <Result label="Total interest" value={formatCurrency(totalInterest)} />
      </dl>
    </div>
  );
}

function Field({
  label,
  suffix,
  children,
}: {
  label: string;
  suffix?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-brand-700">
        {label}{suffix && ` (${suffix})`}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function Result({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <dt className="text-sm text-brand-700">{label}</dt>
      <dd className={`mt-1 text-2xl font-display ${highlight ? 'text-accent-600' : 'text-brand-900'}`}>
        {value}
      </dd>
    </div>
  );
}
```

This is **100% standard React** — `useState`, `useMemo`, event handlers, JSX. Nothing Astro-specific.

### Step 3 — create the page and drop in the component

Create `src/pages/mortgage-calculator.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import MortgageCalculator from '../components/MortgageCalculator.tsx';
---
<BaseLayout
  title="Mortgage Calculator — JD Finance"
  description="Calculate your monthly mortgage payment with JD Finance's free tool."
>
  <section class="mx-auto max-w-4xl px-6 py-24">
    <h1 class="text-5xl">Mortgage Calculator</h1>
    <p class="mt-4 text-lg text-brand-700">
      Estimate your monthly payment based on loan amount, interest rate, and term.
    </p>
    <div class="mt-12">
      <MortgageCalculator client:load />
    </div>
  </section>
</BaseLayout>
```

The `client:load` directive is the only new concept. Alternatives:

| Directive | When to use |
|---|---|
| `client:load` | Hydrate immediately on page load (use for above-the-fold interactive widgets) |
| `client:idle` | Hydrate when the browser is idle (use for secondary interactivity) |
| `client:visible` | Hydrate when scrolled into view (use for below-the-fold components — great for perf) |
| `client:only="react"` | Skip SSR, render only in the browser (use for components that can't SSR, like ones needing `window`) |

For a calculator on its own page, `client:load` is fine. For a calculator embedded at the bottom of the Home page, `client:visible` would be better.

### Step 4 — add a nav link (optional)

In `src/components/Header.astro`, add to `navItems`:

```astro
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/mortgage-calculator', label: 'Calculator' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];
```

### Step 5 — verify

```bash
npm run dev
# visit http://localhost:4321/mortgage-calculator
```

Check in DevTools Network tab:
- Home page: no React JS loaded
- Calculator page: React JS loaded, component is interactive

## Passing data to islands

You can pass props from Astro to a React island:

```astro
---
const defaults = { principal: 750_000, rate: 6.5, years: 30 };
---
<MortgageCalculator client:load defaults={defaults} />
```

Props are serialized to JSON, so only JSON-safe values work (no functions, no class instances).

## Multiple frameworks

If you later want a Vue component too, just run `npx astro add vue` and you can use React and Vue islands on the same site. Astro ships only what each page needs.

## Gotchas

1. **`useEffect` with `window`**: fine in React islands (they only run in the browser when hydrated). But if you want to SSR them, guard with `typeof window !== 'undefined'`.
2. **Global state**: islands on the same page are independent React trees. Sharing state between islands needs a store (nanostores works well with Astro) or URL params.
3. **TypeScript**: `.tsx` files work out of the box once React is installed. Astro's `tsconfig` already has the right JSX settings.
4. **Tailwind classes**: use `className` inside `.tsx` (React convention), not `class` (Astro convention). Both compile to the same HTML.

## Summary

Adding React later = **one install command + write React as normal + drop into an Astro page with `client:load`**. No rewrite, no migration, no lost work.
