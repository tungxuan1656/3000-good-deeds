# 3000 Good Deeds Frontend

Frontend application built with Next.js App Router + React 19.

## Stack

- Next.js App Router
- React 19
- Tailwind CSS + shadcn/ui
- Firebase SDK (identity provider)
- TanStack Query + Zustand
- Web Push + PWA manifest via root-scoped service worker

## Source Layout

- `src/app` -> Next.js App Router entrypoints and route groups
- `src/screens` -> reusable screen components mounted by route files
- `src/components` -> shared and feature components
- `src/api`, `src/hooks`, `src/stores`, `src/lib` -> app data/runtime layers

## Environment Variables

Create `frontend/.env` from `frontend/.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8787/api/v1
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_SUPPORT_EMAIL=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
```

Legacy `VITE_*` variables are still bridged in `next.config.ts` during migration, but new setup should use `NEXT_PUBLIC_*`.

## Routes

- `/` -> landing page
- `/terms`, `/privacy` -> legal public pages
- `/login` -> auth page
- `/home` -> authenticated home page
- `/timeline`, `/handbook`, `/progress`, `/more` -> authenticated app routes

## Local Run

```bash
pnpm --filter frontend dev
```

## Scripts

```bash
pnpm --filter frontend lint
pnpm --filter frontend type-check
pnpm --filter frontend build
```

## PWA Setup

- Manifest: `src/app/manifest.ts`
- Service worker: `public/sw.js`
- Service worker registration: `src/components/providers/app-providers.tsx`
- Service worker headers: `next.config.ts` (`/sw.js` + global security headers)

For local push/PWA testing, run Next.js with HTTPS:

```bash
pnpm --filter frontend dev -- --experimental-https
```

## Frontend Documentation

- `frontend/docs/README.md`
- `frontend/docs/standards/`
- `frontend/docs/product/`
- `frontend/docs/design/`
