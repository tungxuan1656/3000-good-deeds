# 02. HỒ SƠ & CÀI ĐẶT (PROFILE & SETTINGS)

## 1. Tổng quan
Màn hình để quản lý thông tin người dùng và cài đặt trải nghiệm.

Nguyên tắc:
- Tối giản, tập trung nhu cầu cốt lõi.
- Quyền riêng tư cao.
- Firebase là nơi xác thực danh tính; backend là nơi quản lý dữ liệu nghiệp vụ.

---

## 2. User Stories
| ID      | Là một...  | Tôi muốn...                           | Để...                                               |
| :------ | :--------- | :------------------------------------ | :-------------------------------------------------- |
| **P01** | Người dùng | Xem email và tên hiển thị             | Biết mình đang đăng nhập tài khoản nào             |
| **P02** | Người dùng | Cập nhật tên hiển thị                 | Cá nhân hóa trải nghiệm sử dụng                     |
| **P03** | Người dùng | Đổi mật khẩu (email/password)         | Tăng bảo mật tài khoản                              |
| **P04** | Người dùng | Đăng xuất                             | Bảo mật khi dùng máy lạ                             |
| **P05** | Người dùng | Bật/tắt nhắc nhở                      | Chủ động việc nhận thông báo                        |
| **P06** | Người dùng | Xoá tài khoản                         | Xoá toàn bộ dữ liệu của mình khi không muốn dùng nữa |

---

## 3. Chi tiết tính năng

### 3.1 Thông tin cá nhân
- Hiển thị: `displayName`, `email`.
- Cho phép cập nhật `displayName` trong app.
- **Không dùng avatar** trong phiên bản hiện tại.

### 3.2 Bảo mật tài khoản
- Tài khoản Email/Password:
  - Đổi mật khẩu trong app.
  - Bắt buộc nhập mật khẩu hiện tại để xác nhận.
- Tài khoản Google-only:
  - Không hiển thị đổi mật khẩu trong app.

### 3.3 Cài đặt chung
- Nhắc nhở tu tập: ON/OFF + giờ nhắc.
- Các setting khác giữ như hiện tại.

### 3.4 Quản lý tài khoản
- Đăng xuất: clear session local + logout backend.
- Xoá tài khoản: vẫn theo flow xác nhận có nhập keyword.

---

## 4. UI Flow
1. Từ Home mở màn hình Cài đặt.
2. Xem và chỉnh tên hiển thị.
3. Nếu tài khoản password: đổi mật khẩu khi cần.
4. Quản lý session và thao tác đăng xuất/xóa tài khoản.
