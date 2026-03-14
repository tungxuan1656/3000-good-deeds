---
trigger: model_decision
description: Generate commit message
---

Generate a commit message using Conventional Commits.

Required syntax:
`<type>[(scope)][!]: <subject>`

Rules:
- `<type>` must be a noun-like commit type such as `feat`, `fix`, `refactor`, `docs`, etc.
- Subject line must be concise and clear.
- Optional body and footer must be separated by a blank line.
- For breaking changes, either:
  - use `!` after type/scope, or
  - add `BREAKING CHANGE: <description>` in footer.
- Keep each line under 100 characters.
