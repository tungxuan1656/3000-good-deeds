# 03. THỐNG KÊ & QUAN SÁT (STATISTICS)

## 1. Tổng quan
Giúp người dùng nhìn lại hành trình tu tập của mình qua các con số, để tự soi chiếu và điều chỉnh, không phải để so sánh hay khoe khoang.

**Nguyên tắc:** Dữ liệu cá nhân - Không so sánh xã hội - Không áp lực.

---

## 2. User Stories
| ID      | Là một...  | Tôi muốn...                             | Để...                                 |
| :------ | :--------- | :-------------------------------------- | :------------------------------------ |
| **S01** | Người dùng | Xem tổng số việc thiện đã ghi nhận      | Nhìn lại nhịp tu tập của mình         |
| **S02** | Người dùng | Xem biểu đồ theo thời gian (Ngày/Tuần)  | Quan sát tần suất tu tập              |
| **S03** | Người dùng | Xem phân bố theo Danh mục (Thân/Khẩu/Ý) | Biết mình đang thiên về hành động nào |
| **S04** | Người dùng | Xem chuỗi ngày liên tục (Streak)        | Có thêm động lực duy trì sự đều đặn   |

---

## 3. Các chỉ số chính (Metrics)
1.  **Tổng số việc thiện:** All-time count.
2.  **Chuỗi ngày (Streak):** Số ngày liên tục có ít nhất 1 check-in.
    *   *Quy tắc:* Nếu quên 1 ngày -> Reset về 0 (nhưng hiển thị thông điệp khích lệ, không trách móc).
3.  **Phân bố:** Biểu đồ Bar hoặc Stacked Bar đơn giản. Tránh Pie chart nếu quá nhiều mục.

---

## 4. UI/UX Flow
1.  Vào Tab **Thống kê**.
2.  Mặc định hiển thị **Tuần này**.
3.  User có thể switch sang **Tháng**.
4.  Các thẻ (Card) hiển thị số liệu to, rõ ràng, kèm icon.

## 5. Quy tắc hiển thị
*   **Màu sắc:** Sử dụng tông màu trầm, bình ổn (Pastel), tránh màu đỏ/cam gắt gỏng khi số liệu thấp.
*   **Empty State:** Nếu chưa có dữ liệu, hiển thị: "Hành trình vạn dặm bắt đầu từ bước chân đầu tiên".
