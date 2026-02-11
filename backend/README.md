# 3000 Good Deeds Backend

API layer của 3000 Việc Thiện tập trung vào việc hỗ trợ người dùng ghi nhận những hành vi thiện lành, quán chiếu bản thân và duy trì thói quen bền bỉ thay vì xây dựng mạng xã hội hay hệ thống chấm điểm đạo đức. Backend này vận hành hoàn toàn trên Cloudflare Workers với D1 Database để giữ độ mỏng, nhanh và dễ vận hành.

## Tinh thần định hướng
- Định hướng “tĩnh tâm hơn phô trương, bền bỉ hơn rực rỡ”.
- Mỗi quyết định kỹ thuật luôn trả lời: “Điều này có giúp người dùng sống thiện lành và tự do nội tâm hơn không?”.
- MVP hiện tại bao gồm đăng ký/đăng nhập, check-in việc thiện, phân loại, thống kê/quán chiếu, mục tiêu, thành tựu và nhắc nhở.

## Kiến trúc & stack
- **Cloudflare Workers** với `wrangler` để deploy API edge.
- **D1 Database** cho bảng người dùng, việc thiện, mục tiêu, hoạt động và phân loại. Các migration nằm trong `migrations/` và tuân thủ nguyên tắc không sửa migration cũ.
- Backend viết bằng TypeScript, module chính ở `src/index.ts`, middleware `auth.ts`, helpers `utils.ts`, kiểu `types.ts` và handler theo từng miền (users, deeds, goals, categories, activities).
- Cấu hình deploy & d1 trong `wrangler.json`, kiểm tra lint/tsc qua `npm run check`.

## Bắt đầu
```
# Cài dependency
npm ci

# Tạo D1 database local (hoặc remote) và ghi `database_id` vào wrangler.json
npx wrangler d1 create 3000-good-deeds

# Chạy migration mới nhất
npm run migrate:local

# Khởi động worker local
npm run dev

# Kiểm tra trước khi deploy
npm run check
```

## Migration và dữ liệu mẫu
- `migrations/` chứa các bước thay đổi schema. Khi cần thay đổi cấu trúc, tạo file mới với tên tăng dần và viết SQL tương ứng.
- `npm run db:reset` xoá và tạo lại database local rồi chạy toàn bộ migration.
- `npm run seed:test` import dữ liệu mẫu (users, deeds, goals, reactions) để dễ kiểm thử trên local.

## Tài liệu trọng yếu
- [docs/00_overview.md](../docs/00_overview.md) mô tả tinh thần toàn cục của ứng dụng 3000 Việc Thiện.
- [docs/backend/00_overview.md](../docs/backend/00_overview.md) hướng dẫn đọc nhanh backend, các tài liệu architecture/auth/database/ops/security.
- [contract/api_overview.md](../contract/api_overview.md) và `contract/api/*` mô tả chi tiết các endpoint.
- [contract/data](../contract/data) và [contract/features](../contract/features) dùng để đảm bảo các model dữ liệu phù hợp với yêu cầu sản phẩm.

## Scripts thường dùng
| Lệnh                     | Mục đích                                               |
| ------------------------ | ------------------------------------------------------ |
| `npm run dev`            | Chạy API local (`wrangler dev`).                       |
| `npm run check`          | Kiểm tra TypeScript và dry-run deploy.                 |
| `npm run migrate:local`  | Áp migration vào D1 local.                             |
| `npm run migrate:remote` | Áp migration vào D1 môi trường remote.                 |
| `npm run db:reset`       | Xoá database local và chạy lại migration.              |
| `npm run seed:test`      | Nhập dữ liệu test mẫu (ví dụ users, deeds, reactions). |
| `npm run deploy`         | Deploy lên Cloudflare Workers production.              |

## Vận hành và an toàn
- Luôn tham khảo [docs/backend/07_operations.md](../docs/backend/07_operations.md) trước khi thay đổi cấu hình hoặc deploy.
- Dữ liệu production chỉ thay đổi qua các migration mới; không chỉnh sửa schema bằng tay.
- Khi thêm endpoint mới, cập nhật contract tương ứng và đảm bảo có test/manual kiểm thử, đồng thời rà soát lại `docs/00_overview.md` để không lệch tinh thần sản phẩm.# My Locket - Cloudflare Workers Backend
