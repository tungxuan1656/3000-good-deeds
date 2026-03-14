
# Color Guide (Project Accurate)

This document reflects the color tokens declared in `src/index.css` of the current project.

## 1) Source of truth

- Theme tokens are declared in `:root` and `.dark` in `src/index.css`.
- Tailwind semantic classes map via `@theme inline` (e.g., `--color-background`, `--color-primary`, ...).
- When adding a new color: add the token in `index.css` first, then use the class in the component.

## 2) Semantic tokens in use

| Token                | Light     | Dark                        | Corresponding Class                         |
| -------------------- | --------- | --------------------------- | ------------------------------------------- |
| `background`         | `#f6f3ee` | `#0a0a0a`                   | `bg-background`                             |
| `foreground`         | `#212121` | `oklch(0.985 0 0)`          | `text-foreground`                           |
| `card`               | `#ffffff` | `oklch(0.205 0 0)`          | `bg-card`                                   |
| `card-foreground`    | `#202020` | `oklch(0.985 0 0)`          | `text-card-foreground`                      |
| `popover`            | `#ffffff` | `oklch(0.205 0 0)`          | `bg-popover`                                |
| `popover-foreground` | `#0a0a0a` | `oklch(0.985 0 0)`          | `text-popover-foreground`                   |
| `primary`            | `#7a9b86` | `oklch(0.922 0 0)`          | `bg-primary`, `text-primary`                |
| `primary-foreground` | `#fafafa` | `oklch(0.205 0 0)`          | `text-primary-foreground`                   |
| `secondary`          | `#bfd4c3` | `oklch(0.269 0 0)`          | `bg-secondary`, `text-secondary-foreground` |
| `muted`              | `#f5f5f5` | `oklch(0.269 0 0)`          | `bg-muted`, `text-muted-foreground`         |
| `muted-foreground`   | `#737373` | `oklch(0.708 0 0)`          | `text-muted-foreground`                     |
| `accent`             | `#e6c77a` | `oklch(0.269 0 0)`          | `bg-accent`, `text-accent-foreground`       |
| `destructive`        | `#e57373` | `oklch(0.704 0.191 22.216)` | `bg-destructive`, `text-destructive`        |
| `border`             | `#e5e5e5` | `oklch(1 0 0 / 10%)`        | `border-border`                             |
| `input`              | `#e5e5e5` | `oklch(1 0 0 / 15%)`        | `border-input`, `bg-input/*`                |
| `ring`               | `#799a85` | `oklch(0.556 0 0)`          | `ring-ring`, `focus-visible:ring-ring/*`    |

## 3) Domain colors (Body / Speech / Mind)

Domain colors have their own tokens and are mapped to Tailwind classes:

| Token    | Value     | Class                      |
| -------- | --------- | -------------------------- |
| `body`   | `#f2b36f` | `bg-body`, `text-body`     |
| `speech` | `#8fbad9` | `bg-speech`, `text-speech` |
| `mind`   | `#b9a7e3` | `bg-mind`, `text-mind`     |

Practical usage pattern:

- `bg-body/20 hover:bg-body/40`
- `bg-speech/20 hover:bg-speech/40`
- `bg-mind/20 hover:bg-mind/40`

## 4) Chart & sidebar tokens

- Tokens `chart-1..5` and `sidebar-*` are available in `index.css`.
- Use only when chart/sidebar components need those semantic tokens.
- Avoid hardcoding chart colors directly in components.

## 5) Preferred classes

- Surface/text/border: `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`.
- Form controls: `border-input`, `focus-visible:border-ring`, `focus-visible:ring-ring/50`.
- Form error state: `aria-invalid:border-destructive`, `aria-invalid:ring-destructive/20`.

## 6) Not used in this project

The following classes do not have tokens in the current theme (copied from another project), do not use:

- `text-danger`, `bg-danger`, `bg-danger-subtle`
- `text-warning`, `bg-warning`, `bg-warning-subtle`
- `text-success`, `bg-success`, `bg-success-subtle`
- `text-info`, `bg-info`, `bg-info-subtle`
- `bg-surface*`, `border-divider*`, `text-disabled-foreground`, `bg-inverse-surface`, `text-inverse-foreground`

If you need these semantics, you must add real tokens to `index.css` first.

## 7) Quick examples

```tsx
<div className='bg-card text-card-foreground border-border rounded-2xl border p-4'>
	<p className='text-foreground'>Heading</p>
	<p className='text-muted-foreground text-sm'>Supporting text</p>
</div>

<button className='bg-primary text-primary-foreground hover:bg-primary/90'>Primary</button>
<button className='bg-secondary text-secondary-foreground hover:bg-secondary/80'>Secondary</button>

<span className='bg-body/20 text-foreground rounded-full px-2 py-1 text-xs'>Body</span>
<span className='bg-speech/20 text-foreground rounded-full px-2 py-1 text-xs'>Speech</span>
<span className='bg-mind/20 text-foreground rounded-full px-2 py-1 text-xs'>Mind</span>
```
