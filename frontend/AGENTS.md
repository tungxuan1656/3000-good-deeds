
# Frontend Guidelines

You are a programming assistant specializing in TypeScript, React 19 (Vite), Tailwind CSS v4, shadcn-ui, Lucide Icons. Always respond in English.

## General Rules

- **Autonomy**: Focus on executing tasks, avoid lengthy explanations unless asked.
- **Dependencies**: Prioritize the defined stack. Use `pnpm install <pkg>` only when truly necessary.
- **Code hygiene**: Always run `pnpm run lint` after coding to ensure format and code standards.
- **Code comments**: Always write code comments in **English**.
- **Mock data**: Separate into `api/<domain>.mock.ts` — do not embed inline in components.
- **i18n**: All user-facing text must go through `t()`. Do not hardcode UI strings.
- **Font size**: Use design system classes (`text-xss`, `text-xs`, `text-sm`, ...) — do not use arbitrary values like `text-[10px]`.
- **Icon**: Use `lucide-react` with format `{Name}Icon` — do not mix emojis with Lucide in the same view.

## Reference Documents & Patterns (Required)

When performing tasks, you **MUST** reference the relevant documents in the `docs/` directory to follow project patterns:

| Use Case                        | Reference Document                                                          | Description                                                                                                                                                              |
| :------------------------------ | :-------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Folder Structure**            | [project_folder_structure.md](docs/project_folder_structure.md)             | Standard folder structure, feature separation, and import/export rules.                                                                                                  |
| **Component Organization**      | [component_structure_pattern.md](docs/component_structure_pattern.md)       | Rules for organizing Pages and child Components, public vs internal barrel exports, file size limits.                                                                    |
| **Naming**                      | [naming_and_conventions_pattern.md](docs/naming_and_conventions_pattern.md) | File naming conventions (kebab-case), mock files, comments (English), import ordering, TODO patterns.                                                                    |
| **Types**                       | [type_naming_pattern.md](docs/type_naming_pattern.md)                       | Standard type naming with DTO, Request, Response suffixes for API data.                                                                                                  |
| **API & Cache**                 | [api_react_query_pattern.md](docs/api_react_query_pattern.md)               | Combined API Service and TanStack Query model; mock pattern, identity select, derive-first rule.                                                                         |
| **Store Management**            | [zustand_store_pattern.md](docs/zustand_store_pattern.md)                   | Implementing Global State with Zustand using Actions, Selectors, and mandatory unit tests.                                                                               |
| **Working with Forms**          | [form-pattern.md](docs/form-pattern.md)                                     | Guide to building Forms using React Hook Form, Zod, and shadcn UI.                                                                                                       |
| **Internationalization (i18n)** | [i18n_label_pattern.md](docs/i18n_label_pattern.md)                         | Internationalization workflow, nested keys, t() module scope, locale completeness, interpolation.                                                                        |
| **Colors & Typography**         | [color_guide.md](docs/color_guide.md)                                       | Tailwind color classes (semantic, status, surface, divider), font size scale (text-xss → text-base), icon convention.                                                    |
| **Code Review Guide**           | [code_review_guide.md](docs/code_review_guide.md)                           | Code/commit/PR review guide: 5-step process + comprehensive checklist across 10 dimensions (UI, UX, API, logic, performance, architecture, testing, i18n, naming, docs). |
| **Dialog & Form Field**         | [dialog_and_form_pattern.md](docs/dialog_and_form_pattern.md)               | Pattern for Dialog (ref), Dialog + Form fields, standalone Form fields; FieldLabel vs FieldLegend.                                                                       |

## Main Stack (Quick Link)
- **UI**: [shadcn-ui](https://ui.shadcn.com/) (Use `pnpm dlx shadcn@latest add`).
- **Icons**: `lucide-react` (Format: `{Name}Icon`).
- **State**: `zustand` & `TanStack Query`.
- **Form**: `react-hook-form` + `zod`.
