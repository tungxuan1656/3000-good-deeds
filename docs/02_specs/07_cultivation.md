# 07. CÔNG CỤ TU TẬP (CULTIVATION TOOLS)

## 1. Tổng quan
Bộ công cụ hỗ trợ "quay vào bên trong", giúp người dùng nuôi dưỡng sự bình an và tỉnh thức.

---

## 2. Tính năng chi tiết

### 2.1. Pháp ngữ theo phiên (Session Dharma Quote)
*   **Mô tả:** Hiển thị một câu nói/lời dạy ngẫu nhiên tại màn hình Home.
*   **Logic:**
    *   Mỗi lần bắt đầu phiên (mở app/restart PWA), client chọn 1 câu và cache cho cả phiên.
    *   Có thể có nút “Đổi câu khác” (tùy chọn) để chọn lại trong phiên.
    *   Nguồn: Kinh điển, Thiền sư uy tín.
    *   Không quảng cáo, không lời hoa mỹ sáo rỗng.

### 2.2. Gieo duyên lành (Random Acts of Kindness)
*   **Mô tả:** Nút bấm "Gợi ý việc thiện" khi user không biết làm gì.
*   **Logic:**
    *   Random từ database (~50 hành động mẫu).
    *   User có thể chấp nhận (Add to Todo) hoặc bỏ qua (Next).

### 2.3. Sổ tay quán chiếu (Soul Journal)
*   **Mô tả:** Không gian riêng tư để quán chiếu nội tâm, giúp người dùng **thấy rõ – ghi lại – buông xuống**.
*   **Chế độ:** *Sám hối* và *Biết ơn*.
*   **Nguyên tắc:** Privacy-first, **không chỉnh sửa/xoá** sau khi lưu (Write & Let Go), **không gamification**.
*   **Spec chi tiết:** Xem [08_soul_journal.md](./08_soul_journal.md).

### 2.4. Hỗ trợ Thiền & Thở (Meditation & Breath)
*   **Timer:** Đếm ngược thời gian ngồi thiền (5p, 10p, 15p). Chuông nhẹ nhàng.
*   **Breathing:** Vòng tròn hướng dẫn hít vào (4s) - giữ (4s) - thở ra (4s) - giữ (4s).

---

## 3. Quy tắc nghiệp vụ
1.  **Offline-first:** Các công cụ Timer/Breathing phải hoạt động khi không có mạng.
2.  **No Distraction:** Giao diện tối giản (Minimalist), không thông báo làm phiền trong lúc dùng công cụ.
