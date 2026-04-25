# 10 - Task Breakdown (Execution Ready)

Tài liệu này chia dự án thành các task có kích thước cân bằng: không quá nhỏ để gây overhead, không quá lớn để khó kiểm soát.

## Nguyên tắc chia task

- Mỗi task giải quyết 1 mục tiêu nghiệp vụ/kỹ thuật rõ ràng.
- Mỗi task có đầu ra đo được (artifact cụ thể).
- Mỗi task có định nghĩa hoàn thành (DoD) để QA/pass-fail.
- Task sau chỉ bắt đầu khi dependency chính đã đạt DoD.

## Danh sách task

| ID | Tên task | Mục tiêu | Input chính | Output bắt buộc | Dependency |
|---|---|---|---|---|---|
| LP-01 | Bootstrap Next.js project | Tạo nền tảng chạy được local/build/deploy | `06-nextjs-vercel-plan.md` | App Next.js + TS + Tailwind chạy được, build thành công | Không |
| LP-02 | Thiết lập kiến trúc trang landing | Tạo skeleton section và điều hướng trong trang | `03-content-seo-structure.md` | Trang có đủ section theo cấu trúc H1/H2/H3 | LP-01 |
| LP-03 | Thiết kế UI system và component lõi | Đồng bộ visual quality, responsive, accessibility | `02-ui-ux-direction.md` | Bộ component cơ bản: header, section wrapper, CTA, card, FAQ item | LP-02 |
| LP-04 | Viết nội dung tiếng Việt chuẩn SEO | Đưa copy chính thức theo thông điệp dự án | `01-project-brief.md`, `03-content-seo-structure.md` | Nội dung hoàn chỉnh cho tất cả section + FAQ + CTA text | LP-02 |
| LP-05 | Tích hợp placeholder ảnh + media slots | Sẵn sàng thay asset thật mà không đổi layout | `05-image-placeholders.md` | Placeholder đầy đủ với tỉ lệ chuẩn, alt text, TODO_IMAGE mapping | LP-03, LP-04 |
| LP-06 | SEO metadata và schema | Đảm bảo đủ tín hiệu SEO on-page | `04-seo-technical-checklist.md` | Metadata đầy đủ + JSON-LD `WebSite/Organization/FAQPage` | LP-04 |
| LP-07 | SEO technical endpoints | Hoàn thiện hạ tầng crawl/index | `04-seo-technical-checklist.md` | `robots.txt`, `sitemap.xml`, canonical đúng domain production | LP-06 |
| LP-08 | CTA linking và tracking conventions | Chốt đường dẫn chuyển đổi sang webapp chính | `06-nextjs-vercel-plan.md` | Tất cả CTA link đúng + chuẩn UTM thống nhất | LP-04 |
| LP-09 | QA chất lượng toàn trang | Xác nhận UI/UX/SEO đạt ngưỡng release | `02`, `04`, `07` | Report QA gồm lint/build, responsive, a11y, Lighthouse | LP-05, LP-06, LP-07, LP-08 |
| LP-10 | Deploy production trên Vercel | Public landing page và kiểm tra production | `06-nextjs-vercel-plan.md` | URL production hoạt động, HTTPS OK, cấu hình project chuẩn | LP-09 |
| LP-11 | Thiết lập Google Search Console | Kích hoạt index và đo hiệu quả SEO | `07-seo-validation-guide.md` | Property GSC + sitemap submitted + request indexing homepage | LP-10 |
| LP-12 | Handover manual & vận hành sau release | Chốt việc manual và quy trình tối ưu định kỳ | `08-manual-work-checklist.md` | Checklist manual hoàn tất + lịch theo dõi SEO 2 tuần/lần | LP-11 |

## Định nghĩa hoàn thành chi tiết từng task

### LP-01 - Bootstrap Next.js project

- Phạm vi:
  - Khởi tạo project trong `landing-page`.
  - Cấu hình script `dev`, `build`, `lint`.
- DoD:
  - Chạy local thành công.
  - `build` pass.
  - Cấu trúc thư mục khớp kế hoạch.

### LP-02 - Thiết lập kiến trúc trang landing

- Phạm vi:
  - Dựng layout 1 trang với section semantic.
  - Tạo anchor navigation nội trang.
- DoD:
  - Có đúng hierarchy heading.
  - Không lỗi semantic HTML cơ bản.

### LP-03 - Thiết kế UI system và component lõi

- Phạm vi:
  - Token màu/chữ/spacing.
  - Component tái sử dụng cho section, card, CTA, FAQ.
- DoD:
  - UI nhất quán toàn trang.
  - Nút bấm đạt tối thiểu 44x44px.
  - Focus state thấy rõ bằng bàn phím.

### LP-04 - Viết nội dung tiếng Việt chuẩn SEO

- Phạm vi:
  - Hoàn chỉnh copy cho hero, benefits, how-it-works, FAQ, CTA.
  - Chèn keyword tự nhiên, không nhồi nhét.
- DoD:
  - Có thông điệp rõ: miễn phí vĩnh viễn.
  - Nội dung đủ chiều sâu để tránh thin content.

### LP-05 - Tích hợp placeholder ảnh + media slots

- Phạm vi:
  - Tạo vị trí ảnh với tỉ lệ đúng theo danh sách.
  - Gắn alt text và mô tả ảnh cần bổ sung.
- DoD:
  - Toàn bộ ảnh cần thiết có slot tương ứng.
  - Không gây CLS lớn do thiếu khung ảnh.

### LP-06 - SEO metadata và schema

- Phạm vi:
  - Thiết lập title, description, OG, Twitter card.
  - Chèn structured data JSON-LD.
- DoD:
  - View source thấy đủ metadata quan trọng.
  - Structured data hợp lệ qua Rich Results Test.

### LP-07 - SEO technical endpoints

- Phạm vi:
  - Tạo `robots.txt`, `sitemap.xml`, canonical.
  - Quy tắc index cho production.
- DoD:
  - Các endpoint truy cập công khai được.
  - Sitemap chứa URL chính xác.

### LP-08 - CTA linking và tracking conventions

- Phạm vi:
  - Chuẩn hóa link CTA đến webapp chính.
  - Gắn quy ước UTM để đo chuyển đổi.
- DoD:
  - 100% CTA mở đúng URL đích.
  - Không có link hỏng.

### LP-09 - QA chất lượng toàn trang

- Phạm vi:
  - Lint/build.
  - Test responsive: 375/768/1024/1440.
  - Lighthouse SEO/Accessibility/Performance.
- DoD:
  - Không lỗi blocker.
  - Có báo cáo QA ngắn kèm ảnh/chỉ số.

### LP-10 - Deploy production trên Vercel

- Phạm vi:
  - Kết nối repo với Vercel.
  - Thiết lập root directory là `landing-page`.
- DoD:
  - Deploy production thành công.
  - URL `*.vercel.app` hoạt động ổn định.

### LP-11 - Thiết lập Google Search Console

- Phạm vi:
  - Verify property.
  - Submit sitemap.
  - Request indexing homepage.
- DoD:
  - Search Console ghi nhận sitemap hợp lệ.
  - URL inspection không báo lỗi nghiêm trọng.

### LP-12 - Handover manual & vận hành sau release

- Phạm vi:
  - Chốt danh sách việc manual còn lại.
  - Chốt lịch theo dõi và tối ưu SEO.
- DoD:
  - Có checklist trạng thái hoàn thành từng việc.
  - Có người phụ trách và mốc thời gian rõ.

## Milestone gợi ý

- M1 (Foundation): hoàn thành LP-01 -> LP-04
- M2 (SEO-ready build): hoàn thành LP-05 -> LP-08
- M3 (Go-live): hoàn thành LP-09 -> LP-11
- M4 (Operate): hoàn thành LP-12

## Trạng thái cập nhật hiện tại

- Đã hoàn thành: tài liệu planning (Bước 1).
- Đã hoàn thành: LP-01 (Bootstrap Next.js project).
- Đã hoàn thành: LP-02 (Thiết lập kiến trúc trang landing).
- Đã hoàn thành: LP-03 (Thiết kế UI system và component lõi).
- Đã hoàn thành: LP-04 (Viết nội dung tiếng Việt chuẩn SEO).
- Chưa bắt đầu: LP-05 trở đi.
