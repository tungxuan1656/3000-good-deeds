# 01. GHI NHẬN VIỆC THIỆN (GOOD DEEDS)

## 1. Tổng quan
Tính năng cốt lõi giúp người dùng ghi lại những hành động thiện lành (Thân - Khẩu - Ý) để tự quán chiếu mỗi ngày.

**Nguyên tắc:** Nhanh (< 60s) - Đơn giản - Riêng tư.

---

## 2. User Stories
| ID      | Là một...  | Tôi muốn...                         | Để...                                     |
| :------ | :--------- | :---------------------------------- | :---------------------------------------- |
| **D01** | Người dùng | Ghi nhận một việc thiện             | Lưu lại khoảnh khắc tích cực              |
| **D02** | Người dùng | Chọn loại việc thiện (Thân/Khẩu/Ý)  | Phân biệt được tính chất hành động        |
| **D03** | Người dùng | Xem lại danh sách việc thiện đã làm | Tự quán chiếu tiến trình thay đổi của tâm |
| **D04** | Người dùng | Sửa/Xóa việc thiện                  | Điều chỉnh nếu ghi nhầm                   |

---

## 3. Phân loại (Categories)
Hệ thống sử dụng 3 nhóm cốt lõi (Mặc định):

1.  **Thân thiện (Body):** Hành động cụ thể (giúp đỡ, bố thí, bảo vệ sự sống).
2.  **Khẩu thiện (Speech):** Lời nói (ái ngữ, chân thật, hòa giải).
3.  **Ý thiện (Mind):** Tâm ý (bao dung, buông xả, hoan hỷ).

*Lưu ý: Trong MVP, danh mục là cố định, user không tạo thêm. Frontend lấy danh mục từ API `GET /categories`.*

---

## 4. Luồng người dùng (UX Flow)

### 4.1. Thêm mới (Create)
1.  User nhấn nút **"+"** (Floating Action Button) ở Home.
2.  Chọn **Danh mục** (Icon + Tên).
3.  (Optional) Nhập **Ghi chú** ngắn.
4.  Nhấn **Lưu**.
5.  Thông báo: "Đã ghi nhận một việc thiện".

### 4.2. Xem lịch sử (View)
1.  Vào tab **Nhật ký**.
2.  Thấy danh sách việc thiện xếp theo thời gian (Mới nhất trên cùng).
3.  Group theo Ngày.

---

## 5. Quy tắc nghiệp vụ (Business Rules)
1.  **Create Time:** Mặc định là thời điểm hiện tại (`now`), nhưng cho phép chọn ngày quá khứ.
2.  **Privacy:** Luôn private (`is_private = true`) và **không có toggle** trong UI.
3.  **Validation:** Bắt buộc chọn Danh mục. Ghi chú có thể để trống.
4.  **Limits:** Không giới hạn số lượng, nhưng nếu > 10 việc/ngày có thể hiển thị lời nhắc nhẹ nhàng (để tránh spam/ảo tưởng).

---

## 6. Dữ liệu (Data Model)
Xem chi tiết tại `docs/03_technical/01_database_schema.md`.
-   Table: `good_deeds`
-   Relations: `users`, `categories`
