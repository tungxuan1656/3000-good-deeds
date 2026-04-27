# 05 - Image Placeholders

## Nguyên tắc chung

- Tên file không dấu, dùng `kebab-case`.
- Chuẩn ưu tiên: `webp`, fallback `jpg/png` nếu cần.
- Có alt text tiếng Việt, rõ nghĩa SEO.

## Danh sách ảnh cần chuẩn bị

| STT | Tên file gợi ý | Tỉ lệ | Vị trí dùng | Mô tả ảnh cần chụp/tạo |
|---|---|---|---|---|
| 1 | `hero-dashboard-mobile.webp` | 4:5 | Hero | Màn hình iPhone hiển thị trang chính webapp đang sử dụng thực tế |
| 2 | `hero-dashboard-desktop.webp` | 16:10 | Hero/Feature | Giao diện webapp trên desktop, thể hiện dashboard theo dõi việc thiện |
| 3 | `ios-install-step-1.webp` | 9:19.5 | Section cài iOS | Safari iOS mở webapp, hiển thị nút Share |
| 4 | `ios-install-step-2.webp` | 9:19.5 | Section cài iOS | Menu iOS hiển thị lựa chọn Add to Home Screen |
| 5 | `ios-install-step-3.webp` | 9:19.5 | Section cài iOS | Icon webapp đã xuất hiện ở màn hình chính iPhone |
| 6 | `android-install-step-1.webp` | 9:19.5 | Section cài Android | Chrome Android mở webapp, hiển thị menu cài app |
| 7 | `android-install-step-2.webp` | 9:19.5 | Section cài Android | Popup Add to Home screen/Install app trên Android |
| 8 | `android-install-step-3.webp` | 9:19.5 | Section cài Android | Icon webapp xuất hiện ở launcher Android |
| 9 | `feature-tracking-list.webp` | 16:10 | Feature | Trang danh sách việc thiện đã hoàn thành |
| 10 | `feature-progress-view.webp` | 16:10 | Feature | Trang tiến trình/thống kê hành trình việc thiện |
| 11 | `social-proof-community.webp` | 3:2 | Social proof | Ảnh minh họa cộng đồng, hoạt động thiện nguyện đời thực |
| 12 | `og-cover-3000-viec-thien.webp` | 1.91:1 | SEO/OG | Ảnh chia sẻ mạng xã hội có brand 3000 Việc Thiện + tagline miễn phí |

## Alt text mẫu

- `Ảnh giao diện webapp 3000 Việc Thiện trên iPhone`
- `Các bước cài web app 3000 Việc Thiện trên iOS`
- `Màn hình theo dõi tiến trình làm việc thiện mỗi ngày`

## Placeholder rule trong code

Trong giai đoạn chưa có ảnh thật:

- Dùng block placeholder có kích thước thật.
- Gắn nhãn: `TODO_IMAGE: <ten-file-goi-y>`.
- Có comment ngắn mô tả loại ảnh cần thay.
