# 05. Implementation Checklist

## Phase A - Audit & baseline docs
- [x] Inventory page/component/style hiện có.
- [x] Chốt mapping UI ↔ component ↔ API.
- [x] Tạo bộ docs trong `frontend/docs/refactor`.

## Phase B - Design system foundation
- [x] Cập nhật font trong `index.html`.
- [x] Refactor token màu và surface hierarchy trong `index.css`.
- [x] Bỏ semantic token legacy `body/speech/mind`.

## Phase C - UI primitives
- [x] Refactor `button`, `input`, `textarea`, `switch`, `tag`.
- [x] Refactor `empty`, `dialog`, `sheet`.
- [x] Refactor card shells (`card-section`, `card-inline-section`).

## Phase D - App shell + navigation
- [x] Cập nhật `PATHS` theo IA mới.
- [x] Cập nhật `app.tsx` routes.
- [x] Cập nhật sidebar/bottom-tab.
- [x] Cập nhật breadcrumb mapping.

## Phase E - Refactor màn hình
- [x] Login (`/login`).
- [x] Home (`/`) với embedded quote + kindness suggestion + reminder prompt.
- [x] Timeline (`/timeline`) giữ edit/delete/load-more.
- [x] Handbook (`/handbook`) gộp editor + history + embedded blocks.
- [x] Progress (`/progress`) gộp stats + goals + calendar + history.
- [x] More (`/more`) gộp toàn bộ settings/account actions.

## Phase F - Cleanup
- [x] Loại khỏi route và code path chính các màn hình deprecated.
- [x] Xóa file page legacy trong `src/pages`.
- [ ] Dọn sâu i18n keys legacy không còn dùng (deferred để tránh rủi ro regression i18n).

## Phase G - Verification
- [ ] `pnpm --filter frontend lint`
- [ ] `pnpm --filter frontend type-check`
- [ ] `pnpm --filter frontend test`
- [ ] Manual QA desktop/mobile theo checklist.

## Owner/Status
- Owner: Frontend team
- Status hiện tại: `In progress` (đã xong refactor chính, còn verification + tối ưu cleanup i18n).
