# 02. HỒ SƠ & CÀI ĐẶT (PROFILE & SETTINGS)

## 1. Tổng quan
Nơi người dùng quản lý thông tin cá nhân và thiết lập các tuỳ chọn cho ứng dụng.

**Nguyên tắc:** Tối giản - Đồng bộ từ Google - Quyền riêng tư cao nhất (Right to be forgotten).

---

## 2. User Stories
| ID      | Là một...  | Tôi muốn...                         | Để...                                                              |
| :------ | :--------- | :---------------------------------- | :----------------------------------------------------------------- |
| **P01** | Người dùng | Xem thông tin cá nhân (Avatar, Tên) | Biết mình đang đăng nhập tài khoản nào                             |
| **P02** | Người dùng | Đăng xuất (Logout)                  | Bảo mật khi dùng máy lạ                                            |
| **P03** | Người dùng | Cài đặt nhắc nhở (ON/OFF)           | Chủ động việc có nhận thông báo hay không                          |
| **P04** | Người dùng | Xoá tài khoản (Delete Account)      | Xoá toàn bộ dữ liệu của mình khỏi hệ thống khi không muốn dùng nữa |

---

## 3. Chi tiết tính năng

### 3.1. Thông tin cá nhân (Read-only)
*   **Avatar & Tên hiển thị:** Đồng bộ tự động từ Google Profile khi đăng nhập.
*   **Email:** Hiển thị email đang dùng.
*   *Lưu ý:* Trong giai đoạn MVP, **KHÔNG** cho phép user đổi avatar/tên trong app để giảm phức tạp. Nếu họ đổi bên Google, lần login sau app sẽ cập nhật.

### 3.2. Cài đặt chung (General Settings)
*   **Nhắc nhở tu tập:** Toggle Switch [ON/OFF].
    *   Nếu ON: Hiện thêm chọn giờ (Time Picker).
    *   Liên kết với Feature `06_reminders`.
*   **Giao diện (Future):** Chọn Dark/Light Mode (Mặc định: System).

### 3.3. Quản lý tài khoản (Danger Zone)
*   **Đăng xuất:**
    *   Clear Token ở LocalStorage/Cookie.
    *   Redirect về màn hình Login.
*   **Xoá tài khoản:**
    *   Nút màu đỏ, nằm dưới cùng.
    *   **Flow:** Nhấn Xoá -> Modal xác nhận ("Bạn chắc chứ? Dữ liệu sẽ mất vĩnh viễn") -> Nhập chữ "DELETE" để xác nhận -> Gọi API xoá user & data -> Logout.

---

## 4. UI Flow
1.  Từ màn hình Home -> Nhấn vào Avatar nhỏ ở góc (hoặc Menu).
2.  Mở ra màn hình **Tài khoản** (hoặc Drawer).
3.  Hiển thị các section rõ ràng:
    *   Header: Avatar to + Tên.
    *   Body: List các setting.
    *   Footer user: Version app + Nút Logout.
