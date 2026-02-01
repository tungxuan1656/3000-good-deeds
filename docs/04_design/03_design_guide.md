# 03. DESIGN GUIDE

**Calm Editorial · Human-First UI**
*for ReactJS + shadcn/ui + TailwindCSS*

---

## 0️⃣ TRIẾT LÝ CỐT LÕI (NON-NEGOTIABLE)

> **UI không được gây căng thẳng.**
> **Nội dung dẫn dắt trải nghiệm, không phải chức năng.**

### Nguyên tắc:
*   **Mobile-first:** Ưu tiên trải nghiệm trên điện thoại.
*   **Single-column:** Bố cục một cột đơn giản, tập trung.
*   **Flow-based:** Điều hướng theo luồng, không nhồi nhét.
*   **Breathable:** Ít lựa chọn, nhiều khoảng thở (whitespace).
*   **No Dashboard Mindset:** Tránh cảm giác quản trị hệ thống phức tạp.

---

## 1️⃣ TECH STACK & CONVENTIONS

*   **Framework:** ReactJS (Smart/Dumb components pattern).
*   **UI Kit:** [shadcn/ui](https://ui.shadcn.com/) (Headless + Tailwind).
*   **Styling:** TailwindCSS.
*   **Icons:** Lucide React.
*   **State UI:** Controlled components + Minimal animation.
*   **Mode:** Light mode default (Dark mode optional/future).

---

## 2️⃣ COLOR SYSTEM (TAILWIND TOKENS)

### 🎨 Base Palette (BẮT BUỘC)

Sử dụng cấu hình này trong `tailwind.config.ts/js`:

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        // Backgrounds
        background: "#F6F3EE",      // Warm Off-white (Giấy cũ)
        surface: "rgba(255,255,255,0.9)", // White translucent

        // Brand Identity
        primary: "#7A9B86",         // Sage Green (Thân thiện)
        secondary: "#BFD4C3",       // Soft Mint (Bổ trợ)
        highlight: "#E6C77A",       // Warm Gold (Điểm nhấn)

        // Text Hierarchy
        text: {
          primary: "#2E2E2E",       // Charcoal (Không dùng #000)
          secondary: "#7A7A7A",     // Grey (Thông tin phụ)
          muted: "#A0A0A0",         // Light Grey (Placeholder)
        },

        // Semantic Colors (Categories)
        body: "#F2B36F",            // Thân (Warm Orange)
        speech: "#8FBAD9",          // Khẩu (Calm Blue)
        mind: "#B9A7E3",            // Ý (Soft Purple)
        
        // Utilities
        danger: "#E57373",          // Soft Red
      }
    }
  }
}
export default config;
```

### ❌ Không dùng:
*   `Pure Black (#000000)`: Quá gắt cho mắt.
*   `Pure White (#FFFFFF)` làm nền chính: Gây mỏi mắt (Eye strain).
*   Neon colors hoặc Gradients quá mạnh.

---

## 3️⃣ TYPOGRAPHY RULES

### Font Family
*   **Primary:** `Inter`, `Manrope`, hoặc `SF Pro` (System Font).
*   **Style:** Sans-serif, hiện đại, tròn trịa.
*   **Không dùng:** Serif (có chân), Decorative font (rối mắt).

### Scale (Tailwind mapping)
| Role           | Class                             | Notes                  |
| :------------- | :-------------------------------- | :--------------------- |
| **Heading XL** | `text-2xl` / `text-3xl`           | Tiêu đề màn hình chính |
| **Heading**    | `text-xl` / `font-semibold`       | Tiêu đề section        |
| **Body**       | `text-base` / `leading-relaxed`   | Nội dung chính         |
| **Caption**    | `text-sm` / `text-text-secondary` | Chú thích              |
| **Tiny**       | `text-xs` / `text-text-muted`     | Label nhỏ              |

### Rules
*   **Heading:** Ít nhưng rõ ràng.
*   **Uppercase:** Hạn chế tối đa (chỉ dùng cho Label ngắn).
*   **Weight:** Không dùng quá 2 cấp Bold trong 1 màn hình.
*   **Line-height:** Luôn dùng `leading-relaxed` cho Body text để dễ đọc.

---

## 4️⃣ LAYOUT & SPACING

### Layout Structure
*   **Single Column:** Mọi thứ xếp dọc.
*   **Constraint:** `max-w-md` (448px) trên Desktop để mô phỏng Mobile view.
*   **Alignment:** Center content (`mx-auto`).

### Spacing System
*   **Section Gap:** `gap-6` hoặc `gap-8` (24px - 32px).
*   **Card Padding:** `p-4` hoặc `p-5` (16px - 20px).
*   **Text Spacing:** `gap-2` hoặc `gap-3` (8px - 12px).

👉 **Quy tắc vàng:** Nếu phân vân, hãy chọn khoảng cách **rộng hơn**.

---

## 5️⃣ SURFACE & CARD DESIGN

### Standard Card
```tsx
<div className="rounded-2xl bg-surface p-4 shadow-sm border border-black/5">
  {children}
</div>
```

### Rules
*   **Corner Radius:** `rounded-2xl` (Mềm mại).
*   **Border:** `border-none` hoặc rất nhạt `border-black/5`.
*   **Shadow:** `shadow-sm` hoặc không dùng (Flat design).

---

## 6️⃣ BUTTONS (SHADCN OVERRIDE)

### Primary CTA (Hành động chính)
```tsx
<Button className="w-full bg-primary text-white rounded-full h-12 text-base font-medium hover:bg-primary/90 transition-all">
  Ghi nhận ngay
</Button>
```

### Secondary CTA (Hành động phụ)
```tsx
<Button variant="ghost" className="text-text-secondary hover:text-text-primary hover:bg-transparent">
  Để sau
</Button>
```

### Rules
*   **Hierarchy:** Mỗi màn hình chỉ có **1 nút Primary**.
*   **Placement:** Không đặt 2 nút Primary cạnh nhau.
*   **Destructive:** Chỉ dùng màu đỏ cho "Danger Zone" (Xoá).

---

## 7️⃣ NAVIGATION (CỰC KỲ QUAN TRỌNG)

### ❌ Không dùng:
*   Bottom Tab Bar (Gây xao nhãng).
*   Mega Menu.
*   Breadcrumbs phức tạp.

### ✅ Đúng chuẩn:
*   **Hamburger Menu (Top-left):** Truy cập tính năng phụ (Profile, Settings).
*   **Avatar Action (Top-right):** Shortcut.
*   **Drawer Navigation:** Menu trượt từ trái sang (`Sheet` component từ shadcn).

### Menu Items Order:
1.  Trang chủ (Home)
2.  Hành trình (Timeline)
3.  Thống kê (Stats)
4.  Mục tiêu (Goals)
5.  Nội tâm (Inner Hub)
6.  Cài đặt (Settings)
7.  Đăng xuất (Log out)

---

## 8️⃣ MODAL & BOTTOM SHEET

Sử dụng `Drawer` hoặc `Sheet` (Bottom position) thay vì Modal giữa màn hình.

### Scenarios:
*   Check-in việc thiện.
*   Quick actions.
*   Wizard flow (Step-by-step).

### Animation Specs:
*   **Enter:** `translate-y-full` -> `translate-y-0` + Fade in.
*   **Exit:** Fade out.
*   **Duration:** `200ms` - `300ms`.
*   **Easing:** `ease-out`.

### ❌ Tránh:
*   Hiệu ứng nảy (Bounce).
*   Step indicator quá cứng nhắc (dạng Form wizard doanh nghiệp).

---

## 9️⃣ ANIMATION & MOTION

*   **Allowed:** Fade In, Slide Up, Opacity Change.
*   **Forbidden:** Elastic bounce, Shake, Flashing interactions.
*   **Confetti:** Chỉ dùng rất tiết chế cho Thành tựu lớn (Big Achievements).

---

## 🔟 MICROCOPY (NGÔN NGỮ)

*   **Tone:** Nhẹ nhàng, Gợi mở (Inviting), Không ra lệnh (Imperative).
*   **Ví dụ:**
    *   ✅ "Bạn muốn ghi lại điều gì?"
    *   ❌ "Nhập nội dung bắt buộc"
    *   ✅ "Hành trình vạn dặm bắt đầu từ một bước chân" (Empty state)

---

## 1️⃣1️⃣ ACCESSIBILITY (A11Y)

*   **Contrast:** Đảm bảo độ tương phản text >= WCAG AA.
*   **Touch Target:** Min height `44px` cho mọi nút bấm/liên kết.
*   **Label:** Luôn có `aria-label` cho icon button.

---

## 1️⃣2️⃣ CHECKLIST TRƯỚC KHI MERGE

1.  [ ] Màn hình này có quá 1 hành động chính (Primary Action) không?
2.  [ ] Có thể thoát (Cancel/Skip) dễ dàng không?
3.  [ ] Có gây áp lực tâm lý (Urgency) không?
4.  [ ] Có sử dụng màu sắc quá gắt (High saturation) không?
5.  [ ] Giao diện này có giống "Dashboard quản trị" không? (Nếu có -> Làm lại).

---

## 1️⃣3️⃣ THÔNG ĐIỆP
> **Đây không phải là ứng dụng để "hoàn thành task",**
> **mà là nơi người dùng "quay về" với chính mình.**
