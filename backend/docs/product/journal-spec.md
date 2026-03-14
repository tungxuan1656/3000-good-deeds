# Backend Journal Spec

## Purpose

Define backend behavior for private reflective journal entries.

## Modes

- `repentance`
- `gratitude`

## Core Rules

- entries are private and user-scoped
- type validation is mandatory for read/write operations
- cursor pagination is supported for `/journal/entries`
- cursor format: `<createdAt>_<id>`

## Delete Window Rule

- entries can be deleted only within 15 minutes after creation
- attempts beyond the window return `403`

## Compatibility Rule

- `POST /journal` remains as legacy-compatible alias to entry creation behavior
