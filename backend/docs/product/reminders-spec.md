# Backend Reminders Spec

## Purpose

Define backend behavior for reminder settings and push subscription management.

## Scope

- user reminder settings read/update
- push key exposure
- subscription create/update/delete
- test-notification behavior

## Core Rules

- settings are user-scoped (`reminderEnabled`, `reminderTime`)
- subscription payload must include endpoint and keys (`p256dh`, `auth`)
- subscription operations are bound to authenticated user ownership

## Test Notification Rules

`POST /reminders/test` should fail when:
- reminder is disabled
- no active subscription exists
- VAPID configuration is missing

## Security Rules

- never expose private subscription internals beyond required response shape
- enforce ownership checks for subscription deletion
