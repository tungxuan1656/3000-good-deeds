# 01. WIREFRAMES & UI CONCEPTS

Tài liệu này mô tả bố cục (layout) và các màn hình chính của ứng dụng trên Mobile (Mobile-first design).

## 1. Global Layout (App Shell)
Ứng dụng sử dụng thanh điều hướng dưới đáy (Bottom Navigation Bar) cố định.

```text
+-----------------------------+
|        [Header Area]        | <- Logo, Avatar (Profile access)
|                             |
|                             |
|      [Main Content]         | <- Scrollable Area
|                             |
|                             |
+-----------------------------+
|  Home | Journal | Cultivate | <- Bottom Nav
+-----------------------------+
```

---

## 2. Màn hình chính (Home Screen)
**Mục tiêu:** Cho người dùng cái nhìn tổng quan và lối tắt nhanh nhất để hành thiện.

```text
+-----------------------------+
| Hello, Tung Doan (Avatar)   |
| "Hôm nay bạn thế nào?"      |
+-----------------------------+
| [Daily Quote Widget]        |
| "Hãy tự thắp đuốc lên..."   |
| (Image Background, Text)    |
+-----------------------------+
| [Quick Actions]             |
| + Ghi nhận việc thiện (FAB) | <- Nút nổi bật nhất (Primary)
| + Gợi ý việc thiện (Random) |
+-----------------------------+
| [Today's Progress]          |
| [=== 1/3 Deeds ===] Goal    |
|                             |
| * Đã giúp cụ già (9:00 AM)  |
+-----------------------------+
```

---

## 3. Màn hình Ghi nhận (Add Deed)
**Mục tiêu:** Check-in cực nhanh (< 30s).

```text
+-----------------------------+
| [X] Ghi nhận việc thiện     |
+-----------------------------+
| Chọn loại việc thiện:       |
| [Body - Thân] [Speech - Khẩu]
| [Mind - Ý]                  |
+-----------------------------+
|                             |
| [ Icon to nhất ở giữa ]     |
| (Thay đổi theo lựa chọn)    |
|                             |
+-----------------------------+
| Ghi chú (Optional):         |
| [ Nhập nội dung vào đây... ]|
+-----------------------------+
|                             |
| [ LƯU LẠI - Button Lớn ]    |
|                             |
+-----------------------------+
```

---

## 4. Màn hình Tu Tập (Cultivation Hub)
**Mục tiêu:** Trung tâm các công cụ hỗ trợ nội tâm.

```text
+-----------------------------+
|      Vườn Tâm Của Bạn       |
+-----------------------------+
| [Card 1: Sổ Tay Tâm Hồn]    |
| > Sám hối / Biết ơn         |
| (Icon: Cuốn sổ & Bút)       |
+-----------------------------+
| [Card 2: Thiền (Timer)]     |
| > 5p, 10p, 15p...           |
| (Icon: Người ngồi thiền)    |
+-----------------------------+
| [Card 3: Hơi thở (Breath)]  |
| > 4-7-8 Relax               |
| (Icon: Làn gió)             |
+-----------------------------+
```

---

## 5. Màn hình Thống kê (Stats)
**Mục tiêu:** Quan sát, không so sánh.

```text
+-----------------------------+
|      Hành Trình Của Bạn     |
+-----------------------------+
|  [ 120 ]      [ 5 ]         |
| Tổng số      Chuỗi ngày     |
+-----------------------------+
|                             |
|       [ Bar Chart ]         |
|  |   ||   |   |   ||  |     |
| T2  T3  T4  T5  T6  T7  CN  |
+-----------------------------+
|                             |
| Phân loại:                  |
| Thân: 50% [=====     ]      |
| Khẩu: 30% [===       ]      |
| Ý:    20% [==        ]      |
+-----------------------------+
```

---

## 6. Màn hình Cá nhân (Profile)
**Mục tiêu:** Cài đặt và quản lý tài khoản.

```text
+-----------------------------+
| [Avatar] Tung Doan          |
| [Edit Profile]              |
+-----------------------------+
| Cài đặt:                    |
| (o) Nhắc nhở hằng ngày      |
|     [ 20:00 ]               |
|                             |
| ( ) Dark Mode               |
+-----------------------------+
| Tài khoản:                  |
| > Đăng xuất                 |
| > Xóa tài khoản (Danger)    |
+-----------------------------+
```
