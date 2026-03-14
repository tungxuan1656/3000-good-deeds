# Backend Goals Spec

## Purpose

Define backend rules for goal upsert and goal-history tracking.

## Goal Types

- `weekly`
- `monthly`
- `yearly`

## Core Rules

- one goal per type per user
- `POST /goals` supports single-goal and batch payloads
- goal history updates are tied to current period behavior
- no retroactive history creation for past periods

## History Rules

- history list supports cursor pagination
- cursor format: `<startDate>_<id>`
- history updates are triggered by deed changes and target updates

## Consistency Rules

- target changes in current period must sync current history target values
- disabling a goal affects current-period history behavior per implementation rules
