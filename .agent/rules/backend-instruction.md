---
trigger: glob
globs: backend/**
---

# Hướng dẫn cho Backend

Bạn là trợ lý lập trình chuyên về TypeScript, Cloudflare Workers (Hono), D1 Database. Luôn trả lời bằng tiếng Việt.

## Quy tắc chung

- Không tạo file docs/tóm tắt trừ khi được yêu cầu rõ ràng.
- Không dùng script tạm để sinh file; nếu cần khôi phục, dùng git checkout.
- Ưu tiên đọc và tuân thủ contract trong docs trước khi code.
- Tránh thay đổi public API nếu không được yêu cầu.

## Stack & thư viện chính

- Runtime: Cloudflare Workers.
- Framework: Hono.
- Database: D1 (SQLite).
- Auth: JWT + refresh token (jose).
- Migrations: wrangler d1 migrations.

## Kiến trúc backend

Theo [docs/backend/02_architecture.md](docs/backend/02_architecture.md):

- Worker xử lý HTTP + auth + nghiệp vụ.
- D1 lưu dữ liệu quan hệ.
- Worker không giữ state; mọi request phải retry-safe.

## Contract & API Design (bắt buộc)

Tuân theo:

- [docs/backend/05_api_design.md](docs/backend/05_api_design.md)
- [docs/contract/api_overview.md](docs/contract/api_overview.md)
- [docs/contract/api/*](docs/contract/api/00_overview.md)

Quy tắc:

- Base URL `/api/v1`.
- JSON only; `Content-Type: application/json`.
- Auth header: `Authorization: Bearer <token>`.
- API dùng camelCase; DB dùng snake_case.
- Timestamp là Unix milliseconds.

## Error handling (nghiêm ngặt)

Tuân theo [docs/backend/13_error_handling_detailed.md](docs/backend/13_error_handling_detailed.md):

- Response lỗi chuẩn: `{ error: { code, message, details?, requestId? } }`.
- Mapping HTTP status → error code chính xác.
- Validation error phải trả `details` theo field.

## Pagination & filtering

Tuân theo [docs/backend/12_api_pagination_and_filtering.md](docs/backend/12_api_pagination_and_filtering.md):

- List endpoints dùng cursor-based pagination.
- `limit` tối đa 100, `cursor` là last item id.
- Sort mặc định: `performed_at DESC, id DESC` cho deeds.

## Authentication & Security

Tuân theo:

- [docs/backend/03_authentication.md](docs/backend/03_authentication.md)
- [docs/backend/09_security.md](docs/backend/09_security.md)

Quy tắc:

- Access token ngắn hạn; refresh token lưu hash trong DB.
- Không lưu Google access token lâu dài.
- Không log dữ liệu nhạy cảm.
- Sử dụng env vars cho secrets; không hardcode.

## Code style (chuẩn senior)

- TypeScript strict, đầy đủ typings cho input/output.
- Mỗi handler làm một nhiệm vụ; tách validation, auth, data access.
- Không trộn logic DB vào route; tạo helper/service khi logic phức tạp.
- Dùng chuẩn HTTP status codes, không trả 200 cho lỗi.
- Không catch rồi nuốt lỗi; luôn trả lỗi có mã rõ ràng.
- Viết hàm thuần khi có thể, hạn chế side effects.

## Data & DB rules

- Đặt tên cột DB snake_case; mapping sang camelCase trong API.
- Không dùng SELECT * trong query production; chỉ lấy field cần thiết.
- Always bind parameters để tránh SQL injection.
- Với write operations, kiểm tra quyền sở hữu tài nguyên.

## Cấu trúc thư mục backend

- `src/routes/*`: định nghĩa routes.
- `src/handlers/*`: xử lý nghiệp vụ.
- `src/middlewares/*`: auth, logging, validation.
- `src/utils.ts`: helpers chung.
- `src/types.ts`: type definitions.

## Công cụ & lệnh hữu ích

- Dev: `npm run dev`
- Type check + dry run: `npm run check`
- Deploy: `npm run deploy`
- Migrate: `npm run migrate:local`, `npm run migrate:remote`

## Khi thêm/thay đổi dependencies

- Dùng `npm install <pkg>`.
- Chỉ thêm thư viện khi thật sự cần; ưu tiên native API và stack hiện có.

Mọi thay đổi phải giữ tính nhất quán với contract, kiến trúc, và nguyên tắc bảo mật.