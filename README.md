# SaiThwet — ဆိုင်သွက်

Bilingual React + TypeScript landing page for the SaiThwet social-commerce prototype.

## Run locally

```bash
npm install
npm run dev
```

Open the local address printed by Vite. `npm run build` creates a production build, and `npm run lint` runs the project linter.

## Project structure

- `src/pages/` — page composition.
- `src/components/layout/` — shared navigation and branding.
- `src/components/landing/` — landing-page components and icons.
- `src/components/auth/` — simulated login and registration dialog.
- `src/context/` — language and light/dark theme preferences.
- `src/data/` — Burmese and English copy.
- `src/styles/` — shared styles, responsive rules and motion.
- `src/assets/` and `public/` — static assets.

The language and theme choices are saved in the current browser's local storage. The landing page is a prototype: its example messages, integrations and plans are illustrative. It does not connect to live social networks, AI services, account systems, or payment providers.

The login and registration dialog is a UI-only simulation. It does not create or authenticate accounts or store passwords. Its demo session lasts only until the page is refreshed.

Submitting the simulated login or registration form opens a sample dashboard with overview, orders, products and conversations. The demo session is temporary; it does not authenticate users or send real messages.

The workspace provides browser-local order, product, payment and settings records. No backend, real authentication, social messaging, AI service or payment provider is connected. Records saved in localStorage can be cleared with browser data and are not shared across devices.
# saithwet_saas
