# 07. CÔNG CỤ TU TẬP (CULTIVATION TOOLS)

## 1. Tổng quan
Bộ công cụ hỗ trợ "quay vào bên trong", giúp người dùng nuôi dưỡng sự bình an và tỉnh thức.

---

## 2. Tính năng chi tiết

### 2.1. Pháp ngữ mỗi ngày (Daily Dharma Quote)
*   **Mô tả:** Hiển thị một câu nói/lời dạy ngẫu nhiên tại màn hình Home.
*   **Logic:**
    *   Thay đổi mỗi ngày (00:00 server time).
    *   Nguồn: Kinh điển, Thiền sư uy tín.
    *   Không quảng cáo, không lời hoa mỹ sáo rỗng.

### 2.2. Gieo duyên lành (Random Acts of Kindness)
*   **Mô tả:** Nút bấm "Gợi ý việc thiện" khi user không biết làm gì.
*   **Logic:**
    *   Random từ database (~50 hành động mẫu).
    *   User có thể chấp nhận (Add to Todo) hoặc bỏ qua (Next).

### 2.3. Sổ tay tâm hồn (Soul Journal)
*   **Mô tả:** Nơi viết những điều thầm kín, khó nói.
*   **Hai chế độ:**
    1.  **Sám hối:** Ghi nhận lỗi lầm -> Quyết tâm không tái phạm -> Cảm thấy nhẹ lòng.
    2.  **Biết ơn:** Ghi nhận điều may mắn/tốt đẹp nhận được -> Nuôi dưỡng tâm tri túc.
*   **Privacy:** Tuyệt đối riêng tư. Mã hóa phía client nếu có thể (Future).

### 2.4. Hỗ trợ Thiền & Thở (Meditation & Breath)
*   **Timer:** Đếm ngược thời gian ngồi thiền (5p, 10p, 15p). Chuông nhẹ nhàng.
*   **Breathing:** Vòng tròn hướng dẫn hít vào (4s) - giữ (4s) - thở ra (4s) - giữ (4s).

---

## 3. Quy tắc nghiệp vụ
1.  **Offline-first:** Các công cụ Timer/Breathing phải hoạt động khi không có mạng.
2.  **No Distraction:** Giao diện tối giản (Minimalist), không thông báo làm phiền trong lúc dùng công cụ.
