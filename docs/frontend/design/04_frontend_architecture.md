# D_04. FRONTEND ARCHITECTURE

## 1. Tech Stack
- **Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: TailwindCSS 4 + shadcn-ui (Radix Primitives)
- **State Management**: 
  - **Server State**: React Query (TanStack Query) - *Recommended for API data*
  - **Client State**: Zustand (for Auth, UI State)
- **Routing**: React Router DOM v6+
- **Form**: React Hook Form + Zod
- **Icons**: Lucide React

## 2. Directory Structure (`src/`)

```txt
src/
├── assets/             # Static assets (images, fonts)
├── components/         # Shared UI Components
│   ├── ui/             # shadcn-ui primitives (Button, Input...)
│   ├── layout/         # Header, Footer, BottomNav
│   └── shared/         # Reusable app-specific components (e.g. DeedCard)
├── features/           # Feature-based modules
│   ├── auth/           # Login/Register forms, Auth guards
│   ├── deeds/          # DeedList, AddDeedForm, CheckInFlow
│   ├── stats/          # Charts, StreakDisplay
│   └── settings/       # Profile, Theme, Reminders
├── hooks/              # Custom hooks (e.g. useDebounce, useTheme)
├── lib/                # Utilities and configurations
│   ├── api.ts          # Axios instance & interceptors
│   ├── utils.ts        # Helper functions (cn, date formatting)
│   └── constants.ts    # App constants
├── pages/              # Route components (Lazy loaded)
│   ├── home.tsx
│   ├── history.tsx
│   ├── profile.tsx
│   └── auth/           # Login, Register pages
├── stores/             # Zustand stores
│   ├── useAuthStore.ts # Auth state (user, token)
│   └── useAppStore.ts  # Global UI state (modals, theme)
├── types/              # TypeScript interfaces
│   ├── api.ts          # API Response types
│   └── index.ts        # Domain models (User, Deed)
├── App.tsx             # Main App & Router Setup
└── main.tsx            # Entry point & Providers
```

## 3. State Management Strategy

### 3.1. Zustand (`useAuthStore`)
Used for synchronous client-state that needs to persist or be accessed globally.
- `user`: Current user object or null
- `token`: JWT token (persisted in localStorage)
- `isAuthenticated`: Derived boolean
- `login(token, user)`: Action to set state
- `logout()`: Clear state

### 3.2. React Query (Server State)
Used for all async data fetching.
- **Keys**: `['deeds', { filter }]`, `['stats']`, `['user']`
- **Mutations**: `useCreateDeed`, `useUpdateDeed` -> invalidateQueries(['deeds'])

## 4. Component Patterns

### 4.1. Container vs Presentational
- **Page Components** (`pages/home.tsx`): Fetch data, manage layout.
- **Feature Components** (`features/deeds/DeedList.tsx`): specialized logic.
- **UI Components** (`components/ui/button.tsx`): Pure dumb components.

### 4.2. Mobile-First Layout
- Use a `MobileLayout` wrapper for main pages.
- `BottomNavigation` is persistent on mobile views.
- `Modal/Drawer` used heavily for actions (Add Deed, Edit).

## 5. Routing Map

| Path           | Component      | Protected | Description                |
| -------------- | -------------- | --------- | -------------------------- |
| `/`            | `LandingPage`  | No        | Introduction               |
| `/login`       | `LoginPage`    | No        |                            |
| `/register`    | `RegisterPage` | No        |                            |
| `/app`         | `HomePage`     | Yes       | Dashboard / Quick Check-in |
| `/app/history` | `HistoryPage`  | Yes       | List of deeds              |
| `/app/stats`   | `StatsPage`    | Yes       | Statistics                 |
| `/app/profile` | `ProfilePage`  | Yes       | Settings                   |

## 6. Implementation Steps (Phase 0-1)

1. **Setup**: Install deps (`react-router-dom`, `lucide-react`, `clsx`).
2. **UI Lib**: Init shadcn-ui.
3. **Routing**: Setup `BrowserRouter` and Layouts.
4. **Auth**: Build Zustand store + Login UI.
5. **Core**: Build `DeedForm` and `DeedList` with Mock Data first.
```