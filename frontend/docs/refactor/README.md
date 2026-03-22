# Refactor UI Frontend Theo Stitch

## 1. Mục tiêu
Refactor UI frontend theo Stitch + `DESIGN.md`, chuẩn hóa IA còn 6 màn hình:
- `/login`
- `/`
- `/timeline`
- `/handbook`
- `/progress`
- `/more`

Đợt này triển khai đồng thời desktop + mobile responsive, không giữ alias route cũ.

## 2. Quyết định đã khóa
- Loại bỏ toàn bộ cụm `inner/*`, `meditation`, màn `random acts` độc lập.
- Gộp `goals + stats` vào màn `Progress`.
- Gộp `settings/account` vào màn `More`.
- Random quote và kindness suggestion dùng dạng thành phần nhúng.
- Daily suggestion hiển thị text-only.
- Không thay đổi schema backend API.

## 3. Phạm vi code đã triển khai
- Cập nhật app routing, navigation desktop/mobile, breadcrumb.
- Refactor design token + font trong `index.css` và `index.html`.
- Refactor UI primitives chính: `button`, `input`, `textarea`, `switch`, `tag`, `card`, `empty`, `dialog`, `sheet`.
- Tạo màn mới:
  - `handbook-page.tsx`
  - `progress-page.tsx`
- Refactor `more-page.tsx` để chứa toàn bộ settings/account actions.
- Thêm component nhúng `kindness-suggestion-card.tsx`.
- Loại bỏ các page legacy không còn trong IA.

## 4. Tài liệu chi tiết
- `01-current-frontend-audit.md`
- `02-design-token-migration.md`
- `03-ui-primitives-spec.md`
- `04-screen-component-api-mapping.md`
- `05-implementation-checklist.md`
- `06-test-qa-checklist.md`
- `07-deprecation-cleanup-list.md`
- `08-risk-log-and-open-questions.md`

## 5. Nguồn chuẩn
- `docs/product/feature-overview.md`
- `frontend/docs/stitch-ui/ethos_sage/DESIGN.md`
- `frontend/docs/mcp-pages.md`
