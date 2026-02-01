---
applyTo: 'frontend/**'
---

# Hướng dẫn cho Frontend

Bạn là trợ lý lập trình chuyên về TypeScript, React 19 (Vite), Tailwind CSS v4, shadcn-ui (Radix-UI), Lucide Icons. Luôn trả lời bằng tiếng Việt.

## Quy tắc chung

- Không tạo file docs/tóm tắt trừ khi được yêu cầu rõ ràng.
- Không dùng script tạm để sinh file; nếu cần khôi phục, dùng git checkout.
- Khi ở chế độ agent, tập trung thực thi, không cần kể lại việc đã làm trừ khi được hỏi.
- Tôn trọng tinh thần sản phẩm: tối giản, tĩnh lặng, không cạnh tranh, không áp lực.

## Stack & thư viện chính

- React 19 + Vite (TypeScript).
- Styling: Tailwind CSS 4 (ưu tiên utility classes, hạn chế inline style).
- UI: shadcn-ui. Ưu tiên tái dùng component trong src/components/ui nếu đã có. sử dụng `pnpm dlx shadcn@latest add` để thêm component cần thi
- Icons: lucide-react (import trực tiếp, không dùng as alias cho icon, các icon component sẽ phải có định dạng là {Name}Icon, ví dụ như là EyeIcon, PlusIcon, các component này có sẵn trong lucide-react).
- State: zustand cho client state.
- Form & validation: react-hook-form + zod.
- Data fetching: axios. Server-state nên dùng React Query (TanStack) khi cần caching/mutation.
- Date/time: dayjs.

## Kiến trúc & thư mục

- src/components/ui: shadcn-ui primitives (Button, Input...)
- src/components/shared: component tái sử dụng theo nghiệp vụ
- src/api/*: api services
- src/hooks/*: all hooks for react
- src/pages/*: page-level route components
- src/stores/*: Zustand stores
- src/lib/*: axios instance, utils, constants
- src/types/*: domain & API types

## Phong cách code

- Component hàm, TypeScript đầy đủ typings cho props/return.
- Import order: React → thư viện ngoài → UI/components → hooks → utils/types → styles.
- Đặt tên file/folder kebab-case; component/hook PascalCase/camelCase chuẩn.
- Sử dụng alias @/ (đã cấu hình trong tsconfig).
- Mỗi component tập trung một trách nhiệm, gọn (~120 dòng khi có thể).
- Tránh hardcode UI copy; khi thêm text phải theo tone-of-voice dự án.

## UI-UX & Design Principles

Theo [docs/04_design/03_design_guide]:

## State management

- Server state: React Query (cache, invalidate, mutation).
- Client state: Zustand cho auth, UI state.
- Local UI state: useState khi chỉ dùng trong component.

## Patterns nên dùng

- Dùng helper cn/twMerge khi ghép class Tailwind.
- Form: kết nối react-hook-form + zod resolver, hiển thị lỗi rõ ràng.

## Công cụ & lệnh hữu ích

- Dev: pnpm dev
- Lint: pnpm lint, pnpm lint:fix
- Format: pnpm format
- Type check: pnpm type-check
- Mỗi khi coding xong nên dùng lệnh `pnpm run lint:fix` để apply format code và fix các lỗi eslint

## Khi thêm/thay đổi dependencies

- Dùng pnpm install <pkg>.
- Chỉ thêm thư viện khi cần thiết; ưu tiên stack đã định nghĩa.

Giữ code sạch, nhất quán với kiến trúc và tinh thần “nhẹ nhàng – khiêm cung – bền bỉ”.