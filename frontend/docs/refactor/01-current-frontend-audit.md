# 01. Audit Frontend Hiện Trạng

## 1) Kiến trúc route sau refactor

- `GET /login` -> `login-page.tsx`
- `GET /` -> `landing-page.tsx`
- `GET /home` -> `home-page.tsx`
- `GET /timeline` -> `timeline-page.tsx`
- `GET /handbook` -> `handbook-page.tsx`
- `GET /progress` -> `progress-page.tsx`
- `GET /more` -> `more-page.tsx`

## 2) App shell

- App Router: `frontend/src/app/**`
- Authenticated shell route group: `frontend/src/app/(app-shell)/layout.tsx`
- Layout: `frontend/src/components/layout/app-layout.tsx`
- Sidebar desktop: `frontend/src/components/layout/app-sidebar.tsx`
- Bottom tab mobile: `frontend/src/components/layout/bottom-tab.tsx`
- Root providers: `frontend/src/components/providers/app-providers.tsx`

## 3) Inventory page/component chính đang dùng

### Screens

- `frontend/src/screens/landing-page.tsx`
- `frontend/src/screens/login-page.tsx`
- `frontend/src/screens/home-page.tsx`
- `frontend/src/screens/timeline-page.tsx`
- `frontend/src/screens/handbook-page.tsx`
- `frontend/src/screens/progress-page.tsx`
- `frontend/src/screens/more-page.tsx`

### Feature components

- Home: `components/home/today-section.tsx`, `components/shared/check-in-*`
- Timeline: `components/shared/good-deed-card.tsx`
- Handbook: `components/inner/inner-journal-history-item.tsx`, `hooks/api/use-inner-journal.ts`
- Progress: `components/stats/*`, `components/goals/*`
- More: `components/settings/*`

### Shared embedded blocks

- Quote: `components/shared/daily-quote-card.tsx`
- Kindness suggestion (mới): `components/shared/kindness-suggestion-card.tsx`
- Reminder suggestion: `components/shared/reminder-suggest-card.tsx`

## 4) Styling foundation

- Global token: `frontend/src/index.css`
- Root layout: `frontend/src/app/layout.tsx`
- UI primitive layer: `frontend/src/components/ui/*`

## 5) API hooks mapping khả dụng

- Deeds: `useDeeds`, `useCreateDeed`, `useUpdateDeed`, `useDeleteDeed`
- Activities calendar: `useCalendar`
- Goals: `useGoals`, `useUpsertGoals`, `useGoalHistory`
- Stats summary: `useStatsSummary`
- Journal: `useInnerJournalEntries`, `useCreateInnerJournalEntry`, `useDeleteInnerJournalEntry`
- Cultivation: `useRandomQuote`, `useRandomActs`
- User/settings: `useUser`, `useUpdateUser`

## 6) Kết luận audit

- Dữ liệu API đã đủ cho 6 màn hình mới, không cần đổi schema backend.
- Refactor tập trung vào IA + component composition + design token.
- Legacy pages đã được loại khỏi route chính để tránh truy cập sai IA.
