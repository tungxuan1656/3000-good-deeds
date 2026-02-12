# 04. HƯỚNG DẪN CÀI ĐẶT & CHẠY DỰ ÁN (SETUP GUIDE)

Tài liệu này giúp bạn setup môi trường và chạy dự án (Backend + Frontend) trên máy local.

## 1. Yêu cầu (Prerequisites)
*   **Node.js:** v18 trở lên (Khuyên dùng v20 LTS).
*   **pnpm:** (Khuyên dùng, vì project dùng pnpm workspace).
*   **Wrangler CLI:** `pnpm add -g wrangler` (Để chạy Cloudflare Workers/D1).

## 2. Cài đặt (Installation)
Dự án là Monorepo. Tại thư mục gốc:

```bash
# 1. Cài đặt dependencies cho toàn bộ project
pnpm install
```

## 3. Backend Setup

### Cấu trúc
Backend nằm tại folder `backend/`.

### Config Environment
Copy file `.dev.vars.example` thành `.dev.vars` (nếu có) hoặc tạo file `wrangler.toml` dựa trên mẫu.

### Database Setup (Local D1)
Chúng ta cần tạo database và chạy migration trên local.

```bash
cd backend

# 1. Tạo migration (nếu cần sửa schema)
# npx wrangler d1 migrations create DB <tên_migration>

# 2. Chạy migration trên local
pnpm run migrate:local
# Lệnh này tương đương: wrangler d1 migrations apply DB --local

# 3. (Optional) Seed dữ liệu mẫu
# Seed categories + random acts + dharma quotes
pnpm run seed:data -- --local
```

### Chạy Backend Server
```bash
# Tại folder backend/
pnpm run dev
```
Server sẽ chạy tại: `http://localhost:8787`

---

## 4. Frontend Setup

### Cấu trúc
Frontend nằm tại folder `frontend/`.

### Config Environment
Tạo file `.env` tại `frontend/`:
```env
VITE_API_URL=http://localhost:8787/api/v1
```

### Chạy Frontend Server
```bash
# Tại folder gốc hoặc cd frontend/
pnpm run dev
# (Script gốc trong package.json có thể là "dev:frontend")
```
Server sẽ chạy tại: `http://localhost:5173` (hoặc port khác nếu 5173 bận).

---

## 5. Kiểm tra hoạt động (Verification)
1.  Đảm bảo cả Backend (8787) và Frontend (5173) đều đang chạy.
2.  Mở trình duyệt: `http://localhost:5173`.
3.  Thử chức năng **Đăng nhập Google** (Lưu ý: Cần cấu hình Google Client ID chính xác trong `backend/wrangler.toml` hoặc `.dev.vars` để auth hoạt động thật sự. Trên local có thể cần mock hoặc dùng Client ID test).

## 6. Các lệnh thường dùng

| Lệnh                      | Mô tả                        |
| :------------------------ | :--------------------------- |
| `pnpm run dev` (Backend)  | Chạy backend dev server      |
| `pnpm run dev` (Frontend) | Chạy frontend dev server     |
| `pnpm run migrate:local`  | Update database schema local |
| `pnpm run type-check`     | Kiểm tra lỗi TypeScript      |
| `pnpm run format`         | Format code với Prettier     |

## 7. Deploy Production

Checklist đầy đủ để deploy production (Backend Cloudflare Workers + Frontend Firebase Hosting):

- [08_production_deploy_checklist.md](./08_production_deploy_checklist.md)
