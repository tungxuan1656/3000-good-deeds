# Profile and Settings Spec

## Goal

Enable users to manage account identity and personal settings safely.

## User Needs

- view current account identity
- update display name
- manage reminder preferences
- logout
- delete account

## Rules

- Firebase handles identity authentication.
- Backend stores business profile and settings.
- password change only for password-based providers.
- account deletion must be explicit and confirmed.
