---
trigger: glob
globs: frontend/**
---

# Hướng dẫn cho Frontend

Bạn là trợ lý lập trình chuyên về TypeScript, React 19 (Vite), Tailwind CSS v4, shadcn-ui, Lucide Icons. Luôn trả lời bằng tiếng Việt.

## Quy tắc chung

- **Tự trị**: Tập trung thực thi tác vụ, không giải thích dài dòng trừ khi được hỏi.
- **Dependencies**: Ưu tiên stack đã định nghĩa. Dùng `pnpm install <pkg>` khi thực thực sự cần thiết.
- **Vệ sinh code**: Luôn chạy `pnpm run lint` sau khi coding để đảm bảo format và tiêu chuẩn code.
- **Comment code**: Luôn comment code bằng **tiếng Anh**.
- **Mock data**: Tách riêng vào `api/<domain>.mock.ts` — không nhúng inline vào component.
- **i18n**: Mọi text hiển thị cho người dùng phải qua `t()`. Không hardcode chuỗi UI.
- **Font size**: Dùng class từ design system (`text-xss`, `text-xs`, `text-sm`, ...) — không dùng arbitrary value `text-[10px]`.
- **Icon**: Dùng `lucide-react` format `{Name}Icon` — không trộn emoji với Lucide trong cùng view.

## Tài liệu tham khảo & Patterns (Bắt buộc)

Khi thực hiện task, bạn **PHẢI** tham chiếu các tài liệu (phù hợp với yêu cầu của công việc) trong thư mục `docs/` để tuân thủ pattern của dự án:

| Trường hợp               | Tài liệu tham khảo                                                          | Mô tả                                                                                                                                                                |
| :----------------------- | :-------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cấu trúc thư mục**     | [project_folder_structure.md](docs/project_folder_structure.md)             | Cấu trúc thư mục chuẩn, phân chia feature và quy tắc import/export.                                                                                                  |
| **Tổ chức Component**    | [component_structure_pattern.md](docs/component_structure_pattern.md)       | Quy định cách tổ chức Page và Component con, public vs internal barrel export, giới hạn kích thước file.                                                             |
| **Đặt tên (Naming)**     | [naming_and_conventions_pattern.md](docs/naming_and_conventions_pattern.md) | Quy ước đặt tên file (kebab-case), mock file, comment (tiếng Anh), import ordering, TODO pattern.                                                                    |
| **Kiểu dữ liệu (Types)** | [type_naming_pattern.md](docs/type_naming_pattern.md)                       | Chuẩn đặt tên Type với hậu tố DTO, Request, Response cho dữ liệu API.                                                                                                |
| **Xử lý API & Cache**    | [api_react_query_pattern.md](docs/api_react_query_pattern.md)               | Mô hình kết hợp API Service và TanStack Query; mock pattern, identity select, derive-first rule.                                                                     |
| **Quản lý Store**        | [zustand_store_pattern.md](docs/zustand_store_pattern.md)                   | Cách triển khai Global State bằng Zustand với Actions, Selectors và unit test bắt buộc.                                                                              |
| **Làm việc với Form**    | [form-pattern.md](docs/form-pattern.md)                                     | Hướng dẫn xây dựng Form sử dụng React Hook Form, Zod và shadcn UI.                                                                                                   |
| **Đa ngôn ngữ (i18n)**   | [i18n_label_pattern.md](docs/i18n_label_pattern.md)                         | Quy trình quản lý đa ngôn ngữ, key lồng nhau, t() module scope, locale completeness, interpolation.                                                                  |
| **Màu sắc & Typography** | [color_guide.md](docs/color_guide.md)                                       | Class màu Tailwind (semantic, status, surface, divider), font size scale (text-xss → text-base), icon convention.                                                    |
| **Code Review Guide**    | [code_review_guide.md](docs/code_review_guide.md)                           | Hướng dẫn review code/commit/PR: quy trình 5 bước + checklist đầy đủ theo 10 dimension (UI, UX, API, logic, performance, architecture, testing, i18n, naming, docs). |
| **Dialog & Form Field**  | [dialog_and_form_pattern.md](docs/dialog_and_form_pattern.md)               | Pattern cho Dialog (ref), Dialog + Form fields, Form fields độc lập; FieldLabel vs FieldLegend.                                                                      |

## Stack chính (Quick Link)
- **UI**: [shadcn-ui](https://ui.shadcn.com/) (Dùng `pnpm dlx shadcn@latest add`).
- **Icons**: `lucide-react` (Format: `{Name}Icon`).
- **State**: `zustand` & `TanStack Query`.
- **Form**: `react-hook-form` + `zod`.