# Backend Users Spec

## Purpose

Define backend behavior for user profile retrieval and updates.

## Scope

- `GET /users/me`
- `PATCH /users/me`

## Business Rules

- all operations are strictly scoped to the authenticated user
- users cannot read or modify another user's profile
- updatable fields: `displayName`, reminder preferences (`reminderEnabled`, `reminderTime`)
- `GET /categories` returns shared category data available to all authenticated users

## Error Rules

- unauthenticated requests -> `401`
- invalid input -> `400`
- unexpected backend failure -> `500`
