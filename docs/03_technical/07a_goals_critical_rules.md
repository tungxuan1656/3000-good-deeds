# 🔒 GOALS: CRITICAL IMPLEMENTATION RULES

**Quick reference for developers implementing goals feature.**

---

## The Golden Rule

> **Hệ thống không tạo mới goal_history cho các chu kỳ đã trôi qua.**
> **Lịch sử mục tiêu chỉ được ghi nhận từ thời điểm người dùng chủ động bật mục tiêu.**

---

## Decision Tree: When to CREATE vs UPDATE goal_history

```
User adds/deletes deed
    ↓
Is there an ACTIVE goal?
    ↓ NO → Stop (do nothing)
    ↓ YES
    ↓
What period does the deed belong to?
    ↓
    ├─→ CURRENT period
    │       ↓
    │   Does goal_history exist for this period?
    │       ↓ NO  → CREATE goal_history
    │       ↓ YES → UPDATE goal_history
    │
    └─→ PAST period
            ↓
        Does goal_history exist for this period?
            ↓ NO  → DO NOTHING ❌
            ↓ YES → UPDATE goal_history ✅
```

---

## Implementation Table

| Scenario    | Period  | History Exists? | Action          |
| ----------- | ------- | --------------- | --------------- |
| Add deed    | Current | No              | CREATE + UPDATE |
| Add deed    | Current | Yes             | UPDATE          |
| Add deed    | Past    | No              | **DO NOTHING**  |
| Add deed    | Past    | Yes             | UPDATE          |
| Delete deed | Current | No              | CREATE + UPDATE |
| Delete deed | Current | Yes             | UPDATE          |
| Delete deed | Past    | No              | **DO NOTHING**  |
| Delete deed | Past    | Yes             | UPDATE          |

---

## Code Template

```typescript
async function handleDeedChange(deed: Deed, userId: string) {
  // 1. Get active goals
  const goals = await getActiveGoals(userId);
  if (!goals.length) return;
  
  // 2. Determine deed's period
  const deedPeriods = {
    week: deed.local_week,
    month: deed.local_month,
    year: deed.local_year,
  };
  
  // 3. Get current periods
  const currentPeriods = getCurrentPeriods(timezone);
  
  // 4. Process each goal
  for (const goal of goals) {
    const deedPeriod = getPeriodForGoalType(goal.type, deedPeriods);
    const currentPeriod = getPeriodForGoalType(goal.type, currentPeriods);
    
    // Check if current period
    const isCurrentPeriod = deedPeriod === currentPeriod;
    
    if (isCurrentPeriod) {
      // ✅ Current period: CREATE if needed, then UPDATE
      await ensureGoalHistory(goal, deedPeriod);
      await updateGoalHistory(goal, deedPeriod);
    } else {
      // ⚠️ Past period: only UPDATE if exists
      const historyExists = await checkHistoryExists(goal, deedPeriod);
      if (historyExists) {
        await updateGoalHistory(goal, deedPeriod);
      }
      // If not exists: DO NOTHING
    }
  }
}
```

---

## Common Mistakes to Avoid

### ❌ WRONG: Always creating history

```typescript
// BAD CODE - DO NOT DO THIS
async function handleDeed(deed: Deed) {
  const goal = getActiveGoal(deed.userId);
  const period = deed.local_week;
  
  // ❌ This will create history for past periods
  await ensureGoalHistory(goal, period);
  await updateCount(goal, period);
}
```

**Why wrong:** This creates goal_history retroactively, allowing users to "complete" goals with past data.

---

### ✅ CORRECT: Check period first

```typescript
// GOOD CODE - DO THIS
async function handleDeed(deed: Deed) {
  const goal = getActiveGoal(deed.userId);
  const deedPeriod = deed.local_week;
  const currentPeriod = getCurrentWeek();
  
  if (deedPeriod === currentPeriod) {
    // ✅ Current period: safe to create
    await ensureGoalHistory(goal, deedPeriod);
    await updateCount(goal, deedPeriod);
  } else {
    // ✅ Past period: only update if exists
    const exists = await historyExists(goal, deedPeriod);
    if (exists) {
      await updateCount(goal, deedPeriod);
    }
  }
}
```

---

## Testing Commands

```sql
-- Check if history was created for past period (should be 0)
SELECT COUNT(*) FROM goal_history 
WHERE user_id = 'test_user' 
  AND period_time < '2026-W06'
  AND created_at > [timestamp_when_goal_was_enabled];

-- Should return 0 if rule is enforced correctly
```

---

## Why This Rule Matters

### 1. Prevents Gaming
Without this rule:
- User enables goal today
- Imports 100 deeds from last month
- Goal is instantly "completed" → Bad UX

With this rule:
- Imported deeds are saved
- But don't count toward goals
- User must earn progress going forward

---

### 2. Honest Timeline
- Goal history = actual commitment period
- Not a retroactive filter
- Reflects when user was actually trying

---

### 3. Philosophical Alignment
Buddhist practice emphasizes:
- Present moment awareness
- Honest self-observation
- Not chasing achievements

This rule enforces those values at the system level.

---

## Exception: Milestone Goals

Milestone goals (`type = 'milestone'`) count ALL deeds, regardless of when they were added.

**Why?** Milestones represent total lifetime count, not periodic commitment.

```typescript
if (goal.type === 'milestone') {
  // Milestone: always update (counts all-time)
  await updateGoalHistory(goal, 'milestone_1');
} else {
  // Periodic goals: check current vs past
  // ... (follow rules above)
}
```

---

## Quick Reference: Function Responsibility

| Function              | Can CREATE history?         | Can UPDATE history?       |
| --------------------- | --------------------------- | ------------------------- |
| `ensureGoalHistory()` | ✅ Yes (current period only) | No                        |
| `updateGoalHistory()` | ❌ No                        | ✅ Yes (any period)        |
| `createGoal()`        | ✅ Yes (current period)      | No                        |
| `handleDeedChange()`  | Via `ensureGoalHistory()`   | Via `updateGoalHistory()` |

---

## Review Checklist Before Deployment

- [ ] `ensureGoalHistory()` is NEVER called for past periods
- [ ] Period comparison logic is correct (current vs past)
- [ ] Bulk import doesn't create retroactive history
- [ ] Editing past deed only updates if history exists
- [ ] Test cases for all 6 critical scenarios pass
- [ ] Milestone goals still count all deeds
- [ ] No SQL query creates history with `period_time < current_period`

---

## When in Doubt

**Ask yourself:** "Did this goal exist when this period was happening?"

- **Yes** → Update existing history ✅
- **No** → Do nothing ❌

Never create history for a period when the goal didn't exist.

---

**Last updated:** 2026-02-05
**Status:** Critical - Do not modify without architectural review
