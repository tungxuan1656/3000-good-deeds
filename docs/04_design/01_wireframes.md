# 01. WIREFRAMES & UI CONCEPTS

Tài liệu này mô tả bố cục (layout) và các màn hình chính của ứng dụng, áp dụng chiến lược **Responsive Hybrid Navigation**:
*   **Mobile (< 768px):** Bottom Navigation Bar.
*   **Desktop (>= 768px):** Left Sidebar.

## 1. Global Layout (App Shell)

### A. Mobile Layout
Sử dụng thanh điều hướng dưới đáy (Bottom Navigation Bar) kết hợp Floating Action Button (FAB).

```text
+-----------------------------+
|        [Header Area]        | <- Logo, Avatar
|                             |
|                             |
|      [Main Content]         | <- Scrollable Area
|                             |
|                             |
|             ( + )           | <- FAB (Ghi nhận nhanh)
+-----------------------------+
| Home | Stat |     | Cult | Menu | <- Bottom Nav (5 slots)
+-----------------------------+
```
*   **Menu:** Tab cuối cùng chứa Profile, Settings, Logout.

### B. Desktop Layout
Sử dụng thanh bên trái (Sidebar) cố định.

```text
+--------------+----------------------------------+
| LOGO         |  Header (Breadcrumbs)            |
+--------------+----------------------------------+
| [ + GHI NHẬN]|                                  |
|              |                                  |
| (Icon) Home  |                                  |
| (Icon) Stat  |      [Main Content Area]         |
| (Icon) Cult  |                                  |
|              |                                  |
|              |                                  |
| (Icon) Menu  |                                  |
+--------------+----------------------------------+
```

---

## 2. Màn hình chính (Dashboard Home)
**Mục tiêu:** Dashboard tổng quan, điểm khởi đầu cho mọi hoạt động trong ngày.

```text
+-----------------------------+
| Hello, Tung Doan (Avatar)   |
| "Hôm nay bạn thế nào?"      |
+-----------------------------+
| [Daily Quote Widget]        |
| "Hãy tự thắp đuốc lên..."   |
| (Image Background, Text)    |
+-----------------------------+
| [Overview Snapshot]         |
| [========= 30% =========]   |
| Đã làm: 1/3 việc thiện      |
| Streak: 5 ngày 🔥           |
+-----------------------------+
| [Quick Shortcuts]           |
| [Thiền 5p]  [Sổ tay]        |
+-----------------------------+
| [Recent Activity]           |
| * Đã giúp cụ già (9:00 AM)  |
+-----------------------------+
```

---

## 3. Màn hình Ghi nhận (Quick Add)
**Cách tiếp cận:**
*   **Mobile:** Nhấn FAB (+) -> Mở Modal/Bottom Sheet ghi nhận nhanh.
*   **Desktop:** Nhấn nút [+] trên Sidebar -> Mở Modal center.

```text
+-----------------------------+
| [X] Ghi nhận việc thiện     |
+-----------------------------+
| Chọn loại việc thiện:       |
| (o) Thân   ( ) Khẩu   ( ) Ý |
+-----------------------------+
|                             |
|    [ ICON MINH HỌA ]        |
|                             |
+-----------------------------+
| Nội dung:                   |
| [ Ghi chú chi tiết...    ]  |
+-----------------------------+
| [ Lưu lại - Button Lớn ]    |
+-----------------------------+
```

---

## 4. Màn hình Tu Tập (Cultivation Hub)
**Mục tiêu:** Danh sách các công cụ hỗ trợ.

```text
+-----------------------------+
|      Vườn Tâm Của Bạn       |
+-----------------------------+
| [Card: Sổ Tay Tâm Hồn]      |
| > Sám hối / Biết ơn         |
+-----------------------------+
| [Card: Đồng hồ Thiền]       |
| > Timer 5p, 10p, 15p...     |
+-----------------------------+
| [Card: Tập Thở]             |
| > 4-7-8 Relax               |
+-----------------------------+
```

---

## 5. Màn hình Thống kê (Stats)
**Mục tiêu:** Quan sát hành trình.

```text
+-----------------------------+
|      Biểu Đồ Tăng Trưởng    |
+-----------------------------+
|  [ 120 ]      [ 5 ]         |
| Tổng số      Chuỗi ngày     |
+-----------------------------+
|       [ Bar Chart ]         |
|  |   ||   |   |   ||  |     |
| T2  T3  T4  T5  T6  T7  CN  |
+-----------------------------+
| Phân bổ (Pie Chart):        |
| Thân (50%) - Khẩu (30%)     |
+-----------------------------+
```

---

## 6. Màn hình Menu (Account & Settings)
**Vị trí:** Tab cuối cùng (Mobile) hoặc Mục cuối cùng (Desktop Sidebar).

```text
+-----------------------------+
| [Avatar Big] Tung Doan      |
| [Edit Profile]              |
+-----------------------------+
| Cài đặt Ứng dụng:           |
| [Toggle] Dark Mode          |
| [Setup ] Nhắc nhở hằng ngày |
+-----------------------------+
| Thông tin:                  |
| > Giới thiệu dự án          |
| > Điều khoản & Riêng tư     |
+-----------------------------+
| [ Đăng xuất (Red) ]         |
+-----------------------------+
```
