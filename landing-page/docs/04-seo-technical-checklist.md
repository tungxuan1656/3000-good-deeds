# 04 - SEO Technical Checklist

## Metadata bắt buộc

- `title` duy nhất, 50-60 ký tự.
- `meta description` 140-160 ký tự, có CTA nhẹ.
- `canonical` trỏ đúng URL landing production.
- Open Graph: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`.
- Twitter cards: `summary_large_image`.

## Indexing & crawl

- Có `robots.txt` cho production.
- Có `sitemap.xml` tự sinh.
- Không để `noindex` trong production.
- Chặn index cho môi trường preview/staging (nếu có).

## Structured Data

- JSON-LD `WebSite`.
- JSON-LD `Organization`.
- JSON-LD `FAQPage` nếu có mục FAQ.

## Semantic HTML

- Dùng `header`, `main`, `section`, `footer`, `nav`.
- Heading hierarchy đúng thứ tự.
- Ảnh có `alt` mô tả đúng nội dung.

## Core Web Vitals mục tiêu

- LCP < 2.5s
- INP < 200ms
- CLS < 0.1

## Technical implementation notes (Next.js)

- Dùng App Router + `generateMetadata`.
- Tận dụng SSG cho landing page.
- Dùng `next/image` cho toàn bộ ảnh.
- Preload font cần thiết, tránh FOIT/FOUT quá mạnh.

## Internal linking

- Link rõ ràng đến webapp chính.
- Tạo anchor link trong trang (hero -> FAQ -> CTA) để tăng crawlability.

## Nội dung chống thin content

- Tối thiểu 1000-1500 từ nội dung hữu ích tiếng Việt.
- Có bằng chứng trực quan: ảnh chụp page, ảnh cài đặt webapp, ảnh trải nghiệm thực tế.
