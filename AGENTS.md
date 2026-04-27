# Root AGENTS Guide

This file defines the default working conventions for contributors in this monorepo.

## Scope

Applies to the whole repository unless a package-level `AGENTS.md` provides more specific rules.

- Frontend-specific rules: `frontend/AGENTS.md`
- Backend-specific rules: `backend/AGENTS.md`

## Core Principles

- Keep changes small, clear, and reviewable.
- Preserve API and behavior compatibility unless a breaking change is explicitly approved.
- Keep docs synchronized with code changes.
- Prefer consistency with existing project patterns over personal style preferences.

## Documentation Rules

- Shared docs belong in `docs/`.
- Frontend-only docs belong in `frontend/docs/`.
- Backend-only docs belong in `backend/docs/`.
- For fullstack features, follow: `docs/governance/fullstack-feature-development-process.md`.

## Quality Gates

Before marking work as done:

- Run relevant lint/type checks.
- Validate changed user flows manually when needed.
- Update docs affected by API, schema, architecture, or behavior changes.
- Ensure links in modified docs remain valid.

## Security Basics

- Never commit secrets or credentials.
- Do not log sensitive data (tokens, personal data, private content).
- Use environment variables for all secret configuration.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **3000-good-deeds** (2721 symbols, 3959 relationships, 29 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/3000-good-deeds/context` | Codebase overview, check index freshness |
| `gitnexus://repo/3000-good-deeds/clusters` | All functional areas |
| `gitnexus://repo/3000-good-deeds/processes` | All execution flows |
| `gitnexus://repo/3000-good-deeds/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.agents/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.agents/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.agents/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.agents/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.agents/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.agents/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
