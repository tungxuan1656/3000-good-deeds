# 3000 Good Deeds Backend

API backend running on Cloudflare Workers + D1.

## Stack

- Cloudflare Workers (Hono)
- D1 (SQLite)
- JWT + refresh token session management
- Firebase Authentication as identity provider

## Environment Variables

Create `backend/.dev.vars` from `backend/.dev.vars.example`:

```env
FIREBASE_PROJECT_ID=
JWT_SECRET=
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=
```

## Local Run

```bash
pnpm --filter backend migrate:local
pnpm --filter backend dev
```

## Scripts

```bash
pnpm --filter backend lint
pnpm --filter backend type-check
pnpm --filter backend check
pnpm --filter backend migrate:local
pnpm --filter backend migrate:remote
pnpm --filter backend seed:data
pnpm --filter backend deploy
```

## Auth Endpoints

- `POST /api/v1/auth/provider/exchange`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`

## Backend Documentation

- `backend/docs/README.md`
- `backend/docs/technical/`
- `backend/docs/standards/`
- `backend/docs/product/`
- shared docs in `docs/monorepo/`
