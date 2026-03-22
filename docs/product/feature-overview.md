# 3000 Good Deeds - Unified Product Screen, Feature, and Component Specification

## 1) Purpose and Scope

This document is the single source of truth for the product scope across the system.

It defines:
- Screen inventory
- Feature list per screen
- Shared component library
- Core data object structures

This document is intentionally product-focused and implementation-ready, while avoiding UI style constraints.

Interface modes covered by this specification:
- Web version: sidebar-based navigation.
- Mobile responsive version: bottom-tab navigation.

---

## 2) Product-Level Decisions (Applied)

The following scope decisions are already applied in this spec:

1. Remove deed categorization by `Body / Speech / Mind` completely.
2. Remove meditation feature completely.
3. Replace the old Inner reflection screen with a new **Reflection Handbook** screen.
4. Random quotes and kindness suggestions are no longer standalone screens.
   They are reusable embedded components that can appear in multiple screens.
5. Stats do not include consecutive practice days (streak).
6. Terms of Use and Privacy Policy screens are temporarily out of scope.

---

## 3) Screen Inventory (System-Wide)

## 3.1 Authentication
1. Login Screen

## 3.2 Main App Screens
1. Home Screen
2. Timeline Screen
3. Reflection Handbook Screen
4. Goals Screen
5. Stats Screen
6. Settings Screen
7. More Screen (navigation/support hub)

---

## 4) Screen-by-Screen Specification

## 4.1 Login Screen

### Main features
- Sign in with email/password
- Sign up with email/password
- Forgot password flow
- Sign in with Google

### Screen components
- `AuthModeSelector` (Sign in / Sign up / Forgot password)
- `AuthForm` (email, password, confirm password when needed)
- `GoogleSignInAction`
- `AuthErrorNotice`
- `AuthSuccessNotice`
- `AppVersionInfo`

---

## 4.2 Home Screen

### Main features
- Daily overview
- Quick record action for a new kind deed
- Display today's deed entries
- Show optional supportive modules (embedded)

### Screen components
- `PageHeaderSection`
- `QuickCheckInCard`
- `TodayDeedListSection`
- `EmptyStateBlock` (when no deeds today)
- `RandomQuoteCard` (embedded component)
- `KindnessSuggestionCard` (embedded component)
- `ReminderSuggestionCard` (embedded when reminders are off)

---

## 4.3 Timeline Screen

### Main features
- View deed history in reverse chronological order
- Group entries by day
- Edit deed entry
- Delete deed entry
- Load more history

### Screen components
- `PageHeaderSection`
- `TimelineGroupList`
- `TimelineGroupHeader`
- `DeedItemCard`
- `DeedItemActionMenu` (edit/delete)
- `EditDeedDialog`
- `DeleteConfirmDialog`
- `LoadMoreAction`
- `SkeletonList`
- `EmptyStateBlock`

---

## 4.4 Reflection Handbook Screen

### Main features
- Create reflective journal entry
- Support journal modes:
  - Gratitude
  - Repentance
- View reflection history
- Delete reflection entry according to product rules
- Surface supportive embedded components (quote/suggestion)

### Screen components
- `PageHeaderSection`
- `ReflectionTypeSelector`
- `ReflectionEditor`
- `ReflectionImmutableNotice`
- `SaveReflectionAction`
- `ReflectionHistoryList`
- `ReflectionHistoryItem`
- `DeleteConfirmDialog`
- `RandomQuoteCard` (embedded)
- `KindnessSuggestionCard` (embedded)
- `SkeletonList`
- `EmptyStateBlock`

---

## 4.5 Goals Screen

### Main features
- Configure goals by period:
  - Weekly
  - Monthly
  - Yearly
- Enable/disable each goal
- Update target counts
- View goal history
- View progress per period

### Screen components
- `PageHeaderSection`
- `GoalSettingsCard`
- `GoalSettingRow`
- `GoalSettingControls`
- `SaveGoalsAction`
- `GoalHistorySection`
- `GoalHistoryItem`
- `SkeletonList`
- `EmptyStateBlock`

---

## 4.6 Stats Screen

### Main features
- View total deed count
- View period trends (weekly/monthly)
- View activity calendar
- Reflective, non-competitive metric presentation

### Screen components
- `PageHeaderSection`
- `StatsSummaryCard`
- `TrendSection`
- `ActivityCalendarCard`
- `PeriodNavigator`
- `SkeletonList`
- `EmptyStateBlock`

Note:
- Streak is intentionally excluded from this screen scope.

---

## 4.7 Settings Screen

### Main features
- View/edit profile basics (display name)
- Reminder settings (enable/disable, time)
- Test notification delivery
- Password change (for eligible auth providers)
- Sign out
- Delete account flow

### Screen components
- `PageHeaderSection`
- `AccountProfileCard`
- `NotificationSettingsCard`
- `PasswordSecurityCard`
- `SessionCard`
- `LogoutAction`
- `DeleteAccountCard`
- `DeleteConfirmDialog`

---

## 4.8 More Screen

### Main features
- Provide quick navigation to secondary app areas
- Provide compact access to account/settings actions

### Screen components
- `PageHeaderSection`
- `NavigationRowList`
- `NavigationRowItem`
- `LogoutAction`

---

## 5) Shared Component Library (Reusable Across Screens)

This section defines the shared building blocks for maintainability and reuse.

## 5.1 Layout & Navigation Shared Components
- `AppLayoutShell`
- `AppHeader`
- `HeaderBreadcrumbs`
- `AppSidebar`
- `BottomTabNavigation`
- `MainContainer`
- `MainColumn`
- `SideColumn`

## 5.2 Page Structure Shared Components
- `PageHeaderSection`
- `CardSection`
- `CardInlineSection`
- `InfoActionTrigger`
- `InfoDialog`

## 5.3 Feedback and State Shared Components
- `EmptyStateBlock`
- `SkeletonList`
- `ErrorBoundary`
- `ConfirmDialog`

## 5.4 Deed Logging Shared Components
- `CheckInComposer` (sheet/flow)
- `QuickCheckInCard`
- `MiniCheckInCard`
- `DeedItemCard`
- `EditDeedDialog`

## 5.5 Reflection Shared Components
- `RandomQuoteCard`
- `KindnessSuggestionCard`
- `ReflectionTypeSelector`
- `ReflectionEditor`
- `ReflectionHistoryItem`

## 5.6 Goal/Stats Shared Components
- `GoalSettingRow`
- `GoalHistoryItem`
- `StatsSummaryCard`
- `ActivityCalendarCard`
- `WeeklyRhythmCard`

## 5.7 Settings Shared Components
- `NotificationSettingsCard`
- `PasswordSecurityCard`
- `LogoutAction`
- `DeleteAccountCard`

Note:
- This shared library intentionally excludes low-level UI primitives (for example: `Input`, `Switch`, `Button`, etc.).
- This document focuses on reusable product-level and feature-level components only.

---

## 6) Embedded Feature Components (Cross-Screen)

These features are represented as reusable components, not standalone screens:

1. `RandomQuoteCard`
- Can appear in: Home, Timeline side section, Reflection Handbook, Goals, Stats.

2. `KindnessSuggestionCard`
- Can appear in: Home, Reflection Handbook, More, and optional side sections.

3. `ReminderSuggestionCard`
- Can appear in: Home or Settings context when reminders are disabled.

---

## 7) Core Data Object Structures

## 7.1 Kind Deed Object
- `id`: string
- `description`: string
- `labels`: string[] (optional user-defined labels)
- `performedAt`: datetime
- `createdAt`: datetime
- `updatedAt`: datetime

## 7.2 Reflection Entry Object
- `id`: string
- `type`: enum (`gratitude`, `repentance`)
- `content`: string
- `createdAt`: datetime
- `updatedAt`: datetime

## 7.3 Goal Configuration Object
- `type`: enum (`weekly`, `monthly`, `yearly`)
- `targetCount`: number
- `isEnabled`: boolean

## 7.4 Goal History Object
- `id`: string
- `type`: enum (`weekly`, `monthly`, `yearly`)
- `periodStartDate`: date
- `periodEndDate`: date
- `targetCount`: number
- `actualCount`: number
- `status`: enum (`completed`, `in-progress`, `not-completed`)
- `createdAt`: datetime

## 7.5 Stats Summary Object
- `totalDeeds`: number
- `periodTrend`: object
  - `weekly`: number[] or keyed values
  - `monthly`: number[] or keyed values
- `calendarActivity`: array
  - item fields: `date`, `count`

## 7.6 Reminder Settings Object
- `reminderEnabled`: boolean
- `reminderTime`: time string (HH:mm)
- `timezone`: string (optional)

## 7.7 User Profile Object
- `id`: string
- `email`: string
- `displayName`: string
- `provider`: enum (`password`, `google`, etc.)
- `createdAt`: datetime
- `updatedAt`: datetime

---

## 8) Screen-State Requirements (Mandatory for Every Screen)

Each screen must define and support:
1. Loading state
2. Empty state
3. Content/success state
4. Error state
5. Confirmation state for destructive actions (where applicable)

---

## 9) Final Scope Checklist

- [ ] Screen inventory is complete and aligned with this document
- [ ] Features are mapped clearly per screen
- [ ] Shared component list is used for decomposition and reuse
- [ ] Embedded components are reused instead of new duplicate screens
- [ ] Data objects include required fields for all major features
- [ ] No Body/Speech/Mind categorization remains in product scope
- [ ] Meditation feature is excluded from product scope
