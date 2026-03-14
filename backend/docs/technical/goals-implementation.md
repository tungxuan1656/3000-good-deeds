# Goals Implementation Guide

## Core Rule

Goal history must not be created retroactively for past periods.

## Main Functions

- `computeLocalPeriods(timestamp, timezone)`
- `ensureGoalHistoryForCurrentPeriod()`
- `updateGoalHistoryForPeriod()`
- `handleDeedCreate()` / `handleDeedDelete()` integration

## Endpoints

- `GET /goals`
- `POST /goals`
- `GET /goals/history`

## Data Model

Uses:
- `goals`
- `goal_history`
- `good_deeds` period fields

## Behavior Summary

- When goals are enabled, current period history may be created.
- Deed create/delete updates the relevant period counters.
- Changing target count syncs current period target values.

## Testing Focus

- current-period creation behavior
- no retroactive history creation
- deed integration updates
- pagination for history endpoint
