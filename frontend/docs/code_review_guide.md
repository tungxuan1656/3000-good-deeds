# Hướng dẫn Review Code

> Tài liệu này áp dụng cho mọi hình thức review: **self-review trước khi tạo PR**, code review cho PR của người khác, và review commit đơn lẻ.
>
> - **Phần I** mô tả **QUY TRÌNH** (CÁCH review có hệ thống để không bỏ sót).
> - **Phần II** là **CHECKLIST** (CÁI GÌ cần kiểm tra) — tổ chức theo dimension từ UI đến architecture.

---

## Mức độ review & nguyên tắc merge

> Mục tiêu: review nhất quán giữa các reviewer, giảm tranh luận cảm tính, và chặn lỗi user-facing trước merge.

### Chế độ review theo quy mô PR

- **Quick Review (2-5 phút)**: PR nhỏ, giới hạn ở đổi text, style nhẹ, refactor không đổi behavior.
	- Bắt buộc làm: Bước 1 + Bước 2 (Scan A/F) + section B/H/I trong checklist.
- **Full Review (bắt buộc cho mọi PR còn lại)**: có thay đổi behavior, data flow, API/store/hook, form/modal, hoặc performance.
	- Bắt buộc làm đủ Bước 1→5 và duyệt checklist đầy đủ.

### Severity model (phân loại issue)

- **Critical**: có thể gây mất dữ liệu, sai hành vi người dùng, vi phạm pattern bắt buộc, bảo mật/permission sai, crash, hoặc regression rõ ràng.
  - **Comment code không viết bằng tiếng Anh**: Vi phạm quy tắc hygiene, gây khó khăn cho review và maintain code. Mọi comment code phải viết bằng tiếng Anh, nếu phát hiện comment tiếng Việt hoặc ngôn ngữ khác, phải sửa ngay trước khi merge.
- **Major**: ảnh hưởng đáng kể tới UX, maintainability, performance, test coverage; chưa gây mất an toàn tức thời.
- **Minor**: vấn đề về style, naming, readability, tối ưu nhẹ.

### Quy tắc merge theo severity

- Còn **Critical** → **không merge**.
- Chỉ còn **Major/Minor** → merge khi có kế hoạch xử lý rõ ràng (issue link hoặc TODO cụ thể trong PR).
- Mọi comment review phải dùng format chuẩn: **Issue / Why / Suggested fix / Severity**.

### Review output tối thiểu (Definition of Done cho reviewer)

Mỗi review phải kết thúc bằng summary ngắn gồm:
1. Danh sách issue theo severity (`Critical/Major/Minor`).
2. Rủi ro còn lại được chấp nhận (nếu có) và lý do.
3. Xác nhận phạm vi đã review (flow nào, section checklist nào).

---

## Phần I: Quy trình Review

> **Phải thực hiện đủ 5 bước theo thứ tự.** Mỗi bước là gate — không được nhảy cóc.

---

### Bước 1: Đọc diff tổng thể — nắm bức tranh

```bash
git diff main...HEAD -- '*.ts' '*.tsx' '*.md'
```

1. Liệt kê tất cả files thay đổi và tóm tắt mỗi file đổi gì.
2. Ghi chú **thay đổi hành vi** (behavioral changes): đổi interval/threshold, cấu trúc dữ liệu, API response shape, logic tính toán, v.v.

**Sub-step bắt buộc — Source-of-truth mới trong PR:**

> Đây là nguyên nhân phổ biến nhất khiến lỗi lọt qua review: PR thêm docs và code cùng lúc nhưng reviewer chỉ tóm tắt từng file độc lập, không liên kết chúng với nhau.

Với **MỖI** file thuộc các loại sau được thêm hoặc sửa trong PR:

| Loại "source of truth"     | Ví dụ                                                        |
| -------------------------- | ------------------------------------------------------------ |
| Docs / pattern guide       | `docs/dialog_and_form_pattern.md`, `docs/api_conventions.md` |
| Type / interface mới       | `ShiftDetailDTO`, `VehicleAssignModalRef`                    |
| Hook thay đổi return shape | `useDriverSearch` đổi `DriverDTO[]` → `DriverListResponse`   |
| Config / constant mới      | `PAGE_SIZE`, `API_ENDPOINTS` thêm key                        |

**Action 1 — Extract rules:** Đọc toàn bộ file source-of-truth, ghi ra danh sách rule/pattern cụ thể nó định nghĩa. Ví dụ: `dialog_and_form_pattern.md` → `"modal phải dùng useImperativeHandle, không nhận open prop"`.

**Action 2 — Compliance scan:** Tìm tất cả file trong cùng PR thuộc đối tượng áp dụng (modal component, API caller, hook consumer…). Kiểm tra từng file đó có tuân thủ đúng rule vừa extract không. **Không được skip** dù file trông "đơn giản" hay "chắc nó ổn rồi".

---

### Bước 2: Đọc toàn bộ mỗi file — không chỉ diff hunk

> Các file trong cùng PR có logic liên quan — thay đổi ở file A sẽ ảnh hưởng file B, C cùng PR. Đọc full file là đủ để bao phủ phạm vi ảnh hưởng; không cần grep toàn codebase.

Với mỗi file trong diff, đọc **toàn bộ** file để kiểm tra:
- Comments/JSDoc cũ có còn đúng không? (Ví dụ: đổi interval 30s→5s nhưng file khác còn comment "every 30s".)
- Context xung quanh diff hunk có bị ảnh hưởng bởi thay đổi không?

**Sub-scans bắt buộc — thực hiện cho MỖI file `.tsx`:**

**Scan A — Interactive elements (Button, clickable):**
Liệt kê mọi `<Button>`, `<div onClick>`, `<li onClick>`. Với từng element, xác nhận **hai điều**:
1. Có handler thực sự — `onClick` rỗng `() => {}` là lỗi.
2. **Label/text có mô tả đúng hành vi của handler không?** — Button "Save as Draft" mà handler chỉ `setIsOpen(false)` là semantic mismatch. User nghĩ dữ liệu được lưu nhưng thực ra không có gì xảy ra. Phải đổi label hoặc implement đúng hành vi.

**Scan B — Derived values ngoài `useMemo`:**
Tìm mọi `const x = ...` trong body component (không trong `useMemo`/`useCallback`) mà vế phải chứa `.filter(`, `.map(`, `.find(`, `new Map(`, `new Set(`, phép tính từ props/state. Nếu dùng trong JSX hoặc truyền vào child → hỏi "render này trigger lại không cần thiết không?" → bọc `useMemo`.

**Scan C — Grep `MOCK_` trong file:**
Nếu file component/hook chứa import từ `.mock.ts` hoặc biến `MOCK_*`, đó là vi phạm — mock phải đi qua API function → hook, không import trực tiếp vào UI.

**Scan D — `new Date()` cho thời gian thực:**
Tìm mọi `new Date()` trong component. Nếu dùng để render vị trí/thời gian hiện tại (clock, "NOW" indicator) mà **không có `setInterval`** → giá trị đóng băng tại thời điểm mount.

**Scan E — Khối JSX lặp lại:**
Nếu trong JSX có ≥ 3 block cấu trúc tương đồng (cùng tag, cùng className pattern, chỉ khác text/icon/color) → extract thành data array + `.map()`.

**Scan F — Form state completeness (bắt buộc với mọi form/modal):**
Làm theo tư duy **người dùng**, không phải engineer:
1. Liệt kê tất cả `useState` thu thập input của user (state được set trong `onChange`, `onSelect`, `onConfirm` handler).
2. Tìm điểm submit — hàm gọi `mutate(payload)` / API call.
3. Kiểm tra từng state ở bước 1 có xuất hiện trong payload ở bước 2 không. State vắng mặt = dữ liệu user nhập bị bỏ đi im lặng. Bắt buộc có `// TODO: include ... once backend supports it` nếu chưa có API.

---

### Bước 3: Feature walkthrough — góc nhìn người dùng

> Bước này bắt buộc với mọi PR có thay đổi UI/UX hoặc data flow. Hai loại lỗi phổ biến nhất bị bỏ sót ở review kỹ thuật đều là lỗi behavioral — không phát hiện được khi chỉ đọc code.

Với mỗi feature/flow mới hoặc sửa đổi trong PR, hỏi:

1. **User thực hiện từng bước thế nào?** Mô tả flow theo ngôn ngữ người dùng, không phải code.
2. **Mọi action user thực hiện có kết quả gì?** Click button A → điều gì xảy ra? Chọn dropdown B → giá trị đó đi đâu?
3. **Dữ liệu user nhập có được lưu không?** Mọi field trong form có xuất hiện trong API payload không? (Liên kết Scan F.)
4. **Label/text có phản ánh đúng hành vi không?** Button nói "Lưu" mà thực ra chỉ đóng modal là misleading. (Liên kết Scan A.)
5. **Sau khi submit thành công, user thấy gì?** List có refresh không? Toast notify không? UI có reset về trạng thái ban đầu không?
6. **Error case trông như thế nào?** Nếu API lỗi, user thấy thông báo gì? Form có bị kẹt disabled không?
7. **Failure walkthrough đã được kiểm tra chưa?** Bao gồm timeout, 4xx/5xx, empty state, permission denied, network gián đoạn.

> Với mỗi failure case, reviewer phải ghi rõ: trigger bằng cách nào, UI hiển thị gì, và user có đường thoát (retry/close/back) hay không.

---

### Bước 4: Kiểm tra test coverage

- Liệt kê tất cả **hook, selector, pure function, store action mới hoặc sửa đổi** trong PR.
- Mở test file tương ứng, kiểm tra **từng item** đã có test chưa — đặc biệt derived selector.
- Với mỗi **code path mới** (ví dụ: thêm filter theo phone), kiểm tra có test case tương ứng không.
- Fixtures/mock data có cover đủ kịch bản cho logic mới không?
- Nếu thêm store mới: xem `zustand_store_pattern.md` — mọi store mới **phải có test** trong cùng PR.
- Nếu PR là **bug fix**: bắt buộc có ít nhất 1 test tái hiện bug cũ (red case) và xác nhận pass sau fix.

---

### Bước 5: Áp dụng từng section trong checklist (Phần II)

Duyệt qua từng section A–L bên dưới, đối chiếu với code đã đọc ở các bước trên.

---

## Phần II: Checklist

---

### A. UI & Visual

> Ref: [`color_guide.md`](color_guide.md)

- [ ] Màu sắc dùng CSS variable semantic, không hardcode hex/rgb. Ví dụ: `text-danger` thay vì `text-[#f5222d]`.
- [ ] Status badge dùng đúng token: `bg-danger-subtle text-danger`, `bg-warning-subtle text-warning`, `bg-success-subtle text-success`, `bg-info-subtle text-info`.
- [ ] Nền sử dụng đúng layer: `bg-background` (trang), `bg-card` (Card/Dialog), `bg-surface` (panel nổi), `bg-surface-subtle` (table row/section).
- [ ] Font size dùng class từ design system (`text-xss`, `text-xs`, `text-sm`, `text-base`) — không dùng arbitrary value `text-[10px]`.
- [ ] Icon sử dụng `lucide-react` format `{Name}Icon` — không trộn emoji hoặc ký tự Unicode với Lucide trong cùng view/component.
- [ ] Label, trục, tick của chart/visualization được sinh từ data hoặc mapping rõ ràng — không hiển thị gây hiểu sai.
- [ ] Màu sắc chart/badge bám semantic design system — không dùng variant gây nhiễu nghĩa trạng thái.
- [ ] ID động trong SVG (gradient, clipPath) đảm bảo unique và ổn định — tránh collision khi render nhiều card cùng lúc.

---

### B. UX & Tương tác người dùng

> Ref: [`dialog_and_form_pattern.md`](dialog_and_form_pattern.md), [`form-pattern.md`](form-pattern.md)

**Button & Interactive elements:**
- [ ] **Mọi `<Button>` phải có `onClick` handler** — button không có `onClick` hoặc `onClick` rỗng `() => {}` là lỗi. Nếu chưa implement, bắt buộc có `// TODO:` nêu rõ action/endpoint sẽ gọi.
- [ ] **Label button phải phản ánh đúng hành vi** — button nói "Save as Draft" mà thực ra chỉ đóng modal phải được đổi thành "Cancel" (hoặc implement đúng hành vi). Label gây nhầm lẫn về tác dụng là user-facing bug.

**Modal & Dialog:**
- [ ] **Mọi Dialog/Drawer/Sheet phải dùng ref pattern** theo `dialog_and_form_pattern.md` — component nhận `ref?: Ref<ModalRef>` và expose `open()` qua `useImperativeHandle`. Nghiêm cấm nhận `open: boolean` / `onOpenChange` từ props bên ngoài.
- [ ] Kiểm tra mọi modal mới trong PR: props type có chứa `open?:` hoặc `onOpenChange?:` không → là vi phạm.
- [ ] `DialogClose asChild` cho nút Cancel — không `onClick={() => setIsOpen(false)}` thủ công.
- [ ] Component Dialog không `return null` trước render wrapper — làm unmount, bỏ qua animation đóng. Fallback phải nằm bên trong `<DialogContent>`.
- [ ] Kiểm tra trường hợp data của modal biến mất khi modal đang mở (refetch định kỳ xóa item đang xem) — hiển thị fallback hợp lý thay vì unmount đột ngột.

**Form & Data integrity:**
- [ ] **Mọi field UI người dùng tương tác (select, input, checkbox) phải được đưa vào payload submit** — kiểm tra từng `useState` thu thập input, xác nhận giá trị đó xuất hiện trong `mutate(payload)` / API call. Nếu backend chưa hỗ trợ, bắt buộc có comment `// TODO: include <field> in payload once <endpoint> supports it`.
- [ ] **Optimistic update phải có chiến lược persist rõ ràng** — state React-local không phải persistence. Nếu optimistic update chưa gọi API, bắt buộc có comment `// TODO: call PATCH /... to persist` ngay tại chỗ update state, kèm consequence nếu user reload (data sẽ mất).
- [ ] Nút reset form phải gọi `form.reset(defaultValues)` tường minh — không gọi `form.reset()` trống để tránh lệch khi `defaultValues` đổi theo runtime/context.
- [ ] Form dùng `FieldGroup > Field > FieldLabel / FieldLegend` — không tự custom bằng `div` + `h3`. `FieldError` cho validation message.
- [ ] `FieldLabel` cho 1 control đơn (liên kết qua `htmlFor`). `FieldLegend` chỉ khi field là nhóm nhiều controls ở nhiều dòng.
- [ ] Form validate các trường hợp không hợp lệ về logic nghiệp vụ: `startTime === endTime` (zero-duration), `startDate > endDate` (range inverted), `quantity = 0`. Hiển thị lỗi bằng i18n key, disable nút submit khi invalid.

**Pagination:**
- [ ] **`hasMore` dùng `totalCount`, không dùng `length` heuristic** — `items.length === PAGE_SIZE` sai khi total là bội số của PAGE_SIZE. Bắt buộc dùng `hasMore = (page + 1) * PAGE_SIZE < totalCount`. Hook phải expose `totalCount` trong return.

**Feedback sau submit:**
- [ ] Sau submit thành công, UI refresh data tương ứng — mutation có `invalidateQueries` đúng scope.
- [ ] Trạng thái loading/disabled rõ ràng trong khi submit đang chạy.
- [ ] Error từ API được map về `form.setError` hoặc hiển thị toast rõ ràng.
- [ ] Mọi view render cùng tập data ở dạng khác nhau (list, map, chart) phải dùng cùng **một source đã lọc** — tránh danh sách hiển thị driver đã lọc nhưng bản đồ vẫn hiển thị tất cả.

**Flow completeness (walkthrough):**
- [ ] Mỗi flow quan trọng có mô tả ngắn cả happy path và failure path (timeout, 4xx/5xx, empty state, permission denied).
- [ ] Failure path luôn có hướng xử lý cho user: retry, quay lại màn trước, hoặc thông báo liên hệ hỗ trợ.

---

### C. API & Data Integrity

> Ref: [`api_react_query_pattern.md`](api_react_query_pattern.md), [`type_naming_pattern.md`](type_naming_pattern.md)

**Cấu trúc & Pattern:**
- [ ] Mọi endpoint khai báo ở `API_ENDPOINTS` trong `api/endpoints.ts`.
- [ ] UI chỉ gọi hook — không import trực tiếp từ `api/*`.
- [ ] Hook query luôn có `queryKey` từ `*_KEYS`. Mutation thành công phải `invalidateQueries` đúng scope.
- [ ] Hook search/query theo từ khóa phải có `enabled` guard (ví dụ `enabled: !!query?.trim()`) để tránh request rỗng khi mount.
- [ ] **Không dùng identity select** — `select: (res) => res` hoặc `select: (data) => data` không transform gì, xóa hoàn toàn.
- [ ] Trước khi thêm query/hook mới: kiểm tra data có thể derive từ store hoặc query đang có sẵn không — tránh gọi API song song cho dữ liệu có thể tính được.

**Mock pattern:**
- [ ] Mock data tách riêng vào `api/<domain>.mock.ts` — không nhúng inline vào component hoặc hook.
- [ ] File `.mock.ts` chỉ chứa fixtures (`export const MOCK_*`) — không re-export type từ `@/types/`.
- [ ] Mock function trong `api/<domain>/index.ts` có comment `// TODO: Replace with real HTTP call once backend endpoint is available`.
- [ ] **Component và hook không được import trực tiếp từ `.mock.ts`** — mock chỉ nằm trong `api/<domain>/index.ts`.

**Type integrity:**
- [ ] Type DTO có hậu tố `DTO`, request có hậu tố `Request`, response có hậu tố `Response`.
- [ ] Không định nghĩa trùng type cùng ngữ nghĩa ở nhiều nơi — ưu tiên nguồn type dùng chung duy nhất.
- [ ] Naming giữa type và payload thực tế nhất quán với API contract. Khi khác convention client/server, có adapter/mapping rõ ràng.
- [ ] Union/variant/state machine phản ánh đúng hành vi runtime — không để nhánh thừa hoặc mapping nhập nhằng.

**Giới hạn query:**
- [ ] **Query list phải có `limit`** — `useQuery`/`useInfiniteQuery` gọi API list không truyền `limit` có nguy cơ unbounded khi fleet lớn. Đặt `limit` mặc định hợp lý (100 cho danh sách phụ trợ, `PAGE_SIZE` cho danh sách phân trang).

---

### D. Logic code & Edge Cases

**Nhánh điều kiện:**
- [ ] Tất cả nhánh (filter/guard/transform) bao phủ đủ case hợp lệ, case rỗng, case lỗi và fallback.
- [ ] Không duplicate logic nghiệp vụ — đoạn xử lý lặp lại phải được tách helper/service dùng chung.
- [ ] Tránh type assertion tạm thời khi đã có type chính thức.
- [ ] Mọi nhánh bỏ qua xử lý đặc biệt có comment nêu rõ lý do.

**Dead logic — kiểm tra từng trường hợp:**
- [ ] Không lookup (`find`, `filter`, `includes`) nhiều lần trên cùng tập data — lưu kết quả vào biến trung gian, không dùng non-null assertion (`!`) khi chưa kiểm tra sự tồn tại.
- [ ] Không lặp lại điều kiện đã biết là `true` bên trong nhánh của nó — biểu thức trong `if (cond)` không được chứa lại `cond` trong ternary/logical.
- [ ] Không có ternary thừa trong nhánh đã bao hàm điều kiện — `nameParts.length > 1 ? '.' : ''` bên trong `if (nameParts.length > 1)` luôn trả về `'.'`.
- [ ] Không có boolean expression luôn đúng hoặc luôn sai theo ngữ cảnh — kiểm tra lại mọi `&&`, `||`, `??` trong guard.
- [ ] Không có nhánh `else`/`default` không bao giờ được đến.
- [ ] Biến trung gian chỉ dùng đúng mục đích — không khai báo biến chỉ để tái diễn giá trị đã có; không để biến được gán nhưng kết quả gán không được đọc.

**State lifecycle:**
- [ ] Cờ lifecycle quan trọng có chiến lược khởi tạo và rehydrate rõ ràng — tránh kẹt UI ở trạng thái chờ vô hạn.
- [ ] Khi persist state, chỉ loại trừ field có chủ đích; không loại bỏ nhầm state cần cho guard/permission/boot flow.
- [ ] Luồng retry/refresh/re-auth phải idempotent theo request, có cờ chống lặp và chống vòng lặp vô hạn.
- [ ] Logic queue/concurrency mô tả rõ success/fail/cancel/logout và luôn cleanup trạng thái toàn cục.
- [ ] Bridge pattern (React Query → Zustand, API → store) có comment giải thích: (a) ai là source of truth, (b) độ trễ một frame nếu có, (c) các selector phụ thuộc vào store đó.

---

### E. Re-render & Performance

> Ref: [`zustand_store_pattern.md`](zustand_store_pattern.md)

**Memoization:**
- [ ] Giá trị dẫn xuất tốn chi phí (object/array/computation) phải được `useMemo` ở nơi phù hợp.
- [ ] **`Date` object dùng làm `useMemo` deps phải được memoize** — `new Date(...)` tạo object mới mỗi render khiến `useMemo` luôn tái tính. Bọc trong `useMemo` với deps là primitive (timestamp, string). Ví dụ: `const timelineStart = useMemo(() => startOfDay(from), [from])`.
- [ ] `useMemo` với `deps: []` chỉ hợp lệ khi dữ liệu là hằng số module-scope — nếu bên trong đọc từ hook/prop/store, deps phải bao gồm giá trị đó.

**Component isolation:**
- [ ] **Timer-driven state (`setInterval` + `useState`) phải nằm trong component nhỏ nhất có thể** — timer gây re-render mọi component trong cùng render tree mỗi tick. Nếu chỉ một phần nhỏ UI cần cập nhật (ví dụ: "NOW" indicator), extract state đó vào sub-component riêng.
- [ ] `React.memo` bọc component nhận prop là object/array từ store phải kèm custom comparator nếu store thay thế toàn bộ array mỗi lần fetch — không dựa vào so sánh reference mặc định.
- [ ] Selector dùng chung ở nhiều component (`drivers.find()` lấy driver đang chọn) phải được tách thành hook memoize tập trung trong store — không để mỗi component tự thực hiện O(n) lookup trùng nhau.

**Complexity:**
- [ ] Không lặp nhiều pass trên cùng tập data khi có thể gộp trong một pass rõ ràng.
- [ ] Lookup (`find`, `includes`, `some`) bên trong vòng lặp phải được thay bằng precomputed lookup map (`Record`/`Map`/`Set`) tạo trước vòng lặp — tránh O(n×m).
- [ ] **Pattern O(n×m) trong render danh sách**: nếu component cha `.map()` qua N items và mỗi item tự `.filter()`/`.find()` bên trong → phải pre-group bằng `Map` trong `useMemo` ở cha và chỉ pass slice đã lọc xuống con.
- [ ] Khi thay đổi tần suất polling/refetch, đánh giá lại re-render impact trên tất cả component consume data đó.
- [ ] PR có thay đổi polling/interval/list lớn/map/chart phải có ghi chú đo lường trước/sau (DevTools profiler hoặc số liệu tương đương).

---

### F. Architecture & Directory Structure

> Ref: [`project_folder_structure.md`](project_folder_structure.md), [`component_structure_pattern.md`](component_structure_pattern.md)

**Component:**
- [ ] Page dùng `const XPage = () => {}` + `export default XPage`.
- [ ] Component con dùng `export const X = () => {}`.
- [ ] Folder component có `index.ts` chỉ export public components. Internal sub-components **không** có trong `index.ts`.
- [ ] File/component dưới 200 dòng. Nếu vượt, tách file theo concern rõ ràng (shell, tab, logic, mock data…).
- [ ] Mỗi component/hook chỉ chịu trách nhiệm một việc.

**Directory:**
- [ ] `lib` chỉ chứa cross-feature reusable code dùng được từ 2 feature trở lên (`constants`, `i18n`, `storages`, `utils`).
- [ ] Store đặt ở `stores/<feature>.store.ts` — không đặt trong `lib/`, không dùng folder con.
- [ ] `hooks` tách `shared/` và `<feature>/`.
- [ ] Sử dụng alias `@/...` nhất quán, không relative path dài nhiều cấp.

**Store (Zustand):**
- [ ] Store có `State` + `initialState`, `actions` đầy đủ (`set`, `reset`). `reset` action là **bắt buộc**.
- [ ] Export `useXStore = createSelectors(_useXStore)`, tên `_useXStore`/`useXStore`/`xActions`.
- [ ] `persist` luôn có `partialize` — chỉ persist field thật sự cần. Không persist cờ tạm (`loading`, `error`, `isSessionChecked`).

**Complexity & structure:**
- [ ] Không có ≥ 3 khối JSX tương đồng (cùng cấu trúc tag, chỉ khác text/color/icon) — extract thành `const ITEMS = [...]` và render bằng `.map()`.
- [ ] `switch`/`if-else` xử lý cùng enum/union thường xuyên thêm case → gộp thành lookup map `Record<EnumKey, Value>`.

---

### G. Testing

> Ref: [`zustand_store_pattern.md`](zustand_store_pattern.md)

- [ ] **Mọi pure function, derived selector, utility, store action mới trong PR phải có unit test trong cùng PR** — không giới hạn ở "logic rủi ro cao". Ví dụ bắt buộc: filter selector, label getter, badge/class mapping, store mutation.
- [ ] Mỗi **code path mới** (thêm filter theo phone, thêm search theo name) phải có ít nhất một test case xác nhận — không chỉ test path cũ với data mới.
- [ ] Test bao phủ: happy path, edge case (empty array, null, unknown enum value), và side effect của store action.
- [ ] Store mới phải có `<domain>.store.test.ts` gồm: initial state, mọi action (happy path + edge case), derived selector.
- [ ] Luồng có concurrency/queue/retry cần test tình huống đồng thời — không race condition, không gọi lặp dư thừa.
- [ ] Test xác nhận promise/task được resolve/reject đầy đủ, không để pending vô hạn.
- [ ] Không merge thay đổi logic nền tảng khi thiếu kiểm thử tối thiểu hoặc chưa có quyết định chấp nhận rủi ro kỹ thuật có ghi nhận.
- [ ] Với bugfix, bắt buộc có regression test tái hiện lỗi trước khi sửa.

---

### H. Internationalization (i18n)

> Ref: [`i18n_label_pattern.md`](i18n_label_pattern.md)

- [ ] **Không hardcode text UI trong component** — label/button/placeholder/message/error đều qua `t()`.
- [ ] Validation/error message của form dùng i18n key — không gắn chuỗi trực tiếp trong Zod schema.
- [ ] `t()` có thể được sử dụng ở module level, tuy nhiên phải có comment giải thích vì khi đổi ngôn ngữ thì web đã reload (bằng tiếng Anh).
- [ ] Mọi key i18n có cấu trúc lồng nhau rõ ngữ cảnh (`x.y.z`).
- [ ] Mọi key mới được thêm đồng bộ vào **tất cả** locale files (`vi.json`, `en.json`, …). Không merge key ở một locale mà bỏ trống locale kia.
- [ ] Chuỗi có số lượng, đơn vị, định dạng thời gian dùng interpolation — không nối chuỗi thủ công (`/ ${count} Total` → `t('key', { count })`).
- [ ] `t()` ở default parameter hoặc module scope có comment giải thích lifecycle và tính an toàn.
- [ ] Hàm `t()` giữ type safety cho i18n key — không dùng wrapper làm mất kiểm tra compile-time.
- [ ] Nếu bản dịch chưa có, dùng tạm tiếng Anh và thêm comment `// TODO: translate` trong file JSON.
- [ ] Kiểm tra overflow/truncation khi chuỗi dài hơn (đặc biệt `en` so với `vi`) ở button, table header, dialog title.

---

### I. Naming & Code Hygiene

> Ref: [`naming_and_conventions_pattern.md`](naming_and_conventions_pattern.md)

- [ ] Không có biến, hằng, hàm, type, import được khai báo nhưng không sử dụng. Sau refactor, mọi export/hook/query key trở nên thừa phải xóa ngay trong cùng PR.
- [ ] Khai báo trước cho tính năng sau phải có comment `// planned: <mô tả tính năng>`.
- [ ] Hardcode tạm thời có comment `// TODO: replace with real data from <source> once <condition>`.
- [ ] **Mọi comment phải viết bằng tiếng Anh**.
- [ ] Khi thay đổi giá trị/hành vi (interval, threshold, config, tên field), cập nhật ngay comments/JSDoc trong mọi file cùng PR có tham chiếu giá trị cũ — comment stale gây misleading nghiêm trọng hơn không có comment.
- [ ] Không có import trùng lặp từ cùng module — gộp thành một dòng `import` duy nhất.
- [ ] Thứ tự import: third-party trước → dòng trắng → internal `@/` alias. Không trộn lẫn hai nhóm.
- [ ] File dùng `kebab-case`. Mock file: `<feature>.mock.ts` cùng folder với `api/<feature>.ts`.
- [ ] Không có lỗi chính tả trong tên biến, hàm, type, file.
- [ ] Không giữ lại identity function / no-op wrapper (`(x) => x`, `select: (res) => res`) — xóa hoàn toàn thay vì để passthrough.

---

### J. Documentation Compliance

> Ref: [`copilot-instructions.md`](../.github/copilot-instructions.md) và tất cả tài liệu trong `docs/`

- [ ] Với mỗi docs pattern trong `docs/` liên quan đến feature đang review: tất cả code trong PR tuân thủ đúng pattern đó.
- [ ] Tham chiếu nhanh: modal/dialog → `dialog_and_form_pattern.md`; API/hook → `api_react_query_pattern.md`; store → `zustand_store_pattern.md`; form → `form-pattern.md`; type → `type_naming_pattern.md`; color/icon → `color_guide.md`; i18n → `i18n_label_pattern.md`; naming → `naming_and_conventions_pattern.md`; structure → `project_folder_structure.md` + `component_structure_pattern.md`.
- [ ] Feature UI (checkbox, dropdown, toggle, switch) có tác dụng thực sự — không render GUI mà logic không hoạt động. Placeholder chờ API bắt buộc có comment `// TODO: connect to <API_ENDPOINTS.x.y> once available`.
- [ ] Không có nhiều nhiều switch/if-else xử lý cùng một enum mà mỗi switch ở file khác nhau không đồng bộ — gộp thành lookup map một chỗ.

---

### K. Accessibility (A11y)

- [ ] Tất cả interactive element có thể dùng bằng keyboard (`Tab`, `Enter`, `Space`, `Esc`) với thứ tự focus hợp lý.
- [ ] Dialog/Drawer có focus trap đúng, mở vào phần tử hợp lý và trả focus về trigger khi đóng.
- [ ] Control không có text hiển thị phải có `aria-label`/`aria-labelledby` rõ nghĩa.
- [ ] Trạng thái disabled/loading/error được convey bằng cả visual lẫn semantic attribute (`aria-busy`, `aria-invalid`, v.v. khi phù hợp).
- [ ] Contrast của text/icon/border ở trạng thái thường + hover + disabled đủ đọc theo chuẩn truy cập.

---

### L. Security, Privacy & Observability

- [ ] Không log dữ liệu nhạy cảm (PII/token/secret) trong console, toast, error boundary hoặc analytics payload.
- [ ] Action nhạy cảm (approve/reject/delete/assign/permission change) có guard rõ ràng theo role/permission.
- [ ] Input từ user được validate/sanitize trước khi dùng cho query, URL params, hoặc render nội dung.
- [ ] Error message hiển thị cho user không để lộ internal detail (stack trace, raw SQL/API internals).
- [ ] `Toaster`/notification host phải nằm ngoài `ErrorBoundary` cấp app để fallback screen không làm mất khả năng hiển thị toast lỗi.
- [ ] Với flow quan trọng, có event/log tối thiểu để trace: submit success/fail, retry, và nguyên nhân fail chính.
