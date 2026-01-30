# 04. MỤC TIÊU (GOALS)

## 1. Tổng quan
Cho phép người dùng đặt ra các định hướng tu tập (Ví dụ: "Mỗi ngày 3 việc thiện") để tự nhắc nhở bản thân.

**Nguyên tắc:** Tự nguyện - Linh hoạt - Không hình phạt.

---

## 2. User Stories
| ID      | Là một...  | Tôi muốn...                 | Để...                                   |
| :------ | :--------- | :-------------------------- | :-------------------------------------- |
| **G01** | Người dùng | Đặt mục tiêu theo ngày/tuần | Có định hướng rõ ràng cho việc tu tập   |
| **G02** | Người dùng | Theo dõi tiến độ mục tiêu   | Biết mình còn cần nỗ lực thêm bao nhiêu |
| **G03** | Người dùng | Thay đổi hoặc tắt mục tiêu  | Giảm áp lực khi bận rộn                 |

---

## 3. Loại mục tiêu (MVP)
*   **Thời gian:** Hàng ngày (Daily), Hàng tuần (Weekly).
*   **Đơn vị:** Số lượng việc thiện.
*   *(Future)*: Mục tiêu theo danh mục cụ thể (VD: "Mỗi ngày 1 lời ái ngữ").

---

## 4. Logic & Quy tắc
1.  **Active Goal:** Mỗi thời điểm chỉ nên có 1 mục tiêu chính để tránh rối (Simplicity).
2.  **Hoàn thành:** Khi đạt >= target, hiển thị chúc mừng nhẹ nhàng (Confetti visual).
3.  **Thất bại:** Khi hết ngày mà chưa đạt -> Reset, không trừng phạt, không thông báo tiêu cực.

## 5. UI Flow
1.  Vào màn hình **Mục tiêu**.
2.  Nhấn "Đặt mục tiêu mới".
3.  Chọn: "Mỗi [Ngày] làm [3] việc thiện".
4.  Lưu.
5.  Thanh tiến độ (Progress Bar) sẽ xuất hiện ở Home.
