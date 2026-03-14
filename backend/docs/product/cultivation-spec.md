# Backend Cultivation Spec

## Purpose

Define backend behavior for wisdom quotes and random acts of kindness suggestions.

## Scope

- `GET /cultivation/quotes/random`
- `GET /cultivation/acts/random`
- `GET /cultivation/acts/random-list`

## Business Rules

- content is read-only and not user-scoped
- records are randomly selected from the `dharma_quotes` and `random_acts` tables
- endpoints require authentication
- no user-specific state is modified or stored by cultivation requests

## Error Rules

- unauthenticated requests -> `401`
- unexpected backend failure -> `500`
