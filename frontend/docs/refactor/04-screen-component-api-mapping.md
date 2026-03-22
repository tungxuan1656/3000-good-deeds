# 04. Screen-Component-API Mapping

## 1) Login (`/login`)
### Components
- `pages/login-page.tsx`
- `components/auth/login-side-card.tsx`

### Data/API
- Auth provider flow (`hooks/auth/use-auth-provider`)
- Không dùng API list/stats.

### Hành vi
- Login email/password
- Register
- Forgot password
- Login Google

---

## 2) Home (`/`)
### Components
- `HeaderSection`
- `CheckInCard` + `CheckInSheetFlow`
- `TodaySection` (list deed hôm nay)
- `DailyQuoteCard` (embedded)
- `KindnessSuggestionCard` (embedded text-only)
- `ReminderSuggestCard`

### API mapping
- Tạo deed nhanh:
  - request: `CreateDeedRequest`
  - fields: `description`, `labels`, `performedAt`
- Danh sách deed hôm nay:
  - query: `useDeeds({ from, to, limit })`
  - response item: `DeedDTO`
- Quote:
  - query: `useRandomQuote()`
  - response: `DailyQuoteDTO.content`, `author`, `source`
- Kindness suggestion:
  - query: `useRandomActs(1)`
  - response: `RandomActDTO.name`, `detail`, `note`

---

## 3) Timeline (`/timeline`)
### Components
- `HeaderSection`
- Group card theo ngày + `GoodDeedCard`
- `EditDeedDialog`, `ConfirmDialog`

### API mapping
- Query list: `useDeeds({ limit: 20 })`
- Mapping ngày: `performedAt || createdAt`
- Edit deed:
  - mutation: `useUpdateDeed`
  - payload: `description`, `labels`, `performedAt`
- Delete deed:
  - mutation: `useDeleteDeed`
- Load more:
  - `fetchNextPage()` với cursor pagination

---

## 4) Reflection Handbook (`/handbook`)
### Components
- `HeaderSection`
- Editor card (gratitude/repentance + textarea + save)
- History card (`InnerJournalHistoryItem`)
- Embedded `DailyQuoteCard`
- Embedded `KindnessSuggestionCard`

### API mapping
- Tạo entry:
  - mutation: `useCreateInnerJournalEntry`
  - payload: `CreateJournalRequest.type`, `content`
- Lịch sử entry:
  - query: `useInnerJournalEntries({ limit })`
  - response item: `JournalEntryDTO.id`, `type`, `content`, `createdAt`
- Xóa entry:
  - mutation trong `InnerJournalHistoryItem` -> `useDeleteInnerJournalEntry`

---

## 5) Progress (`/progress`)
### Components
- `HeaderSection`
- `StatsCard`
- `GoalSettingCard`
- `CalendarStats`
- `GoalHistoryCard`

### API mapping
- Stats summary:
  - query: `useStatsSummary()`
  - response: `StatsSummaryDTO.totalDeeds`, `streakDays`
- Goal settings:
  - query: `useGoals()`
  - mutation: `useUpsertGoals()`
  - payload: `UpsertGoalsRequest.goals[]`
  - fields: `type`, `targetCount`, `isEnabled`
- Calendar tháng:
  - query: `useCalendar(from, to)`
  - response: `CalendarDayDTO.date`, `count`
- Goal history:
  - query: `useGoalHistory({ limit })`
  - response item: `GoalHistoryDTO`

---

## 6) More (`/more`)
### Components
- `HeaderSection`
- `AccountProfileCard`
- `NotificationSettingsCard`
- `PasswordSecurityCard`
- `SessionCard`
- `DeleteAccountCard`

### API mapping
- User profile:
  - query: `useUser()` -> `UserDTO`
  - update: `useUpdateUser()` -> `displayName`, reminder fields
- Delete account flow:
  - helper: `settings-page-account-deletion.ts`
  - gọi `deleteMe()` + firebase delete + logout + navigate login
- Reminder settings:
  - dữ liệu đọc từ `UserDTO.reminderEnabled`, `reminderTime`

---

## 7) Ghi chú compatibility
- Không thay đổi contract API.
- Mapping mới chỉ thay đổi cách tổ chức UI/flow, giữ nguyên endpoint và DTO.
