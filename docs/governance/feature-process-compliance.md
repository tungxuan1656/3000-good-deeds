# Feature Process Compliance Standard

## Purpose

Track compliance of each feature against the fullstack feature delivery process.
Reference process: `docs/governance/fullstack-feature-development-process.md`.

## Compliance Scale

- `Pass`: requirement is clearly satisfied.
- `Partial`: partly satisfied with notable risk.
- `Fail`: missing or not evidenced.

## Compliance Matrix (Template)

| Feature | F1 Product Spec | F2 API Contract | F3 Data Model | F4 Design | F6 Testing Evidence | Overall |
| --- | --- | --- | --- | --- | --- | --- |
| Example Feature | Pass/Partial/Fail | Pass/Partial/Fail | Pass/Partial/Fail | Pass/Partial/Fail/N/A | Pass/Partial/Fail | Pass/Partial/Fail |

## How to Evaluate

1. F1: verify product spec exists and reflects runtime behavior.
2. F2: verify API contract details are documented and current.
3. F3: verify schema/migration docs exist when data changes are present.
4. F4: verify design docs for significant UX changes.
5. F6: verify real testing evidence (not just checklist intent).

## Current Baseline Snapshot

Last reviewed: 2026-03-14

Main conclusion:
- Testing evidence is the largest compliance gap.
