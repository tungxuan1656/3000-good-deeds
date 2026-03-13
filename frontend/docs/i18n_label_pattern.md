# I18n Label Pattern

## Mục tiêu

Trong project, toàn bộ label/text hiển thị cho người dùng **phải dùng i18n** để hỗ trợ đa ngôn ngữ.

- Không hardcode text trong component/page.
- Chuỗi ngôn ngữ được quản lý bằng file `json`.
- Key ngôn ngữ dùng cấu trúc lồng nhau để truy cập theo dạng `x.y.z`.

## Cấu trúc thư mục

```txt
src/
  lib/
    i18n/
      i18n.ts
      vi.json
      en.json
```

> `i18n.ts` và các file ngôn ngữ bắt buộc nằm trong `src/lib/i18n`.

## Quy tắc đặt key

- Key phải semantic theo ngữ cảnh màn hình/chức năng.
- Dùng key lồng nhau, ví dụ:
  - `common.actions.save`
  - `auth.login.title`
  - `auth.login.form.email.label`

Ví dụ `vi.json`:

```json
{
  "common": {
    "actions": {
      "save": "Lưu",
      "cancel": "Hủy"
    }
  },
  "auth": {
    "login": {
      "title": "Đăng nhập",
      "form": {
        "email": {
          "label": "Email"
        }
      }
    }
  }
}
```

## Quy tắc sử dụng trong code

- ✅ Đúng: dùng hàm dịch từ i18n, ví dụ `t('auth.login.title')`.
- ❌ Sai: hardcode trực tiếp như `"Đăng nhập"`, `"Save"`, `"Email"` trong JSX.
- ✅ Form validation/error message phải dùng i18n key — không gắn chuỗi trực tiếp trong schema Zod.

Ví dụ:

```tsx
<h1>{t('auth.login.title')}</h1>
<label>{t('auth.login.form.email.label')}</label>
<Button>{t('common.actions.save')}</Button>
```

## Gọi `t()` ngoài render context (module scope)

Nếu `t()` được gọi **ngoài** render function (ví dụ: default parameter, constant ở module scope), **bắt buộc phải có comment** giải thích lifecycle và tính an toàn:

```tsx
// ✅ Có comment giải thích
// NOTE: t() is called in default parameter position — evaluated on each call,
// NOT at module-load time. Safe because locale is resolved lazily inside t().
export const MyComponent = ({
  label = t('common.actions.save'),
}: Props) => { ... }
```

```ts
// ❌ Không được dùng t() ở module-level constant nếu locale có thể chưa load:
const LABEL = t('common.actions.save') // Bad — stale nếu locale chưa init
```

## Locale completeness (bắt buộc)

- Mọi key mới phải được thêm **đồng bộ** vào tất cả locale files (`en.json`, `kr.json`, v.v.).
- Không merge key ở một locale mà bỏ trống locale kia — gây fallback âm thầm, khó debug.
- Nếu bản dịch chưa có, dùng tạm giá trị tiếng Anh và thêm comment `// TODO: translate` trong file JSON.

## Interpolation cho số, đơn vị, thời gian

Chuỗi có số lượng, đơn vị hoặc giá trị động phải dùng interpolation — không nối chuỗi thủ công:

```json
// en.json
{
  "shifts": {
    "stats": {
      "totalDrivers": "/ {{count}} Total"
    }
  }
}
```

```tsx
// ✅ Đúng
t('shifts.stats.totalDrivers', { count: totalDrivers })

// ❌ Sai
`/ ${totalDrivers} Total`
```

## Checklist khi review

- [ ] Không còn hardcoded user-facing text trong component/page.
- [ ] Validation/error message của form dùng i18n key.
- [ ] Mọi label đều có key i18n tương ứng.
- [ ] Key có cấu trúc lồng nhau rõ ngữ cảnh (`x.y.z`).
- [ ] Tất cả locale files (`en.json`, `kr.json`) đồng bộ key.
- [ ] `t()` ở default param/module scope có comment giải thích lifecycle.
- [ ] Chuỗi có giá trị động dùng interpolation, không nối chuỗi thủ công.
- [ ] `i18n.ts` đặt đúng tại `src/lib/i18n/i18n.ts`.
