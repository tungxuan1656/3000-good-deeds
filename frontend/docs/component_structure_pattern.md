# Component structure pattern (page vs component con)

## 1) Rule bắt buộc

- **Page**: khai báo `const ComponentName = () => {}` và `export default ComponentName` ngay trong file page.
- **Component con**: dùng `export const ComponentName = () => {}`.
- **Mỗi folder component con** phải có `index.ts` để gom và re-export toàn bộ component trong folder.

## 2) Mẫu cho page

```tsx
// pages/goals-page.tsx
const GoalsPage = () => {
  return <div>Goals page</div>
}

export default GoalsPage
```

## 3) Mẫu cho component con

```tsx
// components/goals/goal-card.tsx
type GoalCardProps = {
  title: string
}

export const GoalCard = ({ title }: GoalCardProps) => {
  return <div>{title}</div>
}
```

## 4) Mẫu `index.ts` trong folder component

```ts
// components/goals/index.ts  — chỉ export PUBLIC components
export * from './goal-card'
export * from './goal-progress'
export * from './goal-form'

// NOTE: goal-card-skeleton, goal-row-item là internal — intentionally NOT exported here.
```

**Phân biệt public vs internal:**
- **Public**: component được dùng bên ngoài folder → đưa vào `index.ts`.
- **Internal**: component chỉ dùng nội bộ trong folder (sub-component của một component lớn) → **không** đưa vào `index.ts`, giữ là module-private.

## 5) Cách import khuyến nghị

```tsx
import { GoalCard, GoalForm, GoalProgress } from '@/components/goals'
```

## 6) Quy tắc kích thước file

- File/component **trên 200 dòng** phải được tách theo từng concern rõ ràng (shell, list, mock data, utils, ...).
- Mỗi component/hook chỉ chịu trách nhiệm **một việc** — không kết hợp quá nhiều concern trong cùng một file.
- Mock data phải tách vào `<domain>.mock.ts` — không nhúng trực tiếp vào component.

## 7) Checklist nhanh khi tạo mới

- [ ] Page dùng `const XPage` + `export default XPage`
- [ ] Component con dùng `export const`
- [ ] Folder component có `index.ts` — chỉ export public components
- [ ] Internal sub-components **không** có trong `index.ts`
- [ ] File dưới 200 dòng; nếu vượt, tách file theo concern
- [ ] Nơi sử dụng import từ folder (không import file lẻ nếu không cần)
