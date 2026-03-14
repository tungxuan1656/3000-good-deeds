# 3000 Good Deeds

Monorepo cho ứng dụng web ghi nhận việc thiện, theo kiến trúc tách biệt:
- `frontend`: React + Vite + Firebase Hosting
- `backend`: Cloudflare Workers + D1
- `docs`: đặc tả sản phẩm, kiến trúc, API, setup/deploy

## Bắt đầu nhanh

### 1) Cài đặt
```bash
pnpm install
```

### 2) Cấu hình môi trường
- Frontend: tạo/cập nhật `frontend/.env` theo `frontend/.env.example`
- Backend: tạo/cập nhật `backend/.dev.vars` theo `backend/.dev.vars.example`

### 3) Chạy local
```bash
# Terminal 1
pnpm dev:backend

# Terminal 2
pnpm dev:frontend
```

- Backend: `http://localhost:8787`
- Frontend: `http://localhost:5173`

## Tài liệu quan trọng
- Tổng quan tài liệu: [docs/README.md](docs/README.md)
- Kiến trúc hệ thống: [docs/03_technical/00_architecture.md](docs/03_technical/00_architecture.md)
- Setup local đầy đủ: [docs/03_technical/04_setup_guide.md](docs/03_technical/04_setup_guide.md)
- Deploy production checklist: [docs/03_technical/08_production_deploy_checklist.md](docs/03_technical/08_production_deploy_checklist.md)

## Authentication (hiện tại)
- Firebase chỉ đóng vai trò **Identity Provider**.
- Backend vẫn cấp và quản lý `accessToken` + `refreshToken` riêng.
- Endpoint đăng nhập chính: `POST /api/v1/auth/provider/exchange`.

## Scripts root
```bash
pnpm dev:backend
pnpm dev:frontend
pnpm build:frontend
pnpm deploy:backend
```
