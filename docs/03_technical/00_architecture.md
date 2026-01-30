# 00. KIẾN TRÚC HỆ THỐNG (SYSTEM ARCHITECTURE)

## 1. Tech Stack
Dự án được xây dựng theo tiêu chí: **Serverless, Low-cost, High-performance**.

*   **Frontend:** React (Vite) + TailwindCSS + Shadcn/UI (deploy on Cloudflare Pages).
*   **Backend:** Cloudflare Workers (Hono framework).
*   **Database:** Cloudflare D1 (SQLite at Edge).
*   **Package Manager:** npm (Monorepo with Workspaces).

## 2. Luồng dữ liệu (Data Flow)
`Client (React)` <-> `Worker (API Layer)` <-> `D1 (Database)`

*   **Authentication:** Sử dụng Google OAuth 2.0. Worker verify token và cấp JWT session riêng.
*   **State:** Backend là stateless. Mọi request phải kèm Token.

## 3. Cấu trúc thư mục (Monorepo)
```
/
├── backend/            # Worker API code
│   ├── src/
│   │   ├── index.ts    # Entry point & Routes
│   │   └── dba/        # Database access (Drizzle/Raw)
├── frontend/           # React App
│   ├── src/
│   │   ├── components/ # UI Shared
│   │   └── pages/      # Route pages
└── docs/               # Tài liệu dự án
```

## 4. Mở rộng (Scalability)
*   D1 Database tự động replicate ở các edge.
*   Worker tự động scale theo request (0 -> vô cực).
*   Giới hạn hiện tại: D1 đang ở dạng Beta/Growth, cần chú ý limit write/read nếu user tăng đột biến.
