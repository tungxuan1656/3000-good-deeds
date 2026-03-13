# Large project folder structure (bản chốt theo đề xuất mới)

## 1) Cấu trúc chuẩn

```text
src/
  app.tsx
  main.tsx

  api/
    client.ts
    endpoints.ts
    feature*/
    ...

  assets/

  hooks/
    shared/
    feature*/
    ...

  components/
    ui/
    shared/
    feature*/
    ...

  stores/
    auth.store.ts       # feature*.store.ts (đặt trực tiếp, không dùng folder con)
    control.store.ts
    types.ts
    ...

  lib/
    constants/
    forms/
    i18n/
    storages/
    utils/

  pages/
    feature*/
    ...

  styles/
  types/
```

> `feature*` (đổi theo tên feature thực tế).

## 2) Ranh giới chặt cho `lib`

`lib` chỉ chứa **cross-feature reusable code** (dùng được cho từ 2 feature trở lên).

- `lib/constants`: app constants, config constants.
- `lib/forms/form-schemas.ts`: single source of truth cho toàn bộ Zod form schema của app.
- `lib/i18n`: setup đa ngôn ngữ.
- `lib/storages`: wrapper localStorage/sessionStorage/indexedDB.
- `lib/utils`: hàm thuần dùng chung toàn app.

Không đặt trong `lib`:
- `hooks` (đặt ở `src/hooks/shared` hoặc `src/hooks/feature*`),
- `stores` (đặt ở `src/stores/feature*.store.ts`),
- logic riêng 1 feature.

Không để trong `lib`:
- component UI của 1 feature,
- API handler riêng 1 feature.

## 3) Quy tắc đặt file theo tầng

- `api/<feature>`: chỉ HTTP calls + mapping endpoint.
- `hooks/shared`: hook dùng chung đa feature.
- `hooks/<feature>`: hook đặc thù feature (bao gồm hook react-query của feature).
- `stores/<feature>.store.ts`: zustand store theo feature, đặt **trực tiếp** trong `stores/`, không dùng folder con.
- `lib/forms/form-schemas.ts`: **mọi form schema phải nằm tại đây** (không tạo `*.schema.ts` trong feature folder).
- `components/<feature>`: component thuộc feature đó.
- `pages/<feature>`: page của feature.
- `types`: type dùng chung hoặc API contracts.

## 4) Rule import

- Feature code ưu tiên import trong chính feature trước.
- Chỉ đẩy lên `lib` khi đã chứng minh reusable.
- Hook dùng chung import từ `hooks/shared`; hook riêng import từ `hooks/<feature>`.
- Component con export qua `index.ts` trong từng folder để import gọn.

## 5) Checklist áp dụng

- [ ] Có `api/client.ts`, `api/endpoints.ts` dùng chung
- [ ] Mỗi feature có nhánh riêng trong `api/hooks/components/stores/pages`
- [ ] `hooks` tách `shared` và `feature*/`
- [ ] `stores` đặt ngoài `lib`, file phẳng theo `stores/feature*.store.ts`
- [ ] `lib` chỉ giữ `constants`, `forms`, `i18n`, `storages`, `utils`
- [ ] Tất cả schema nằm trong `lib/forms/form-schemas.ts`; feature không tạo file `*.schema.ts` riêng
- [ ] Không biến `lib` thành nơi chứa mọi thứ
- [ ] Dùng alias import thống nhất (`@/...`)
