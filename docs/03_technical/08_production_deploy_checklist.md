# 08. CHECKLIST DEPLOY PRODUCTION

Checklist này dùng cho kiến trúc hiện tại:
- **Backend:** Cloudflare Workers + D1
- **Frontend:** Firebase Hosting

---

## A. Chuẩn bị trước khi deploy (một lần)

### 1) Tài khoản & quyền truy cập
- [ ] Có quyền **Admin/Deploy** trên Cloudflare account chứa Worker + D1.
- [ ] Có quyền **Editor/Owner** trên Firebase project production.
- [ ] Đã cài CLI: `wrangler`, `firebase-tools`, `pnpm`, `node`.
- [ ] Đã đăng nhập CLI:
  - [ ] `wrangler login`
  - [ ] `firebase login`

### 2) Mapping môi trường production
- [ ] Worker name đúng: `3000-good-deeds-backend` trong [backend/wrangler.json](../../backend/wrangler.json).
- [ ] D1 production đúng `database_id` trong [backend/wrangler.json](../../backend/wrangler.json).
- [ ] Firebase project mặc định đúng trong [frontend/.firebaserc](../../frontend/.firebaserc).
- [ ] Firebase site đúng trong [frontend/firebase.json](../../frontend/firebase.json).

### 3) Google OAuth (production)
- [ ] Thêm domain production vào **Authorized JavaScript origins**.
- [ ] Thêm domain production vào **Authorized redirect URIs**.
- [ ] Đồng bộ `GOOGLE_CLIENT_ID` giữa backend và frontend.

---

## B. Secrets & biến môi trường production

### 1) Backend (Cloudflare Worker)
- [ ] Đã set đủ biến môi trường bắt buộc theo [backend/worker-configuration.d.ts](../../backend/worker-configuration.d.ts):
  - [ ] `GOOGLE_CLIENT_ID`
  - [ ] `GOOGLE_CLIENT_SECRET`
  - [ ] `JWT_SECRET`
  - [ ] `VAPID_PUBLIC_KEY`
  - [ ] `VAPID_PRIVATE_KEY`
  - [ ] `VAPID_SUBJECT`
- [ ] Các giá trị nhạy cảm được lưu dưới dạng **secret** trên Cloudflare, không commit vào git.

### 2) Frontend (Firebase Hosting)
- [ ] Tạo/cập nhật `frontend/.env.production` với:
  - [ ] `VITE_API_URL=https://<worker-domain>/api/v1`
  - [ ] `VITE_GOOGLE_CLIENT_ID=<google-client-id-prod>`
  - [ ] `VITE_SUPPORT_EMAIL=<email-ho-tro>` (nếu dùng)
- [ ] Không chứa secret backend trong frontend env.

---

## C. Pre-deploy checks (mỗi lần release)

### 1) Đồng bộ code
- [ ] `main` đã merge đầy đủ, không còn conflict.
- [ ] Release notes/changelog nội bộ đã cập nhật.

### 2) Chất lượng mã nguồn
- [ ] Backend pass kiểm tra:
  - [ ] `pnpm --filter backend run type-check`
  - [ ] `pnpm --filter backend run lint`
  - [ ] `pnpm --filter backend run check`
- [ ] Frontend pass kiểm tra:
  - [ ] `pnpm --filter frontend run type-check`
  - [ ] `pnpm --filter frontend run lint`
  - [ ] `pnpm --filter frontend run build`

### 3) Database
- [ ] Đã review migration mới trong `backend/migrations/`.
- [ ] Migration đã test trên local/staging.
- [ ] Có phương án backup dữ liệu production trước khi áp migration.

---

## D. Deploy backend (Cloudflare Workers)

- [ ] Chạy deploy backend từ root:
  - [ ] `pnpm --filter backend run deploy`
- [ ] Xác nhận deploy thành công trên Cloudflare Dashboard.
- [ ] Xác nhận migration remote đã chạy (script `predeploy` gọi `migrate:remote`).
- [ ] Xác nhận cron trigger hoạt động (đang cấu hình `*/5 * * * *` trong [backend/wrangler.json](../../backend/wrangler.json)).

---

## E. Deploy frontend (Firebase Hosting)

- [ ] Build frontend production:
  - [ ] `pnpm --filter frontend run build`
- [ ] Deploy Firebase Hosting:
  - [ ] `cd frontend && firebase deploy --only hosting`
  - [ ] Hoặc dùng script: `pnpm --filter frontend run deploy`
- [ ] Xác nhận bản mới đã live đúng domain.

---

## F. Smoke test sau deploy

- [ ] Truy cập website production, không lỗi trắng trang.
- [ ] Đăng nhập Google thành công.
- [ ] Tạo/sửa/xóa 1 việc thiện thành công.
- [ ] Trang thống kê, mục tiêu, lịch sử hoạt động tải đúng dữ liệu.
- [ ] API gọi tới đúng production URL (`/api/v1`).
- [ ] Push notification test hoạt động (nếu bật reminders).
- [ ] Không có lỗi nghiêm trọng trong Cloudflare logs / Firebase Hosting logs.

---

## G. Rollback plan (bắt buộc có)

- [ ] Giữ lại commit/tag release trước đó để rollback nhanh.
- [ ] Có sẵn quy trình redeploy frontend về bản trước.
- [ ] Nếu migration gây lỗi, có kế hoạch fix-forward hoặc khôi phục từ backup.
- [ ] Có kênh thông báo nội bộ khi phát hiện incident production.

---

## H. Lịch vận hành định kỳ

- [ ] Rà soát secrets mỗi 30-60 ngày.
- [ ] Theo dõi usage/quota Cloudflare & Firebase.
- [ ] Kiểm tra lại OAuth consent/domain sau mỗi lần đổi domain.
- [ ] Kiểm tra cron reminders và tỷ lệ lỗi push hàng tuần.
