# 3000 Good Deeds Backend

Backend API chạy trên Cloudflare Workers + D1.

## Stack
- Cloudflare Workers (Hono)
- D1 (SQLite)
- JWT + refresh token (session nội bộ)
- Firebase Authentication (chỉ dùng để verify identity token tại bước exchange)

## Environment Variables
Tạo `backend/.dev.vars` từ `backend/.dev.vars.example`:

```env
FIREBASE_PROJECT_ID=
JWT_SECRET=
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=
```

## Chạy local
```bash
# migrate local DB
pnpm --filter backend migrate:local

# run dev server
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

## Auth contract
- `POST /api/v1/auth/provider/exchange`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`

## Tài liệu liên quan
- `docs/03_technical/00_architecture.md`
- `docs/03_technical/03_api_reference.md`
- `docs/03_technical/08_production_deploy_checklist.md`
