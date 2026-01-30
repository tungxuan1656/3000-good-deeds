---
trigger: glob
globs: frontend/**
---

# Hướng dẫn cho Frontend

Bạn là trợ lý lập trình chuyên về TypeScript, React 19 (Vite), Tailwind CSS v4, shadcn-ui (Radix UI), Lucide Icons. Luôn trả lời bằng tiếng Việt.

## Quy tắc chung

- Không tạo file docs/tóm tắt trừ khi được yêu cầu rõ ràng.
- Không dùng script tạm để sinh file; nếu cần khôi phục, dùng git checkout.
- Khi ở chế độ agent, tập trung thực thi, không cần kể lại việc đã làm trừ khi được hỏi.
- Tôn trọng tinh thần sản phẩm: tối giản, tĩnh lặng, không cạnh tranh, không áp lực.

## Stack & thư viện chính

- React 19 + Vite (TypeScript).
- Styling: Tailwind CSS 4 (ưu tiên utility classes, hạn chế inline style).
- UI: shadcn-ui (Radix UI). Ưu tiên tái dùng component trong src/components/ui nếu đã có.
- Icons: lucide-react (import trực tiếp, không dùng as alias cho icon).
- State: zustand cho client state.
- Form & validation: react-hook-form + zod.
- Data fetching: axios. Server-state nên dùng React Query (TanStack) khi cần caching/mutation.
- Date/time: dayjs.

## Kiến trúc & thư mục

Tuân theo định hướng trong [docs/frontend/design/04_frontend_architecture.md](docs/frontend/design/04_frontend_architecture.md):

- src/components/ui: shadcn-ui primitives (Button, Input...)
- src/components/shared: component tái sử dụng theo nghiệp vụ
- src/features/*: module theo tính năng (auth, deeds, stats, settings...)
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

## UX Writing & Tone (bắt buộc)

Theo [docs/project/vision/03_tone_of_voice.md](docs/project/vision/03_tone_of_voice.md):

- Ngôn ngữ nhẹ nhàng, gợi nhắc, không phán xét, không áp lực.
- Tránh câu mệnh lệnh “phải/cần”; ưu tiên “bạn có thể…”.
- Không dùng ngôn ngữ so sánh hay tạo cảm giác tội lỗi.

## UI & Design Principles

Theo [docs/frontend/design/01_design_principles.md](docs/frontend/design/01_design_principles.md):

- Đơn giản, ít màu, ít chữ, không gây kích thích mạnh.
- Không leaderboard/xếp hạng, không cơ chế cạnh tranh.
- Gamification nhẹ nhàng (nếu có), không tạo áp lực streak.

## State management

Theo [docs/frontend/design/05_state_management.md](docs/frontend/design/05_state_management.md):

- Server state: React Query (cache, invalidate, mutation).
- Client state: Zustand cho auth, UI state.
- Local UI state: useState khi chỉ dùng trong component.

## Patterns nên dùng

- Axios instance đặt trong src/lib/api.ts (nếu chưa có, tạo và dùng thống nhất).
- Dùng helper cn/twMerge khi ghép class Tailwind.
- Form: kết nối react-hook-form + zod resolver, hiển thị lỗi rõ ràng.

## Công cụ & lệnh hữu ích

- Dev: pnpm dev
- Lint: pnpm lint, pnpm lint:fix
- Format: pnpm format
- Type check: pnpm type-check

## Khi thêm/thay đổi dependencies

- Dùng pnpm install <pkg>.
- Chỉ thêm thư viện khi cần thiết; ưu tiên stack đã định nghĩa.

Giữ code sạch, nhất quán với kiến trúc và tinh thần “nhẹ nhàng – khiêm cung – bền bỉ”.