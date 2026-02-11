# 06. NHẮC NHỞ (REMINDERS)

## 1. Tổng quan
Hệ thống thông báo đẩy (Push Notification) hoặc In-app để giúp người dùng nhớ thực hành mỗi ngày.

**Nguyên tắc:** Nhẹ nhàng - Tôn trọng - Không Spam.

---

## 2. Tính năng chính
*   **Daily Reminder:** Nhắc vào một giờ cố định trong ngày (User cài đặt, VD: 20:00).
*   **Nội dung ngẫu nhiên:** Thay đổi câu nhắc để không nhàm chán.
    *   "Bạn ơi, hôm nay có niềm vui nào nhỏ bé không?"
    *   "Dành 1 phút để nhìn lại tâm mình nhé."
    *   "Một việc thiện nhỏ cũng đủ làm sáng một ngày."

## 3. Quy tắc
1.  **Opt-in:** Mặc định TẮT. User phải chủ động bật.
2.  **Tần suất:** Tối đa 1 lần/ngày.
3.  **Ngữ cảnh:** Nếu user đã mở app và check-in hôm nay -> **Không gửi** nhắc nhở tối nay nữa (Smart suppress).

## 4. Tech Specs
*   Sử dụng **Web Push API** (cho PWA) hoặc **Local Notification** (nếu đóng gói app).
*   Cần xin quyền `Notification.requestPermission()`.
