# Naming & conventions pattern

## 1) File naming

- File dùng `kebab-case`.
- Page: `<feature>-page.tsx`.
- Hook API: `use-<feature>.ts`.
- Store: `<feature>.store.ts`.
- API: `<feature>.ts`, registry endpoint ở `endpoints.ts`.
- Mock: `<feature>.mock.ts` — đặt cùng folder với `api/<feature>.ts`, **không** đặt trong component.
- Barrel export: `index.ts` trong folder component/hook lớn.

## 2) Export convention

- Page: `const XPage = () => {}` + `export default XPage`.
- Component con: `export const X = () => {}`.
- Hook/store helpers: named export.

## 3) Type naming

- DTO: hậu tố `DTO` (`UserDTO`, `GoalDTO`).
- API input: hậu tố `Request`.
- API output nghiệp vụ: hậu tố `Response`.
- Wrapper thống nhất: `ApiResponse<T>`.

## 4) React Query naming

- Query key constant: `*_KEYS` (`DEED_KEYS`, `GOAL_KEYS`).
- Cấu trúc key chuẩn: `all`, `list`, `detail`.
- Mutation success phải invalidate theo key scope.

## 5) Constant naming

- Route path dùng object `PATHS`.
- Text/copy dùng object theo domain (`INFO_COPY`, `LABEL_COPY`, `ONBOARDING_CONTENT`).
- Constant chung dùng `UPPER_SNAKE_CASE` cho biến đơn, `PascalCase` cho type.

## 6) Import convention

- Ưu tiên alias tuyệt đối: `@/...`.
- Không dùng relative path dài nhiều cấp khi đã có alias.
- Import component con qua barrel `index.ts` nếu folder đã có.
- **Thứ tự import bắt buộc**: third-party trước → dòng trắng → internal `@/` alias. Không trộn lẫn hai nhóm.
- **Không duplicate import từ cùng một path** — gộp thành một dòng `import` duy nhất:

```ts
// ❌ Sai
import { A } from '@/stores/foo'
import { B } from '@/stores/foo'

// ✅ Đúng
import { A, B } from '@/stores/foo'
```

## 7) Comment convention (bắt buộc)

- **Mọi comment trong code phải viết bằng tiếng Anh**.
- Khai báo trước để dùng cho tính năng sau: `// planned: <feature description>`.
- Placeholder/mock chờ API: `// TODO: connect to <API_ENDPOINTS.x.y> once available`.
- Hardcode tạm thời: `// TODO: replace with real data from <source> once <condition>`.
- Stale comment phải cập nhật ngay khi thay đổi giá trị/hành vi liên quan (interval, threshold, field name).

## 8) Tham chiếu trong project

- Page default export: [src/pages/goals-page.tsx](src/pages/goals-page.tsx)
- Component named export: [src/components/stats/stats-card.tsx](src/components/stats/stats-card.tsx)
- Type naming: [src/types/api.ts](src/types/api.ts)
- Query key naming: [src/hooks/api/use-deeds.ts](src/hooks/api/use-deeds.ts)
- Paths/constants: [src/lib/constants.ts](src/lib/constants.ts)
- Mock file pattern: [src/api/shifts.mock.ts](src/api/shifts.mock.ts)
