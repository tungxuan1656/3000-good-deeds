# Color Usage Guide

Tất cả màu dùng CSS variable, tự động đổi theo dark mode (class `.dark`).

---

## Semantic Colors (shadcn/ui)

| Class                                        | Dùng khi                                  |
| -------------------------------------------- | ----------------------------------------- |
| `bg-background` / `text-foreground`          | Nền trang & text mặc định                 |
| `bg-card` / `text-card-foreground`           | Nền Card, Dialog                          |
| `bg-popover` / `text-popover-foreground`     | Dropdown, Tooltip, Popover                |
| `bg-primary` / `text-primary-foreground`     | Nút chính, badge active, link             |
| `text-primary`                               | Text nhấn mạnh, icon active               |
| `bg-secondary` / `text-secondary-foreground` | Nút phụ, tag, chip                        |
| `bg-muted` / `text-muted-foreground`         | Placeholder, hint, label phụ, nền section |
| `bg-accent` / `text-accent-foreground`       | Hover state của item list                 |
| `bg-destructive` / `text-destructive`        | Xóa, hành động hủy, lỗi nghiêm trọng      |
| `border-border`                              | Đường kẻ, viền                            |
| `border-input`                               | Viền input, textarea                      |
| `ring-ring`                                  | Focus ring                                |

---

## Status Colors

Mỗi status có 3 bậc: **base** · **subtle** (nền nhạt) · **muted** (viền/text phụ)

| Token       | Class                         | Màu (light)          | Dùng khi                         |
| ----------- | ----------------------------- | -------------------- | -------------------------------- |
| **Danger**  | `text-danger` / `bg-danger`   | đỏ `#f5222d`         | Lỗi, validation fail, xóa        |
|             | `bg-danger-subtle`            | nền hồng nhạt        | Nền badge lỗi                    |
|             | `text-danger-muted`           | hồng vừa             | Text phụ trong vùng lỗi          |
| **Warning** | `text-warning` / `bg-warning` | cam `#fa8c16`        | Cảnh báo, chờ xử lý, pending     |
|             | `bg-warning-subtle`           | nền vàng nhạt        | Nền badge warning                |
|             | `text-warning-muted`          | vàng vừa             | Text phụ trong vùng warning      |
| **Success** | `text-success` / `bg-success` | xanh lá `#2eb553`    | Thành công, hoàn thành           |
|             | `bg-success-subtle`           | nền xanh lá nhạt     | Nền badge success                |
|             | `text-success-muted`          | xanh lá vừa          | Text phụ trong vùng success      |
| **Info**    | `text-info` / `bg-info`       | xanh dương `#1890ff` | Thông tin, đang chạy, in-service |
|             | `bg-info-subtle`              | nền xanh nhạt        | Nền badge info                   |
|             | `text-info-muted`             | xanh vừa             | Text phụ trong vùng info         |

---

## Surface Colors

| Class               | Dùng khi                        |
| ------------------- | ------------------------------- |
| `bg-surface`        | Nền layer nổi (khác background) |
| `bg-surface-subtle` | Nền section, panel, table row   |
| `bg-surface-muted`  | Skeleton loader, nền disabled   |

---

## Divider Colors

| Class                   | Dùng khi             |
| ----------------------- | -------------------- |
| `border-divider-subtle` | Đường phân cách nhẹ  |
| `border-divider`        | Divider mặc định     |
| `border-divider-strong` | Divider đậm, nổi bật |

---

## Misc

| Class                      | Dùng khi                     |
| -------------------------- | ---------------------------- |
| `text-disabled-foreground` | Text của element bị disabled |
| `bg-inverse-surface`       | Tooltip dark, Snackbar       |
| `text-inverse-foreground`  | Text trên nền inverse        |

---

## Typography (Font Size)

Dự án định nghĩa thêm size `text-xss` ngoài scale mặc định của Tailwind.

| Class       | Size            | Dùng khi                                        |
| ----------- | --------------- | ----------------------------------------------- |
| `text-xss`  | 0.625rem (10px) | Label siêu nhỏ: tick header, badge code, ID phụ |
| `text-xs`   | 0.75rem (12px)  | Label phụ, placeholder, timestamp               |
| `text-sm`   | 0.875rem (14px) | Text body thông thường                          |
| `text-base` | 1rem (16px)     | Text mặc định                                   |

> **Không dùng arbitrary value** như `text-[10px]` — luôn dùng class từ scale trên.

---

## Icon convention

- Sử dụng **Lucide icon** (`lucide-react`) — format `{Name}Icon`.
- **Không trộn** emoji hoặc ký tự Unicode với Lucide trong cùng một view/component.

```tsx
// ✅ Đúng
<SearchIcon className='h-4 w-4' />
<DownloadIcon className='h-4 w-4' />

// ❌ Sai — trộn emoji với Lucide
<span>🔍</span>
<SearchIcon className='h-4 w-4' />
```

---

## Ví dụ nhanh

```tsx
// Badge trạng thái
<span className="bg-warning-subtle text-warning rounded-full px-2 py-0.5 text-xs">Waiting</span>
<span className="bg-info-subtle text-info rounded-full px-2 py-0.5 text-xs">In Service</span>
<span className="bg-danger-subtle text-danger rounded-full px-2 py-0.5 text-xs">Error</span>

// Card
<div className="bg-card border-border text-card-foreground rounded-lg border p-4">...</div>

// Text phụ
<p className="text-muted-foreground text-sm">Cập nhật lần cuối: 2m ago</p>

// Nút chính / phụ
<Button className="bg-primary text-primary-foreground">Xác nhận</Button>
<Button className="bg-secondary text-secondary-foreground">Hủy</Button>
```
