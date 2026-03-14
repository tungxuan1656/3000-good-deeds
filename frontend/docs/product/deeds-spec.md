# Deeds Feature Spec

## Goal

Allow users to record kind actions quickly and privately.

## User Stories

- record a new deed
- classify deed by body/speech/mind
- view deed history
- edit/delete incorrect entries

## Core Rules

- category is required
- deed is private by default
- creation time defaults to `now`, but past date input is supported
- no hard limit on entries, but UI may show soft guidance for extreme daily volume

## UX Notes

- creation should be fast and simple
- timeline order is newest-first
- entries are grouped by day

## Data Reference

See `../../../backend/docs/technical/database-schema.md` (`good_deeds`, `categories`, `users`).
