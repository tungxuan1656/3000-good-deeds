# Feature Documentation Audit Standard

## Purpose

Define a standard way to audit whether every runtime feature has sufficient documentation.

## Scope

Audit runtime features against:
- frontend product specs
- backend product rules
- backend technical contracts
- design documentation (when applicable)

## Feature Audit Matrix (Template)

| Feature | Runtime Exists | Frontend Product Spec | Backend Product Spec | API Reference Detail | DB Coverage | Design Coverage | Result |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Example Feature | Yes | Yes/Partial/No | Yes/Partial/No | Yes/Partial/No | Yes/Partial/No | Yes/Partial/No | Pass/Partial/Fail |

## Result Rules

- `Pass`: required docs are complete and aligned with runtime behavior.
- `Partial`: core docs exist but important gaps remain.
- `Fail`: major docs are missing or not trustworthy.

## Audit Procedure

1. Enumerate runtime features from route and handler modules.
2. Map each feature to required docs.
3. Mark coverage level for each dimension.
4. Record key gaps and impact.
5. Propose prioritized remediation.

## Required Output Sections

- Coverage summary table
- Top critical gaps
- Priority recommendations
- Owner suggestions for follow-up

## Current Baseline Snapshot

Last reviewed: 2026-03-14

Highlights:
- API references improved significantly.
- Backend product specs are still thinner than frontend specs.
- Test evidence remains the main gap across features.
