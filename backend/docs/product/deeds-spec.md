# Backend Deeds Spec

## Purpose

Define backend behavior for deed creation, retrieval, update, and deletion.

## Scope

- ownership enforcement
- pagination and filtering
- period recalculation for goal-history integration

## Business Rules

- every deed is user-scoped and private
- update/delete must validate ownership
- list responses are ordered by `performedAt DESC, id DESC`
- pagination cursor format: `<performedAt>_<id>`

## Integration Rules

When deed periods change (create, delete, or performedAt update):
- backend must synchronize related goal-history counters
- backend must not create retroactive goal history for past periods

## Error Rules

- invalid input -> `400`
- missing/unauthorized resource access -> `404` or `403` depending on context
- unexpected backend failure -> `500`
