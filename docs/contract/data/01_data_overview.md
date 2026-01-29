# F-DATA · Tổng quan dữ liệu

## 1. Mục tiêu của lớp dữ liệu (Data Layer)

Lớp dữ liệu của ứng dụng **3000 Việc Thiện** có nhiệm vụ:
- Lưu trữ toàn bộ hành vi tu tập – làm việc thiện của người dùng
- Hỗ trợ thống kê, theo dõi tiến trình, tạo động lực
- Đảm bảo dữ liệu mang tính **cá nhân – nhẹ nhàng – không phán xét**
- Tôn trọng **quyền riêng tư** và **tính vô ngã** trong tinh thần Phật giáo

Dữ liệu **không nhằm xếp hạng hay so sánh con người**, mà để:
> “Giúp mỗi người soi lại chính mình hôm qua.”

---

## 2. Nguyên tắc thiết kế dữ liệu

### 2.1. Tối giản nhưng có chiều sâu
- Không lưu dữ liệu dư thừa
- Ưu tiên dữ liệu có giá trị phản chiếu nội tâm

### 2.2. Cá nhân hóa tuyệt đối
- Mỗi dữ liệu gắn với **hành trình riêng**
- Không có leaderboard công khai mặc định

### 2.3. Có thể mở rộng
- Dễ bổ sung loại việc thiện mới
- Dễ thêm tính năng cộng đồng về sau

---

## 3. Các nhóm dữ liệu chính

| Nhóm                 | Mô tả                    |
| -------------------- | ------------------------ |
| User Data            | Thông tin người dùng     |
| Good Deed Data       | Dữ liệu việc thiện       |
| Goals & Achievements | Mục tiêu và thành tựu    |
| Statistics           | Thống kê – báo cáo       |
| System Data          | Cấu hình hệ thống        |
| Privacy & Security   | Quyền riêng tư & bảo mật |

---

## 4. Đối tượng sử dụng tài liệu

- Product Owner
- Developer (Backend / Mobile)
- Designer (hiểu giới hạn dữ liệu)
- Stakeholder & cố vấn nội dung Phật giáo