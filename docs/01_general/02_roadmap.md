# 02. LỘ TRÌNH PHÁT TRIỂN (ROADMAP)

Tài liệu này phác thảo lộ trình xây dựng phiên bản MVP (Minimum Viable Product) và các định hướng tương lai.

## Giai đoạn 1: Nền tảng & Ghi nhận (Core)
**Mục tiêu:** Người dùng có thể đăng nhập và ghi chép việc thiện hàng ngày.

*   [x] **Hạ tầng:** Setup Monorepo, Database (D1), Backend (Worker), Frontend (React).
*   [x] **Authentication:** Đăng nhập bằng Google.
*   [ ] **Nhật ký việc thiện:**
    *   Thêm mới việc thiện (Thân/Khẩu/Ý).
    *   Xem lịch sử theo dòng thời gian.
    *   Chỉnh sửa/Xóa.

## Giai đoạn 2: Quán chiếu & Thống kê (Reflection)
**Mục tiêu:** Giúp người dùng nhìn lại quá trình tu tập của mình.

*   [ ] **Thống kê:**
    *   Tổng số việc thiện theo ngày/tuần/tháng.
    *   Biểu đồ phân bố (Thân vs Khẩu vs Ý).
*   [ ] **Chuỗi (Streak):** Đếm số ngày liên tục làm việc thiện.

## Giai đoạn 2.5: Tu Tâp Nội Tâm (Inner Cultivation)
**Mục tiêu:** Cung cấp công cụ hỗ trợ "quay vào bên trong" (Đã hoàn thiện Backend).

*   [x] **Pháp ngữ mỗi ngày (Daily Quotes):** Hiển thị lời dạy hiền triết ngẫu nhiên.
*   [x] **Gieo duyên lành (Random Acts):** Gợi ý việc thiện ngẫu nhiên.
*   [ ] **Sổ tay tâm hồn (Soul Journal):** Viết nhật ký Sám hối & Biết ơn (Riêng tư).
*   [ ] **Hỗ trợ thiền & thở:** Timer đơn giản & Hướng dẫn thở 4-7-8.

## Giai đoạn 3: Duy trì thói quen (Habit)
**Mục tiêu:** Nhắc nhở và khích lệ người dùng không bỏ cuộc.

*   [ ] **Mục tiêu (Goals):** Đặt mục tiêu (VD: 1 ngày 3 việc thiện).
*   [ ] **Thành tựu (Achievements):** Huy hiệu đơn giản (VD: "Người mới bắt đầu", "3 ngày liên tiếp").
*   [ ] **Nhắc nhở (Notifications):** Thông báo đẩy (Web Push) vào giờ cố định.

## Giai đoạn 4: Ổn định & Mở rộng (Stable & Scale)
**Mục tiêu:** Sẵn sàng cho lượng người dùng lớn hơn.

*   [ ] **Tối ưu UX/UI:** Dark mode, Animation mượt mà.
*   [ ] **PWA:** Cài đặt app lên điện thoại (Installable).
*   [ ] **Đa ngôn ngữ:** Hỗ trợ Tiếng Anh (nếu cần).

---

## Nguyên tắc triển khai
1.  **Mobile-first:** Ưu tiên trải nghiệm trên điện thoại.
2.  **Offline-ready:** Hỗ trợ dùng khi không có mạng (với PWA).
3.  **KISS (Keep It Simple, Stupid):** Đừng làm phức tạp hóa vấn đề.
