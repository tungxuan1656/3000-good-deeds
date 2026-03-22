# 03. UI Primitives Spec

## 1) Mục tiêu
Chuẩn hóa toàn bộ primitive theo visual direction Stitch:
- tonal surface
- contrast dịu
- bo góc mềm
- motion 300ms

## 2) Danh sách primitive đã refactor
- `components/ui/button.tsx`
- `components/ui/input.tsx`
- `components/ui/textarea.tsx`
- `components/ui/switch.tsx`
- `components/ui/tag.tsx`
- `components/ui/empty.tsx`
- `components/ui/dialog.tsx`
- `components/ui/sheet.tsx`

## 3) Quy ước style
### Button
- `default`: nền `primary`, shadow ambient.
- `outline`: surface tonal (`surface-container-low`), border rất nhẹ.
- `secondary`: nền `secondary`.
- `ghost`: chỉ hover nền tonal.

### Input / Textarea
- Ghost-field style.
- Nền mặc định: `surface-container-high`.
- Focus: `surface-container-highest` + ring nhẹ.

### Switch
- Track dùng tonal surface.
- Checked state dùng `primary`.
- Thumb dùng `card`.

### Tag/Chip
- Active: `primary` tint.
- Inactive: `secondary` tint.

### Empty
- Dùng card tonal thay vì khung dashed.

### Dialog / Sheet
- Overlay mờ + blur nhẹ.
- Panel bo góc lớn + shadow ambient.

## 4) Shared container liên quan
- `components/shared/card-section.tsx`
- `components/shared/card-inline-section.tsx`

Đã chuyển theo no-line rule: ưu tiên layer màu thay vì divider line.
