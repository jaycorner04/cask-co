# CASK & CO.

Premium spirits storefront built with React, TypeScript, Vite, Tailwind CSS, Zustand, React Router, Framer Motion, and Recharts.

## Run locally

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint
npm run build
```

## Source structure

- `src/App.tsx` - app shell and routes.
- `src/components/layout` - shared layout pieces such as navbar, cart drawer, age gate, footer, hero sections, form inputs, and panels.
- `src/components/products` - product cards, product rows, shop lists, and budget shelves.
- `src/pages` - route-level screens for home, shop, product detail, checkout, auth, dashboard, tastings, admin, about, and order tracking.
- `src/data` - static catalog fallback data and homepage display data.
- `src/hooks` - LivCheers live catalog loader and parser.
- `src/store` - Zustand app state for age gate, mobile menu, and cart.
- `src/types` - shared product, variant, cart, and store types.
- `src/utils` - product formatting helpers.
- `src/schemas` - form validation schemas.

## Live catalog

The shop and homepage load Hyderabad category listings through the Vite proxy in `vite.config.ts`. Current live feeds include whisky, beer, gin, rum, vodka, and brandy from LivCheers Hyderabad pages.
