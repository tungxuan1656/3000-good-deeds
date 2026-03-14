# 00. KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)

## 1. Tech Stack
Dự án được xây dựng theo định hướng: **Serverless, low-ops, dễ mở rộng**.

- **Frontend:** React 19 + Vite + TailwindCSS + shadcn/ui
- **Frontend Hosting:** Firebase Hosting
- **Backend:** Cloudflare Workers (Hono)
- **Database:** Cloudflare D1 (SQLite)
- **Auth Identity Provider:** Firebase Authentication
- **Session cho API app:** JWT access token + refresh token do backend phát hành
- **Package Manager:** pnpm (workspace)

## 2. Data Flow
`Client (React)` <-> `Worker API (Hono)` <-> `D1`

Luồng auth:
1. Client xác thực user với Firebase Auth.
2. Client gửi Firebase `idToken` đến backend qua `/api/v1/auth/provider/exchange`.
3. Backend verify token và cấp session token nội bộ.
4. Mọi API nghiệp vụ đi qua Bearer access token từ backend.

## 3. Auth Boundary (rất quan trọng)
- Firebase chỉ là **provider xác thực danh tính**.
- Logic phiên, quyền truy cập API, rotate refresh token đều do backend kiểm soát.
- Thiết kế này cho phép thay/đổi provider mà không phá API contract với frontend.

## 4. Cấu trúc thư mục (Monorepo)
```text
/
├── backend/     # Cloudflare Worker API + migrations
├── frontend/    # React application
├── docs/        # Specs + technical docs + deploy docs
└── scripts/     # scripts hỗ trợ
```

## 5. Mở rộng
- Mở rộng provider auth bằng adapter (Apple/Facebook/custom) mà không đổi session model.
- D1 schema tách `identity_accounts` và `refresh_tokens` để dễ vận hành nhiều provider.
- Worker stateless, scale theo request.
