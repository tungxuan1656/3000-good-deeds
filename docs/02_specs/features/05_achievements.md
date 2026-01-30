# 05. THÀNH TỰU (ACHIEVEMENTS)

## 1. Tổng quan
Hệ thống huy hiệu (Badges) để ghi nhận những cột mốc ý nghĩa trên hành trình tu tập.

**Nguyên tắc:** Ghi nhận sự **Bền bỉ** hơn là **Số lượng**.

---

## 2. Danh sách Achievement (MVP)

### Nhóm Bền Bỉ (Streaks)
*   🌱 **Hạt Giống:** Check-in lần đầu tiên.
*   🌿 **Nảy Mầm:** Duy trì 3 ngày liên tiếp.
*   🌳 **Vững Chãi:** Duy trì 7 ngày liên tiếp.
*   🌕 **Viên Mãn:** Duy trì 30 ngày (1 tháng).

### Nhóm Tinh Tấn (Counts)
*   **Người Gieo Duyên:** Đạt 10 việc thiện.
*   **Tấm Lòng Vàng:** Đạt 50 việc thiện.
*   **Bồ Tát Hạnh:** Đạt 100 việc thiện.

---

## 3. Logic Trao Huy Hiệu
1.  **Tự động:** Hệ thống check điều kiện sau mỗi hành động (create deed, open app).
2.  **Thông báo:** Hiển thị Modal/Toast chúc mừng: "Bạn vừa nhận được huy hiệu [Tên]".
3.  **Lưu trữ:** Lưu vào bảng `user_achievements`.

## 4. UI/UX
*   Màn hình **Bộ sưu tập**: Hiển thị lưới các huy hiệu.
*   **Locked State:** Huy hiệu chưa đạt sẽ bị mờ (Greyscale) + Hiển thị điều kiện để mở khóa.
*   **Unlocked State:** Sáng màu + Ngày đạt được.
