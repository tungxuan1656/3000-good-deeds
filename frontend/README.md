# 3000 Good Deeds Frontend

Frontend app của dự án, xây dựng bằng React 19 + Vite.

## Stack
- React 19
- Vite
- Tailwind CSS + shadcn/ui
- Firebase SDK (Auth provider)
- TanStack Query + Zustand

## Environment Variables
Tạo `frontend/.env` từ `frontend/.env.example`:

```env
VITE_API_URL=http://localhost:8787/api/v1
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
VITE_SUPPORT_EMAIL=
```

## Chạy local
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

## Deploy
Frontend deploy bằng Firebase Hosting.
Xem checklist đầy đủ tại:
- `docs/03_technical/08_production_deploy_checklist.md`
