# 02 - UI/UX Direction

## Nguyên tắc thiết kế (theo ui-ux-pro-max)

- Accessibility first: tương phản chữ >= 4.5:1, focus ring rõ, hỗ trợ bàn phím.
- Touch-first: mọi nút CTA tối thiểu 44x44px.
- Performance-aware: ưu tiên ảnh WebP, lazy load ảnh không nằm trong hero.
- Responsive bắt buộc: không horizontal scroll tại 375px.
- Typography dễ đọc: body 16px trở lên trên mobile, line-height 1.5-1.75.

## Visual direction đề xuất

- Phong cách: ấm áp, truyền cảm hứng, hiện đại, sạch.
- Tone màu chủ đạo: xanh lá thiện nguyện + xanh dương tin cậy + nền sáng.
- Tránh dark mode mặc định cho landing SEO tiếng Việt ở giai đoạn đầu.
- Icon: dùng SVG (Lucide/Heroicons), không dùng emoji làm icon UI.

## Cấu trúc layout

1. Hero
2. Ý nghĩa dự án
3. Lợi ích khi dùng web
4. Cách hoạt động (3 bước)
5. Ảnh demo giao diện
6. Cài webapp trên iOS/Android
7. FAQ SEO-friendly
8. CTA cuối trang

## Interaction

- Hover dùng đổi màu/đổ bóng nhẹ, không scale gây nhảy layout.
- Transition 150-300ms.
- Tôn trọng `prefers-reduced-motion`.

## CTA guidelines

- CTA chính: `Mở web app miễn phí`.
- CTA phụ: `Bắt đầu hành trình việc thiện`, `Dùng ngay trên điện thoại`.
- Tất cả CTA trỏ về `https://3000-viec-thien.web.app/` (có thể gắn UTM sau).
