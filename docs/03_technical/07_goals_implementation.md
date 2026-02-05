# 07. GOALS IMPLEMENTATION GUIDE

Hướng dẫn triển khai tính năng Goals & Goal History.

---

## 🔒 CRITICAL RULE: Goal History Creation

### The Golden Rule

> **Goal history is ONLY created when the goal is active during that period.**
> **The system NEVER creates goal_history for periods that have already passed.**

### Why This Rule Exists

1. **Goals are intentions, not filters**
   - A goal represents a commitment made at a specific point in time
   - It's not a retroactive statistical query
   
2. **Prevents artificial achievements**
   - Users cannot enable a goal and immediately "complete" it with past deeds
   - Maintains integrity of the progress tracking
   
3. **Honest timeline**
   - History reflects when the user was actually trying to achieve the goal
   - No rewriting of the past

### Implementation Logic

When adding/deleting a deed, the system must:

1. **Identify the deed's period** (using `local_week`, `local_month`, `local_year`)
2. **Determine if it's the current period**
3. **Apply the correct logic:**

| Scenario | Deed Period                      | Action                                      |
| -------- | -------------------------------- | ------------------------------------------- |
| A        | **Current period**               | CREATE history if not exists → UPDATE count |
| B        | **Past period** + history exists | UPDATE existing history only                |
| C        | **Past period** + NO history     | Do nothing (deed is personal record only)   |

### Pseudo-code

```typescript
function onDeedCreatedOrDeleted(deed) {
  const goal = getEnabledGoal(deed.user_id)
  if (!goal) return

  const deedPeriod = getPeriodTime(deed, goal.type)
  const currentPeriod = getCurrentPeriod(goal.type)

  if (deedPeriod === currentPeriod) {
    // Case A: Current period
    ensureGoalHistory(goal, deedPeriod)  // CREATE if not exists
    recomputeActualCount(goal, deedPeriod)
  } else {
    // Case B or C: Past period
    const history = findGoalHistory(goal.id, deedPeriod)
    if (history) {
      // Case B: History exists → update it
      recomputeActualCount(goal, deedPeriod)
    }
    // Case C: No history → do nothing
  }
}
```

### Examples

**Example 1: User enables goal this week, adds deed from last week**
- Last week had no active goal → no goal_history exists
- Adding deed from last week → **DO NOT CREATE** goal_history
- Deed is saved, but doesn't count toward any goal

**Example 2: User had goal active since last week, adds deed from last week**
- Last week already has goal_history (goal was active)
- Adding deed from last week → **UPDATE** existing goal_history
- `actual_count` increases, `completed` may change

**Example 3: User enables goal this week, adds deed this week**
- This week is current period
- Create goal_history if it doesn't exist
- Update `actual_count`

---

## 1. Database Migration

File: `backend/migrations/0004_add_goals_and_goal_history.sql`

Chạy migration:
```bash
cd backend
pnpm wrangler d1 execute 3000-good-deeds --local --file=./migrations/0004_add_goals_and_goal_history.sql
```

---

## 2. Backend Implementation

### 2.1. Helper Functions

File: `backend/src/handlers/goals.ts`

#### `computeLocalPeriods(timestamp: number, timezone: string)`
```typescript
function computeLocalPeriods(timestamp: number, timezone: string) {
  const date = new Date(timestamp);
  
  // Use Intl.DateTimeFormat for accurate timezone conversion
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  });
  
  const parts = formatter.formatToParts(date);
  const year = parts.find(p => p.type === 'year')!.value;
  const month = parts.find(p => p.type === 'month')!.value;
  
  // Week calculation: ISO 8601 week
  const localDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
  const dayNum = (localDate.getDay() + 6) % 7; // Monday = 0
  localDate.setDate(localDate.getDate() - dayNum + 3); // Thursday of current week
  const weekNum = Math.ceil((((localDate - new Date(localDate.getFullYear(), 0, 1)) / 86400000) + 1) / 7);
  
  return {
    local_week: `${year}-W${String(weekNum).padStart(2, '0')}`,
    local_month: `${year}-${month}`,
    local_year: year,
  };
}
```

#### `ensureGoalHistory(db, userId, type, periodTime, goalId, targetCount)`

⚠️ **CRITICAL: This function should ONLY be called for the CURRENT period.**

```typescript
async function ensureGoalHistory(
  db: D1Database,
  userId: string,
  type: string,
  periodTime: string,
  goalId: string,
  targetCount: number
) {
  // Check if history already exists
  const existing = await db
    .prepare('SELECT id FROM goal_history WHERE user_id = ? AND type = ? AND period_time = ?')
    .bind(userId, type, periodTime)
    .first();
  
  if (existing) return existing.id;
  
  // IMPORTANT: This function should NOT be called for past periods
  // It should only create history for the current period when goal is active
  
  // Calculate period boundaries
  const { startDate, endDate } = getPeriodBoundaries(type, periodTime);
  
  // Count actual deeds in this period
  const countQuery = type === 'milestone' 
    ? 'SELECT COUNT(*) as count FROM good_deeds WHERE user_id = ?'
    : `SELECT COUNT(*) as count FROM good_deeds WHERE user_id = ? AND local_${getColumnForType(type)} = ?`;
  
  const result = await db
    .prepare(countQuery)
    .bind(type === 'milestone' ? userId : userId, periodTime)
    .first();
  
  const actualCount = result?.count || 0;
  const completed = actualCount >= targetCount;
  
  // Insert new history record
  const historyId = ulid();
  await db
    .prepare(`
      INSERT INTO goal_history 
      (id, goal_id, user_id, type, period_time, target_count, actual_count, start_date, end_date, completed, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      historyId, goalId, userId, type, periodTime, 
      targetCount, actualCount, startDate, endDate || null, 
      completed ? 1 : 0, Date.now(), Date.now()
    )
    .run();
  
  return historyId;
}
```

#### `updateGoalHistory(db, userId, type, periodTime)`
```typescript
async function updateGoalHistory(
  db: D1Database,
  userId: string,
  type: string,
  periodTime: string
) {
  // Count current deeds for this period
  const countQuery = type === 'milestone'
    ? 'SELECT COUNT(*) as count FROM good_deeds WHERE user_id = ?'
    : `SELECT COUNT(*) as count FROM good_deeds WHERE user_id = ? AND local_${getColumnForType(type)} = ?`;
  
  const result = await db
    .prepare(countQuery)
    .bind(type === 'milestone' ? userId : userId, periodTime)
    .first();
  
  const actualCount = result?.count || 0;
  
  // Get target from history
  const history = await db
    .prepare('SELECT id, target_count FROM goal_history WHERE user_id = ? AND type = ? AND period_time = ?')
    .bind(userId, type, periodTime)
    .first();
  
  if (!history) return;
  
  const completed = actualCount >= history.target_count;
  
  // Update history
  await db
    .prepare('UPDATE goal_history SET actual_count = ?, completed = ?, updated_at = ? WHERE id = ?')
    .bind(actualCount, completed ? 1 : 0, Date.now(), history.id)
    .run();
  
  // If milestone completed, set end_date
  if (type === 'milestone' && completed && !history.end_date) {
    await db
      .prepare('UPDATE goal_history SET end_date = ? WHERE id = ?')
      .bind(Date.now(), history.id)
      .run();
  }
}
```

---

### 2.2. API Endpoints

#### `GET /goals`
```typescript
export async function getGoals(c: Context) {
  const userId = c.get('userId');
  const db = c.env.DB;
  
  const goals = await db
    .prepare(`
      SELECT g.*, 
        gh.period_time, gh.actual_count, gh.completed
      FROM goals g
      LEFT JOIN goal_history gh ON g.id = gh.goal_id 
        AND gh.period_time = (
          SELECT period_time FROM goal_history 
          WHERE goal_id = g.id 
          ORDER BY created_at DESC LIMIT 1
        )
      WHERE g.user_id = ?
      ORDER BY g.created_at DESC
    `)
    .bind(userId)
    .all();
  
  return c.json({
    success: true,
    data: goals.results.map(formatGoalResponse),
  });
}
```

#### `POST /goals`
```typescript
export async function createOrUpdateGoal(c: Context) {
  const userId = c.get('userId');
  const { type, targetCount, isEnabled = true } = await c.req.json();
  
  // Validation
  if (!['weekly', 'monthly', 'yearly', 'milestone'].includes(type)) {
    return c.json({ success: false, error: 'INVALID_TYPE' }, 400);
  }
  if (targetCount < 1) {
    return c.json({ success: false, error: 'INVALID_TARGET' }, 400);
  }
  
  const db = c.env.DB;
  const timezone = c.get('userTimezone') || 'Asia/Ho_Chi_Minh';
  
  // Check if goal exists
  const existing = await db
    .prepare('SELECT id FROM goals WHERE user_id = ? AND type = ?')
    .bind(userId, type)
    .first();
  
  let goalId;
  const now = Date.now();
  
  if (existing) {
    // Update existing goal
    goalId = existing.id;
    await db
      .prepare('UPDATE goals SET target_count = ?, is_enabled = ?, updated_at = ? WHERE id = ?')
      .bind(targetCount, isEnabled ? 1 : 0, now, goalId)
      .run();
  } else {
    // Create new goal
    goalId = ulid();
    await db
      .prepare(`
        INSERT INTO goals (id, user_id, type, target_count, is_enabled, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(goalId, userId, type, targetCount, isEnabled ? 1 : 0, now, now)
      .run();
  }
  
  // Create or update history for current period
  const periodTime = getCurrentPeriod(type, timezone);
  await ensureGoalHistory(db, userId, type, periodTime, goalId, targetCount);
  
  return c.json({
    success: true,
    data: { id: goalId, type, targetCount, isEnabled },
  }, existing ? 200 : 201);
}
```

#### `GET /goals/:id/history`
```typescript
export async function getGoalHistory(c: Context) {
  const userId = c.get('userId');
  const goalId = c.req.param('id');
  const limit = Math.min(parseInt(c.req.query('limit') || '10'), 50);
  const offset = parseInt(c.req.query('offset') || '0');
  
  const db = c.env.DB;
  
  // Verify goal ownership
  const goal = await db
    .prepare('SELECT id FROM goals WHERE id = ? AND user_id = ?')
    .bind(goalId, userId)
    .first();
  
  if (!goal) {
    return c.json({ success: false, error: 'NOT_FOUND' }, 404);
  }
  
  // Get history
  const history = await db
    .prepare(`
      SELECT * FROM goal_history 
      WHERE goal_id = ? 
      ORDER BY period_time DESC 
      LIMIT ? OFFSET ?
    `)
    .bind(goalId, limit, offset)
    .all();
  
  // Get total count
  const total = await db
    .prepare('SELECT COUNT(*) as count FROM goal_history WHERE goal_id = ?')
    .bind(goalId)
    .first();
  
  return c.json({
    success: true,
    data: history.results.map(formatHistoryResponse),
    pagination: {
      total: total?.count || 0,
      limit,
      offset,
    },
  });
}
```

---

### 2.3. Integration with Deeds

File: `backend/src/handlers/deeds.ts`

🔒 **CRITICAL IMPLEMENTATION: Distinguish between current and past periods**

```typescript
export async function createDeed(c: Context) {
  // ... existing code ...
  
  const timezone = user.timezone || 'Asia/Ho_Chi_Minh';
  const periods = computeLocalPeriods(performedAt, timezone);
  
  // Insert deed with local periods
  await db.prepare(`
    INSERT INTO good_deeds 
    (id, user_id, category_code, description, performed_at, local_date, local_week, local_month, local_year, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    deedId, userId, categoryCode, description, performedAt,
    periods.local_date, periods.local_week, periods.local_month, periods.local_year,
    now, now
  ).run();
  
  // Update all active goal histories
  const activeGoals = await db
    .prepare('SELECT id, type, target_count FROM goals WHERE user_id = ? AND is_enabled = 1')
    .bind(userId)
    .all();
  
  for (const goal of activeGoals.results) {
    const periodTime = goal.type === 'milestone' 
      ? 'milestone_1' 
      : periods[`local_${getColumnForType(goal.type)}`];
    
    // Determine if this is the current period
    const currentPeriodTime = getCurrentPeriod(goal.type, timezone);
    const isCurrentPeriod = periodTime === currentPeriodTime;
    
    if (isCurrentPeriod) {
      // Case A: Current period - CREATE history if not exists, then UPDATE
      await ensureGoalHistory(db, userId, goal.type, periodTime, goal.id, goal.target_count);
      await updateGoalHistory(db, userId, goal.type, periodTime);
    } else {
      // Case B: Past period - ONLY UPDATE if history already exists
      const existingHistory = await db
        .prepare('SELECT id FROM goal_history WHERE user_id = ? AND type = ? AND period_time = ?')
        .bind(userId, goal.type, periodTime)
        .first();
      
      if (existingHistory) {
        // History exists from when goal was active → update it
        await updateGoalHistory(db, userId, goal.type, periodTime);
      }
      // If no history exists → do nothing (deed is personal record only)
    }
  }
  
  // ... existing code ...
}

// Helper function to get current period
function getCurrentPeriod(type: string, timezone: string): string {
  const now = Date.now();
  const periods = computeLocalPeriods(now, timezone);
  
  if (type === 'milestone') return 'milestone_1';
  return periods[`local_${getColumnForType(type)}`];
}

function getColumnForType(type: string): string {
  switch (type) {
    case 'weekly': return 'week';
    case 'monthly': return 'month';
    case 'yearly': return 'year';
    case 'milestone': return 'milestone';
    default: throw new Error('Invalid goal type');
  }
}
```

---

## 3. Frontend Implementation

### 3.1. API Client

File: `frontend/src/api/goals.ts`

```typescript
export interface Goal {
  id: string;
  type: 'weekly' | 'monthly' | 'yearly' | 'milestone';
  targetCount: number;
  isEnabled: boolean;
  currentProgress?: {
    periodTime: string;
    actualCount: number;
    completed: boolean;
  };
  createdAt: number;
  updatedAt: number;
}

export interface GoalHistory {
  id: string;
  goalId: string;
  type: string;
  periodTime: string;
  targetCount: number;
  actualCount: number;
  startDate: number;
  endDate: number | null;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
}

export const goalsApi = {
  getGoals: () => 
    apiClient.get<Goal[]>('/goals'),
  
  createGoal: (data: { type: string; targetCount: number; isEnabled?: boolean }) =>
    apiClient.post<Goal>('/goals', data),
  
  updateGoal: (id: string, data: { targetCount?: number; isEnabled?: boolean }) =>
    apiClient.patch<Goal>(`/goals/${id}`, data),
  
  deleteGoal: (id: string) =>
    apiClient.delete(`/goals/${id}`),
  
  getGoalHistory: (id: string, params?: { limit?: number; offset?: number }) =>
    apiClient.get<{ data: GoalHistory[]; pagination: any }>(`/goals/${id}/history`, { params }),
};
```

### 3.2. React Hooks

File: `frontend/src/hooks/api/use-goals.ts`

```typescript
export const useGoals = () => {
  return useQuery({
    queryKey: ['goals'],
    queryFn: goalsApi.getGoals,
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: goalsApi.createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });
};

export const useGoalHistory = (goalId: string) => {
  return useQuery({
    queryKey: ['goals', goalId, 'history'],
    queryFn: () => goalsApi.getGoalHistory(goalId),
    enabled: !!goalId,
  });
};
```

---

## 4. Testing Checklist

### Backend - Core Functionality
- [ ] Migration runs successfully
- [ ] Create goal with valid type
- [ ] Reject invalid goal types
- [ ] UNIQUE constraint on (user_id, type) works
- [ ] Goal history created when goal is enabled
- [ ] Changing target only affects current period
- [ ] Disabling goal stops creating new history
- [ ] Milestone completes and sets end_date
- [ ] GET /goals returns current progress
- [ ] GET /goals/:id/history returns sorted records

### 🔒 Backend - Critical: Retroactive History Prevention

#### Test Case 1: Add deed to past period without goal history
**Given:**
- User enables weekly goal on 2026-W06 (this week)
- No goal_history exists for 2026-W05 (last week)

**When:**
- User adds a deed with `performed_at` in 2026-W05

**Then:**
- ✅ Deed is created successfully
- ✅ NO goal_history is created for 2026-W05
- ✅ Only current week (2026-W06) has goal_history

**SQL Verification:**
```sql
SELECT * FROM goal_history WHERE user_id = ? AND period_time = '2026-W05';
-- Should return 0 rows
```

---

#### Test Case 2: Add deed to past period WITH existing goal history
**Given:**
- User enabled weekly goal on 2026-W05 (last week)
- goal_history exists for 2026-W05 with `actual_count = 5`

**When:**
- User adds a deed with `performed_at` in 2026-W05

**Then:**
- ✅ Deed is created successfully
- ✅ Existing goal_history for 2026-W05 is updated
- ✅ `actual_count` increases to 6
- ✅ `completed` is recalculated based on target

**SQL Verification:**
```sql
SELECT actual_count FROM goal_history WHERE user_id = ? AND period_time = '2026-W05';
-- Should return 6
```

---

#### Test Case 3: Delete deed from past period without goal history
**Given:**
- User has a deed from 2026-W05 (last week)
- No goal_history exists for 2026-W05 (goal was enabled later)

**When:**
- User deletes the deed

**Then:**
- ✅ Deed is deleted successfully
- ✅ NO goal_history is created for 2026-W05
- ✅ No error occurs

---

#### Test Case 4: Add deed to current period
**Given:**
- User has weekly goal enabled
- Current period is 2026-W06

**When:**
- User adds a deed with `performed_at` in 2026-W06

**Then:**
- ✅ Deed is created successfully
- ✅ goal_history for 2026-W06 is created if not exists
- ✅ `actual_count` is updated correctly

---

#### Test Case 5: Enable goal then import 100 past deeds
**Given:**
- User enables weekly goal on 2026-W06
- User imports 100 deeds from past 3 months

**When:**
- Bulk import completes

**Then:**
- ✅ All 100 deeds are saved
- ✅ Only 2026-W06 has goal_history
- ✅ Past weeks have NO goal_history created
- ✅ User cannot "cheat" by importing past data

---

#### Test Case 6: Goal was active for 2 weeks, then disabled, then re-enabled
**Given:**
- Goal active 2026-W04 and 2026-W05 (has history for both)
- Goal disabled on 2026-W06
- Goal re-enabled on 2026-W07

**When:**
- User adds deed for 2026-W05 (past, but had goal active)
- User adds deed for 2026-W06 (past, no goal active)

**Then:**
- ✅ Deed for 2026-W05 updates existing history
- ✅ Deed for 2026-W06 does NOT create history
- ✅ Current week 2026-W07 gets new history

---

### Frontend
- [ ] Goals page displays all active goals
- [ ] Progress bars show correct percentage
- [ ] History list shows past periods
- [ ] Create goal form works
- [ ] Edit goal form works
- [ ] Toggle enable/disable works
- [ ] Milestone shows total progress
- [ ] Past deeds do not affect goal if goal wasn't active

---

## 5. Deployment Steps

1. **Run migration on local D1:**
   ```bash
   pnpm wrangler d1 execute 3000-good-deeds --local --file=./migrations/0004_add_goals_and_goal_history.sql
   ```

2. **Test locally:**
   ```bash
   pnpm dev
   ```

3. **Run migration on production D1:**
   ```bash
   pnpm wrangler d1 execute 3000-good-deeds --remote --file=./migrations/0004_add_goals_and_goal_history.sql
   ```

4. **Deploy backend:**
   ```bash
   pnpm deploy
   ```

5. **Deploy frontend:**
   ```bash
   cd ../frontend
   pnpm build
   pnpm deploy
   ```

---

## 6. Future Enhancements

- [ ] Goal templates (VD: "Người mới bắt đầu: 3/ngày")
- [ ] Goal sharing (anonymous progress sharing)
- [ ] Goal insights (VD: "Bạn thường hoàn thành tốt vào cuối tuần")
- [ ] Multiple milestones (chained milestones)
- [ ] Category-specific goals (VD: "5 lời ái ngữ/tuần")
