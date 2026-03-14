---
trigger: glob
globs: frontend/**
---

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
| **Folder Structure**            | [project-folder-structure.md](frontend/docs/standards/project-folder-structure.md)             | Standard folder structure, feature separation, and import/export rules.                                                                                                  |
| **Component Organization**      | [component-structure-pattern.md](frontend/docs/standards/component-structure-pattern.md)       | Rules for organizing Pages and child Components, public vs internal barrel exports, file size limits.                                                                    |
| **Naming**                      | [naming-and-conventions-pattern.md](frontend/docs/standards/naming-and-conventions-pattern.md) | File naming conventions (kebab-case), mock files, comments (English), import ordering, TODO patterns.                                                                    |
| **Types**                       | [type-naming-pattern.md](frontend/docs/standards/type-naming-pattern.md)                       | Standard type naming with DTO, Request, Response suffixes for API data.                                                                                                  |
| **API & Cache**                 | [api-react-query-pattern.md](frontend/docs/standards/api-react-query-pattern.md)               | Combined API Service and TanStack Query model; mock pattern, identity select, derive-first rule.                                                                         |
| **Store Management**            | [zustand-store-pattern.md](frontend/docs/standards/zustand-store-pattern.md)                   | Implementing Global State with Zustand using Actions, Selectors, and mandatory unit tests.                                                                               |
| **Working with Forms**          | [form-pattern.md](frontend/docs/standards/form-pattern.md)                                     | Guide to building Forms using React Hook Form, Zod, and shadcn UI.                                                                                                       |
| **Internationalization (i18n)** | [i18n-label-pattern.md](frontend/docs/standards/i18n-label-pattern.md)                         | Internationalization workflow, nested keys, t() module scope, locale completeness, interpolation.                                                                        |
| **Colors & Typography**         | [color-guide.md](frontend/docs/standards/color-guide.md)                                       | Tailwind color classes (semantic, status, surface, divider), font size scale (text-xss → text-base), icon convention.                                                    |
| **Code Review Guide**           | [code-review-guide.md](frontend/docs/standards/code-review-guide.md)                           | Code/commit/PR review guide: 5-step process + comprehensive checklist across 10 dimensions (UI, UX, API, logic, performance, architecture, testing, i18n, naming, docs). |
| **Dialog & Form Field**         | [dialog-and-form-pattern.md](frontend/docs/standards/dialog-and-form-pattern.md)               | Pattern for Dialog (ref), Dialog + Form fields, standalone Form fields; FieldLabel vs FieldLegend.                                                                       |

## Main Stack (Quick Link)
- **UI**: [shadcn-ui](https://ui.shadcn.com/) (Use `pnpm dlx shadcn@latest add`).
- **Icons**: `lucide-react` (Format: `{Name}Icon`).
- **State**: `zustand` & `TanStack Query`.
- **Form**: `react-hook-form` + `zod`.
