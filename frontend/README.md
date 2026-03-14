# 3000 Good Deeds Frontend

Frontend application built with React 19 + Vite.

## Stack

- React 19
- Vite
- Tailwind CSS + shadcn/ui
- Firebase SDK (identity provider)
- TanStack Query + Zustand

## Environment Variables

Create `frontend/.env` from `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:8787/api/v1
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
VITE_SUPPORT_EMAIL=
```

## Local Run

```bash
pnpm --filter frontend dev
```

## Scripts

```bash
pnpm --filter frontend lint
pnpm --filter frontend type-check
pnpm --filter frontend build
pnpm --filter frontend deploy
```

## Frontend Documentation

- `frontend/docs/README.md`
- `frontend/docs/standards/`
- `frontend/docs/product/`
- `frontend/docs/design/`
