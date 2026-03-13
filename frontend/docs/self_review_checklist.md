# Self-Review Checklist — Chuyên sâu

> Tài liệu này dành cho **self-review trước khi push / trước khi tạo PR**.
> Được tổng hợp từ tất cả review thực tế đã nhận — mỗi mục đều tương ứng với một lỗi thật đã bị reviewer bắt.
> Mục tiêu: **zero Critical, zero recurring pattern** khi reviewer nhìn vào PR.

---

## Cách sử dụng

1. **Hoàn thành code** → chạy `pnpm run lint`.
2. **Mở từng file thay đổi** (`git diff --name-only main...HEAD`).
3. **Duyệt file theo từng PHASE bên dưới**, đánh dấu `[x]` vào mỗi mục đã kiểm tra.
4. Nếu phát hiện vi phạm → sửa ngay, không để "fix sau".
5. Chỉ push khi **tất cả mục phù hợp** đều `[x]`.

---

## PHASE 1 — Data Flow Integrity (Lỗi được tìm thấy nhiều nhất)

> **Nguyên tắc phát hiện**: Theo dõi mọi dữ liệu từ lúc user nhập → lúc gửi lên server. Bất kỳ chỗ nào dữ liệu "biến mất" giữa đường là bug.

### 1.1. Form → Payload completeness

- [ ] Liệt kê tất cả `useState` / form field thu thập input của user.
- [ ] Mở hàm submit (`onSubmit`, `mutate`) → xác nhận **từng field** ở trên xuất hiện trong payload.
- [ ] Field nào chưa gửi được → bắt buộc có `// TODO: include <field> in payload once <endpoint> supports it`.
- [ ] **Ví dụ thực tế đã mắc**: `rememberMe` checkbox thu thập nhưng `onSubmit` chỉ gửi `email` + `password`. `selectedVehicle` hiển thị trên UI nhưng `handleCreate` không gửi `vehicleId`.

### 1.2. Button label ↔ Handler consistency

- [ ] Với mọi `<Button>` hoặc element có `onClick` → đọc label text, đọc handler code. Hỏi: **"label nói gì? handler làm gì? Hai thứ có khớp không?"**
- [ ] Button "Save as Draft" mà handler chỉ đóng modal → đổi label thành "Cancel" hoặc implement save.
- [ ] Button không có `onClick` hoặc `onClick` rỗng `() => {}` → bắt buộc có `// TODO:` kèm action/endpoint cụ thể.
- [ ] **Ví dụ thực tế đã mắc**: Nút "Save as Draft" và "Create and Send Schedule" không có `onClick` handler.

### 1.3. Optimistic update phải có persistence plan

- [ ] Mọi state React-local thay đổi UI nhưng không gọi API → bắt buộc có comment: `// TODO: call PATCH /... to persist. Without this, data is lost on refresh.`
- [ ] **Ví dụ thực tế đã mắc**: `vehicleBySlotId` / `vehicleByShiftId` lưu xe được gán trong React state, reload mất hết.

### 1.4. Single source of truth

- [ ] Không lưu cùng một dữ liệu ở 2 nơi (ví dụ: Zustand + raw `localStorage`).
- [ ] Nếu bắt buộc 2 nơi → ghi rõ ai là source of truth, ai đọc từ đâu.
- [ ] **Ví dụ thực tế đã mắc**: `accessToken` lưu cả trong Zustand persist store lẫn `localStorage.setItem('accessToken', ...)`, interceptor đọc từ localStorage, Zustand bị stale.

---

## PHASE 2 — i18n (Lỗi phổ biến thứ 2)

> **Nguyên tắc phát hiện**: Grep mọi string literal trong JSX. Bất kỳ text nào user nhìn thấy mà không qua `t()` là vi phạm.

### 2.1. Không hardcode text UI

- [ ] Mọi `label`, `placeholder`, `title`, `description`, `error message`, `button text`, `tab name`, `table header` đều qua `t()`.
- [ ] Đặc biệt chú ý: badge text, tooltip, toast message, empty state message.
- [ ] **Ví dụ thực tế đã mắc**: `'11.2분'`, `'1,569대'` (Korean units hardcoded), `'Chauffeur / Operation'`, `'Enter Keyword'`, `'Latest'/'Oldest'`.

### 2.2. `t()` tại module level = frozen labels

- [ ] Grep: `const ... = t(` ở ngoài function body → label đóng băng lúc import, không cập nhật khi đổi ngôn ngữ.
- [ ] **Fix**: Lưu i18n key trong constant, gọi `t(key)` tại render time. Hoặc nếu web reload khi đổi ngôn ngữ thì thêm comment giải thích bằng tiếng Anh.
- [ ] **Áp dụng cho cả Zod schema**: Schema ở module scope gọi `t()` → validation message bị frozen.
- [ ] **Fix schema**: Chuyển thành factory function `createSchema()` gọi bên trong component / `useMemo`.

### 2.3. i18n key sync across locales

- [ ] Mọi key mới phải tồn tại trong **tất cả** file locale (`en.json`, `vi.json`, `kr.json`).
- [ ] Grep key mới → mở từng locale file → xác nhận key có mặt.
- [ ] **Ví dụ thực tế đã mắc**: `control.filter.searchBtn` chỉ có trong `vi.json`, thiếu `en.json` và `kr.json`. `kr.json` ~80% chưa dịch.

### 2.4. Interpolation thay vì nối chuỗi

- [ ] Không nối string thủ công: `` `${count} Total` `` → dùng `t('key', { count })`.
- [ ] Chuỗi có số lượng, đơn vị, thời gian → dùng interpolation.

---

## PHASE 3 — Performance (Lỗi gây hậu quả lớn với data thật)

> **Nguyên tắc phát hiện**: Hỏi "code này chạy bao nhiêu lần mỗi render? Mỗi lần tốn bao nhiêu?"

### 3.1. Derived values phải `useMemo`

- [ ] Grep mọi `const x = ...` trong component body có `.filter(`, `.map(`, `.find(`, `new Map(`, `new Set(`, phép tính từ props/state → bọc `useMemo` nếu dùng trong JSX hoặc truyền child.
- [ ] **Ví dụ thực tế đã mắc**: `filterDriversByQuery(allDrivers, searchQuery)` gọi trực tiếp không memo. `availableVehicles = vehicles.filter(...)` tính lại mỗi render.

### 3.2. `Date` object trong `useMemo` deps

- [ ] `new Date(...)` tạo object mới mỗi render → dùng làm deps khiến `useMemo` luôn tái tính.
- [ ] **Fix**: Memo Date objects riêng với deps là primitive (timestamp, string).
- [ ] **Ví dụ thực tế đã mắc**: `timelineStart = startOfDay(dateRange?.from ?? new Date())` dùng làm deps của `displayDrivers` useMemo → memoization bị phá.

### 3.3. O(n×m) loại bỏ bằng precomputed lookup

- [ ] `.find()` / `.filter()` / `.includes()` bên trong `.map()` / `for` loop → thay bằng `Map` / `Set` / `Record` tạo trước vòng lặp.
- [ ] **Ví dụ thực tế đã mắc**: Mỗi `GanttDriverRow` filter toàn bộ `displaySlots` → O(drivers × slots). `SECTIONS.find()` bên trong grouping loop. `STATUS_OPTION_KEYS.find()` gọi 2 lần cho cùng một lookup.

### 3.4. Nhiều pass trên cùng data

- [ ] N lần `.filter()` trên cùng array khi có thể gộp 1 pass.
- [ ] **Ví dụ thực tế đã mắc**: `useControlStats` gọi `drivers.filter()` 3 lần riêng biệt thay vì 1 vòng for đếm tất cả.

### 3.5. Re-render isolation

- [ ] Component con subscribe store slice mà thay đổi thường xuyên → mọi instance re-render.
- [ ] **Fix**: Lift computed value lên parent + truyền prop + `React.memo` với custom comparator.
- [ ] Timer (`setInterval` + `useState`) phải nằm trong component nhỏ nhất → tránh re-render cả tree.
- [ ] `React.memo` mà nhận object/array prop từ store thay thế reference mỗi fetch → cần custom comparator.
- [ ] **Ví dụ thực tế đã mắc**: `ControlDriverCard` subscribe `selectedDriverId` → tất cả card re-render khi chọn 1 driver. NOW line timer re-render toàn bộ GanttChart.

### 3.6. Identity select = dead code

- [ ] `select: (res) => res` hoặc `select: (data) => data` trong React Query → xóa hoàn toàn.
- [ ] **Ví dụ thực tế đã mắc**: `select: (res): TrackingDriverItemDTO[] => res` — không transform gì.

---

## PHASE 4 — View Consistency (Map ≠ List bug)

> **Nguyên tắc phát hiện**: Nếu 2+ view hiển thị cùng data → cả hai phải dùng **cùng một source đã lọc**.

### 4.1. Filtered vs unfiltered data

- [ ] Liệt kê tất cả view render cùng dataset (list, map, chart, stats bar).
- [ ] Xác nhận tất cả dùng cùng filtered source. Nếu list dùng `useFilteredDrivers()` thì map cũng phải dùng.
- [ ] **Ví dụ thực tế đã mắc**: `ControlDriverList` dùng `useFilteredDrivers()` nhưng `DriverMarkers` trên map dùng `useControlStore.use.drivers()` (unfiltered) → filter driver theo status, list ẩn nhưng map vẫn hiện.

### 4.2. Filter UI wired but not applied

- [ ] Mỗi filter dropdown/checkbox trong UI → tìm selector/logic tương ứng xử lý giá trị đó.
- [ ] **Ví dụ thực tế đã mắc**: Grade filter dropdown set `gradeFilter` trong store, nhưng `useFilteredDrivers` selector không check `gradeFilter`. DTO cũng không có `grade` field.

---

## PHASE 5 — State Lifecycle & Auth

> **Nguyên tắc phát hiện**: Trace state từ init → persist → rehydrate → logout. Mỗi transition phải coherent.

### 5.1. Persist ↔ Rehydrate consistency

- [ ] Field excluded từ `partialize` sẽ reset về `initialState` sau reload.
- [ ] Nếu field đó được dùng làm guard (`isSessionChecked` → ProtectedRoute) → app bị stuck.
- [ ] **Ví dụ thực tế đã mắc**: `isSessionChecked` excluded khỏi `partialize`, sau rehydrate luôn `false` → infinite loading spinner.

### 5.2. Auth interceptor edge cases

- [ ] Login request không nên gửi kèm stale auth token → skip Authorization header cho auth endpoints.
- [ ] Token refresh: queued requests phải set `_retry` flag trước khi re-dispatch → tránh vòng lặp 401.
- [ ] Type naming giữa DTO và request body phải consistent (camelCase vs snake_case).
- [ ] **Ví dụ thực tế đã mắc**: `adminLogin` dùng `client` instance có interceptor gắn Bearer token cũ. `RefreshTokenRequest` type dùng `refreshToken` nhưng body gửi `refresh_token`.

### 5.3. State flag never read = dead code

- [ ] Mọi state flag được set → phải có nơi read. Flag set mà không ai đọc → xóa hoặc implement.
- [ ] **Ví dụ thực tế đã mắc**: `isSessionChecked` set ở nhiều action nhưng không component nào đọc.

---

## PHASE 6 — Modal & Dialog Pattern

> **Nguyên tắc phát hiện**: Grep tất cả `<Dialog` / `<Drawer` / `<Sheet` → kiểm tra prop signature.

### 6.1. Ref pattern bắt buộc

- [ ] Dialog/Modal/Drawer phải dùng `ref` + `useImperativeHandle` expose `open()`.
- [ ] **Không** nhận `open: boolean` / `onOpenChange` từ props bên ngoài.
- [ ] **Ví dụ thực tế đã mắc**: `CreateShiftModal` nhận `open` và `onOpenChange` props trong khi cùng PR có `DriverPickerModal` và `VehicleAssignModal` đã đúng pattern ref.

### 6.2. Không `return null` trước Dialog wrapper

- [ ] `return null` trước `<Dialog>` sẽ unmount component → mất close animation.
- [ ] Data biến mất (refetch xóa item đang xem) → hiển thị fallback **bên trong** `<DialogContent>`.
- [ ] **Ví dụ thực tế đã mắc**: `ControlDriverModal` return null khi `driver` không tìm thấy → close modal không có animation, refetch xóa driver → modal biến mất đột ngột.

### 6.3. DialogClose cho nút Cancel

- [ ] Nút Cancel dùng `<DialogClose asChild>` → không `onClick={() => setIsOpen(false)}` thủ công.

---

## PHASE 7 — Mock Data & API Layer

> **Nguyên tắc phát hiện**: Grep `MOCK_` và `.mock.ts` trong component files.

### 7.1. Component không import trực tiếp từ `.mock.ts`

- [ ] Mock data chỉ được dùng trong `api/<domain>/index.ts`.
- [ ] Component/hook phải đi qua API function → hook → component.
- [ ] **Ví dụ thực tế đã mắc**: `MOCK_SHIFT_VEHICLES` imported trực tiếp trong `gantt-chart.tsx` và `create-shift-modal.tsx`.

### 7.2. Mock file không re-export types

- [ ] Types import từ `@/types/<domain>`, không từ `.mock.ts`.
- [ ] Mock file chỉ chứa fixtures (`export const MOCK_*`).

### 7.3. Mock API function có TODO

- [ ] Mọi mock function trong `api/<domain>/index.ts` phải có: `// TODO: Replace with real HTTP call once backend endpoint is available`.

### 7.4. Hardcoded data trong component có TODO marker

- [ ] Giá trị hardcode (ngày, tên, số) trong component phải có `// TODO:` hoặc đi qua mock function.
- [ ] **Ví dụ thực tế đã mắc**: `'2026-02-04 18:34'`, `'A_Minhyuk (9999)'` inline không có marker.

---

## PHASE 8 — Dead Code & Type Hygiene

> **Nguyên tắc phát hiện**: "Mọi thứ được khai báo phải được sử dụng. Mọi thứ cùng ngữ nghĩa phải có 1 source."

### 8.1. Unused exports

- [ ] Sau refactor, **tất cả** export/import/type/hook/constant trở nên thừa phải xóa trong cùng PR.
- [ ] **Ví dụ thực tế đã mắc**: `AUTH_KEYS` exported nhưng không dùng. `useDriversSummary` hook không còn ai gọi. `AdminRole`, `LoginRequest`, `ApiResponse<T>` type never referenced.

### 8.2. Duplicate types

- [ ] Không có 2 type cùng structure ở 2 nơi khác nhau.
- [ ] **Ví dụ thực tế đã mắc**: `StatCell` local type khác `StatCell` trong `dashboard.mock.ts`. `BarChartData` trùng `BarChartItem`. Import và reuse type duy nhất.

### 8.3. Dead logic

- [ ] Conditional thừa trong nhánh đã biết kết quả: `nameParts.length > 1 ? '.' : ''` bên trong `if (nameParts.length > 1)`.
- [ ] Identity function / no-op wrapper: `(x) => x`, `select: (res) => res` → xóa.
- [ ] Badge variants map cùng style: `info` và `success` cùng `'bg-emerald-500 text-white'` → misleading union.

### 8.4. Duplicate imports

- [ ] Không import cùng module ở 2 dòng khác nhau → gộp thành 1 dòng.
- [ ] **Ví dụ thực tế đã mắc**: Lines 5-6 cùng import từ `@/stores/control.store` nhưng 2 dòng riêng.

### 8.5. Duplicate action logic

- [ ] 2 action/function có implementation gần giống → extract shared helper.
- [ ] **Ví dụ thực tế đã mắc**: `authActions.login` và `authActions.restoreSession` có body giống nhau.

---

## PHASE 9 — Testing

> **Nguyên tắc phát hiện**: "Mọi logic mới = ít nhất 1 test mới."

### 9.1. Coverage cho PR này

- [ ] Liệt kê tất cả: pure function, derived selector, utility, store action **mới hoặc sửa** trong PR.
- [ ] Mỗi item trên phải có test file/test case tương ứng.
- [ ] **Ví dụ thực tế đã mắc**: Nhiều PR thêm selector, utility, store action mà không có bất kỳ test nào.

### 9.2. Test cho code path mới

- [ ] Thêm filter mới (ví dụ: filter by phone) → phải có test xác nhận path đó hoạt động.
- [ ] **Ví dụ thực tế đã mắc**: Search filter hỗ trợ phone lookup nhưng không có test cho phone.

### 9.3. Critical business logic

- [ ] Cross-midnight datetime, pagination boundary, token refresh race → phải có test.
- [ ] **Ví dụ thực tế đã mắc**: `buildShiftDatetimes` xử lý cross-midnight logic nhưng không có unit test.

### 9.4. Derived selector từ store

- [ ] Mỗi derived selector (`useSelectedDriver`, `useFilteredDrivers`, `useDriverStats`) → test happy path + edge case (empty, null, not found).
- [ ] **Ví dụ thực tế đã mắc**: `useSelectedDriver` dùng ở 2 component nhưng không có test.

---

## PHASE 10 — Comments & Documentation

> **Nguyên tắc phát hiện**: Đọc mọi comment trong file đã thay đổi. Comment sai còn tệ hơn không có comment.

### 10.1. Tất cả comment phải bằng tiếng Anh

- [ ] Grep comment tiếng Việt / tiếng Hàn / ngôn ngữ khác → sửa thành tiếng Anh.
- [ ] **Ví dụ thực tế đã mắc**: `// Gọi refresh endpoint với body { refresh_token }`, `// Màu vòng tròn: selected → primary xanh`.

### 10.2. Comment stale sau khi đổi giá trị

- [ ] Thay đổi interval/threshold/config → grep toàn bộ PR tìm comment tham chiếu giá trị cũ.
- [ ] **Ví dụ thực tế đã mắc**: Đổi refetch từ 30s → 5s nhưng comment ở `control-driver-card.tsx` vẫn ghi "every 30s refetch".

### 10.3. Typos

- [ ] `localesResourse` → `localesResource`. Kiểm tra tên biến, hàm, type, file.

---

## PHASE 11 — API & Network Safety

> **Nguyên tắc phát hiện**: Trace mọi API call → xem có guard, limit, type safety.

### 11.1. Search query phải có `enabled` guard

- [ ] Hook query tìm kiếm theo keyword phải có `enabled: !!query?.trim()` → tránh request rỗng khi mount.
- [ ] **Ví dụ thực tế đã mắc**: `useAddresses` và `usePassengers` fire query ngay khi mount với empty string.

### 11.2. List query phải có `limit`

- [ ] `useQuery`/`useInfiniteQuery` gọi API list không truyền `limit` → unbounded khi data lớn.
- [ ] **Ví dụ thực tế đã mắc**: `useVehicles` fetch tất cả vehicles không có limit.

### 11.3. `hasMore` pagination dùng `totalCount`

- [ ] `items.length === PAGE_SIZE` sai khi total là bội số PAGE_SIZE → dùng `hasMore = (page + 1) * PAGE_SIZE < totalCount`.
- [ ] **Ví dụ thực tế đã mắc**: `DriverPickerModal` dùng `drivers.length === PAGE_SIZE`.

### 11.4. Type ↔ Request body consistency

- [ ] Type DTO dùng camelCase nhưng request body cần snake_case → phải có adapter/mapping rõ ràng.
- [ ] Inline type assertion `response.data as { ... }` → không dùng, import type chính thức.
- [ ] **Ví dụ thực tế đã mắc**: `RefreshTokenRequest` type dùng `refreshToken` nhưng body gửi `refresh_token`. Token refresh interceptor dùng inline type thay vì `RefreshTokenResponse`.

### 11.5. QueryClient cần default options

- [ ] `new QueryClient()` không có defaults → `refetchOnWindowFocus: true`, `retry: 3` gây traffic không cần thiết.
- [ ] Set `retry: 1`, `refetchOnWindowFocus: false`, `staleTime` hợp lý.

---

## PHASE 12 — Architecture & File Structure

> **Nguyên tắc phát hiện**: Kiểm tra file size, import path, export barrel.

### 12.1. File ≤ 200 dòng

- [ ] File vượt 200 dòng → tách theo concern (shell, tab, logic, mock).
- [ ] **Ví dụ thực tế đã mắc**: `control-driver-modal.tsx` 343 dòng, combine modal shell + 2 tabs + mock data.

### 12.2. Switch/if-else trên cùng enum ở nhiều nơi

- [ ] 3 function dùng switch trên cùng enum (status → badge class, dot class, marker color) → gộp thành 1 lookup map `Record<Status, StyleConfig>`.
- [ ] **Ví dụ thực tế đã mắc**: `getStatusBadgeClass`, `getStatusDotClass`, `getMarkerColor` dùng 3 switch gần giống nhau.

### 12.3. Repeated JSX blocks

- [ ] ≥ 3 block JSX cùng cấu trúc → extract thành data array + `.map()`.
- [ ] **Ví dụ thực tế đã mắc**: Legend items trong `FilterBar` là 4 block hardcode.

### 12.4. `Toaster` ngoài `ErrorBoundary`

- [ ] `Toaster`/notification host phải nằm **ngoài** `ErrorBoundary` → fallback screen không mất khả năng hiển thị toast.
- [ ] **Ví dụ thực tế đã mắc**: `Toaster` nằm trong `ErrorBoundary`, fallback render → Toaster unmount.

---

## PHASE 13 — UI/UX Details

### 13.1. `new Date()` cho real-time display

- [ ] `new Date()` trong render body mà không có `setInterval` → giá trị đóng băng lúc mount.
- [ ] NOW line, clock indicator → cần timer cập nhật.
- [ ] **Ví dụ thực tế đã mắc**: NOW line trên Gantt chart tính 1 lần và không bao giờ cập nhật.

### 13.2. Hardcoded labels không khớp data

- [ ] Chart time labels hardcode `['10:00', '9:45', ...]` nhưng data có 20 points → labels sai vị trí.
- [ ] Duplicate chart labels gây confusing tooltip.
- [ ] **Ví dụ thực tế đã mắc**: `HOURLY_CHART_DATA` có `'00:00'` trùng ở index 0 và 12.

### 13.3. Hardcoded color không adapt dark mode

- [ ] `bg-white` → dùng `bg-background` hoặc `bg-card`. Hardcode hex → dùng CSS variable semantic.

### 13.4. Feature UI phải hoạt động thật

- [ ] Toggle/checkbox/dropdown có tác dụng thực → không render GUI mà logic không hoạt động.
- [ ] **Ví dụ thực tế đã mắc**: `preOccupy` toggle là local state không gọi API, không ghi store, reset khi mở lại modal.

### 13.5. Form validation logic nghiệp vụ

- [ ] `startTime === endTime` (zero-duration) phải có warning + disable submit.
- [ ] `departure === destination` → validate ở schema level bằng `.refine()`.
- [ ] `form.reset()` phải truyền explicit defaults: `form.reset(defaultValues)`.
- [ ] **Ví dụ thực tế đã mắc**: Create shift cho phép start = end time. `form.reset()` gọi không có argument.

---

## PHASE 14 — Security

### 14.1. Auth endpoint không gửi stale token

- [ ] Request interceptor phải skip Authorization header cho login/refresh endpoints.
- [ ] **Ví dụ thực tế đã mắc**: `adminLogin` gửi kèm expired Bearer token → server có thể reject trước khi đọc body.

### 14.2. Token refresh race condition

- [ ] Queued requests re-dispatch phải set `_retry` flag → tránh vòng lặp 401 vô hạn.

---

## PHASE 15 — i18n Type Safety & Setup

### 15.1. i18n setup đầy đủ

- [ ] `initReactI18next` phải có trong chain `i18n.use(...)`.
- [ ] **Ví dụ thực tế đã mắc**: Thiếu `.use(initReactI18next)` → `useTranslation` hook không hoạt động.

### 15.2. `t()` type safety

- [ ] Custom `t()` wrapper không cast `as unknown as string` → mất compile-time key validation.
- [ ] Typos trong translation key sẽ silently show key string tại runtime.

---

## Quick Reference — Top 10 lỗi recurring

| #   | Lỗi                                               | Cách phát hiện nhanh                                          |
| --- | ------------------------------------------------- | ------------------------------------------------------------- |
| 1   | Form field thu thập nhưng không gửi trong payload | So sánh danh sách `useState`/form fields vs `mutate(payload)` |
| 2   | Hardcoded UI text không qua `t()`                 | Grep string literal trong JSX                                 |
| 3   | `t()` gọi ở module level (frozen)                 | Grep `const ... = t(` ngoài function                          |
| 4   | Derived value không `useMemo`                     | Grep `.filter(`, `.map(`, `.find(` trong component body       |
| 5   | O(n×m) lookup trong vòng lặp                      | Grep `.find(` / `.filter(` bên trong `.map(` / `for`          |
| 6   | Thiếu unit test cho logic mới                     | So sánh list function mới vs list test file                   |
| 7   | Mock data import trực tiếp vào component          | Grep `MOCK_` và `.mock.ts` trong `.tsx` files                 |
| 8   | Button không có handler hoặc label sai hành vi    | Đọc từng `<Button>` → check onClick → check label             |
| 9   | Comment tiếng Việt / comment stale                | Grep comment → check ngôn ngữ + giá trị tham chiếu            |
| 10  | Modal dùng `open` prop thay vì ref pattern        | Grep `<Dialog` / `<Drawer` → check props signature            |

---

## Quy trình self-review tối giản (5 phút)

```
1. git diff --name-only main...HEAD    → liệt kê file thay đổi
2. Với mỗi .tsx:
   a. PHASE 1: Trace data flow (input → submit)
   b. PHASE 2: Grep hardcoded text
   c. PHASE 3: Grep .filter/.map/.find trong body (performance)
   d. PHASE 6: Check Dialog/Modal props
   e. PHASE 7: Grep MOCK_ imports
3. Với mỗi .ts (hook/store/util):
   a. PHASE 9: Có test tương ứng?
   b. PHASE 8: Export nào unused?
   c. PHASE 11: API call có enabled/limit?
4. Với mỗi .json (locale):
   a. Key mới có đủ trong tất cả locale?
5. Chạy pnpm run lint → fix errors
```
