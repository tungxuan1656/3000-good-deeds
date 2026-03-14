# Docs Health Review Standard

## Purpose

This document defines how to continuously review documentation quality across the monorepo.
It is a reusable standard, not a one-time report.

## When to Run

- Before major releases
- After large refactors
- Monthly documentation maintenance cycle
- During project handover or onboarding refresh

## Review Dimensions

### 1) Necessity

Check whether each document still serves a clear purpose.

- Remove outdated docs that are no longer referenced.
- Archive historical docs that should be kept only for traceability.
- Avoid creating docs that duplicate code comments or existing standards.

### 2) Duplication

Check whether the same rule exists in multiple places with conflicting wording.

- Keep a single source of truth per topic.
- Replace duplicated content with links to the canonical document.

### 3) Completeness

Check whether required documentation exists for current runtime behavior.

Minimum required coverage:
- Product intent and business behavior
- API contract and technical boundaries
- Data model and migration notes
- Coding/review standards
- Delivery process and checklists

### 4) Accuracy

Check whether docs match the current codebase.

- Endpoint lists must match runtime routes.
- Schema docs must match migrations and usage.
- Feature specs must match actual UX and backend constraints.

### 5) Usability

Check whether docs are easy to navigate for new contributors.

- clear index pages
- consistent naming
- stable folder ownership
- no broken links

## Output Format (Required)

Each health review must produce:
- What is healthy
- What is missing
- What is duplicated
- Prioritized action plan (P1/P2/P3)

## Current Baseline Snapshot

Last reviewed: 2026-03-14

Known follow-ups:
1. Establish real test baseline in frontend and backend code.
2. Add release-note and ADR structures if project maturity requires them.
