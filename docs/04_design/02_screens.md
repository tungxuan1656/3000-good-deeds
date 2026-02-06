# 02. DANH SÁCH MÀN HÌNH (SCREEN LIST)

## 1. Tổng quan
Tài liệu này liệt kê toàn bộ các màn hình (Screens) và trạng thái (States) cần xây dựng cho Frontend.
Tổng cộng: **17 Màn hình chính** & **~18 Trạng thái con**.

---

## 🟢 NHÓM A: ENTRY & NỀN TẢNG

### 1️⃣ Login / Onboarding
*   **Màn hình chính:**
    1.  **Login:** Nút "Tiếp tục với Google", Slogan, Logo.
*   **Trạng thái con:**
    *   Loading (Spinner khi đang gọi API).
    *   Error (Toast thông báo lỗi nếu login thất bại).

### 2️⃣ Home (Dashboard)
*   **Màn hình chính:**
    2.  **Home:**
        *   Header: Chào hỏi + Avatar.
        *   Quote: Pháp ngữ hôm nay.
        *   Action: FAB (+) to Check-in.
        *   Summary: Progress bar mục tiêu (nếu có).
*   **Trạng thái con:**
    *   **Empty State:** User mới chưa có dữ liệu.
    *   **Active Goal:** Hiển thị thanh tiến độ.

---

## 🟢 NHÓM B: GHI NHẬN VIỆC THIỆN (CORE)

### 3️⃣ Check-in việc thiện (Wizard)
*   **Luồng:** Mở Bottom Sheet hoặc Modal từ Home.
*   **Các bước (Steps):**
    3.  **Step 1 - Loại:** Chọn Thân / Khẩu / Ý (Cards to).
    4.  **Step 2 - Chi tiết:** Nhập text + Toggle "Riêng tư".
    5.  **Step 3 - Hình ảnh (Optional):** Upload/Camera hoặc Skip.
    6.  **Step 4 - Cảm xúc (Labels):** Chọn tag (An vui, Biết ơn...) -> Finish.
*   **Trạng thái con:**
    *   Confirm Cancel (nếu đóng đạng chừng).
    *   Success Animation (Confetti/Checkmark).

### 4️⃣ Timeline / Hành trình
*   **Màn hình chính:**
    7.  **Timeline:** List việc thiện, group theo Ngày.
*   **Trạng thái con:**
    *   **Empty:** "Chưa có việc thiện nào".
    *   **Loading:** Skeleton loading khi scroll.

### 5️⃣ Chi tiết việc thiện
*   **Màn hình chính:**
    8.  **Deed Detail:** Xem lại nội dung full, ảnh, thời gian.
*   **Trạng thái con:**
    *   **Edit Form:** Cho phép sửa nội dung.
    *   **Delete Confirm:** Modal xác nhận xoá.

---

## 🟡 NHÓM C: THỐNG KÊ & QUÁN CHIẾU

### 6️⃣ Thống kê (Stats)
*   **Màn hình chính:**
    9.  **Statistics:**
        *   Tổng số việc thiện.
        *   Biểu đồ cột (Bar chart) phân bố Thân/Khẩu/Ý.
        *   Streak (Chuỗi ngày).
*   **Trạng thái con:**
    *   View Week / Month (Tabs switch).
    *   Empty Data (Hiển thị lời khích lệ).

---

## 🟡 NHÓM D: MỤC TIÊU & DUY TRÌ

### 7️⃣ Goals (Mục tiêu)
*   **Màn hình chính:**
    10. **Goals Overview:** Hiển thị mục tiêu đang chạy & Lịch sử.
*   **Trạng thái con:**
    *   **Setup New Goal:** Form tạo mục tiêu (Daily/Weekly).
    *   **Goal Completed:** Trạng thái hoàn thành xuất sắc.

---

## 🔵 NHÓM E: NHẮC NHỞ

### 8️⃣ Reminder Settings
*   *(Tích hợp trong màn Profile, nhưng có logic UI riêng)*
*   **Trạng thái:**
    *   Toggle OFF.
    *   Toggle ON -> Hiện Time Picker chọn giờ.

---

## 🧘 NHÓM F: CÔNG CỤ TU TẬP (INNER TOOLS)

### 9️⃣ Inner Hub (Kho tàng)
*   **Màn hình chính:**
    11. **Inner Landing:** Menu liết kê các công cụ (Pháp ngữ, Sổ tay, Thiền...).

### 🔟 Pháp ngữ (Daily Quote)
*   **Màn hình chính:**
    12. **Full Quote View:** Hiển thị ảnh nền + Text đẹp để đọc/share.

### 1️⃣1️⃣ Gieo duyên (Random Acts)
*   **Màn hình chính:**
    13. **Card Gợi ý:** Hiển thị 1 việc thiện ngẫu nhiên.
*   **Trạng thái:**
    *   Next (Bỏ qua).
    *   Accept (Lưu vào Todo/Goal).

### 1️⃣2️⃣ Sổ tay tâm hồn (Soul Journal)
*   **Màn hình chính:**
    14. **Journal List:** Danh sách nhật ký (Sám hối / Biết ơn).
    15. **Editor:** Màn hình viết nhật ký.
*   **Trạng thái:**
    *   Mode Sám hối (Theme tối/trầm).
    *   Mode Biết ơn (Theme sáng/ấm).

### 1️⃣3️⃣ Thiền & Thở
*   **Màn hình chính:**
    16. **Meditation Player:**
        *   Vòng tròn hít thở (Animation).
        *   Đồng hồ đếm ngược (Timer).
*   **Trạng thái:**
    *   Running / Paused / Finished.

---

## ⚙️ NHÓM G: CÁ NHÂN

### 1️⃣4️⃣ Hồ sơ & Cài đặt
*   **Màn hình chính:**
    17. **Profile:**
        *   Info (Avatar, Name).
        *   Settings (Language, Reminder).
        *   Help / About.
*   **Trạng thái con (Danger Zone):**
    *   **Logout Confirm:** Modal.
    *   **Delete Account:** Màn hình nhập chữ "DELETE" để xác nhận.

---

## Tổng kết
*   **Số lượng màn hình:** ~17 màn.
*   **Độ phức tạp:** Trung bình - Thấp. Chủ yếu là list, detail, và form nhập liệu đơn giản.
*   **Điểm nhấn UX:** Animations (Confetti, Breathing, Swipe), Transitions mượt mà.
