# D_05. FRONTEND STATE MANAGEMENT STRATEGY

## 1. Mục đích

Tài liệu này định nghĩa:
- State management architecture cho frontend
- Khi nào dùng Zustand vs React Query
- State flow patterns
- Best practices

---

## 2. State Classification

### 2.1. Types of State

```
┌─────────────────────────────────────────────┐
│           Application State                 │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼────────┐    ┌─────────▼──────┐
│  Client State  │    │  Server State   │
│   (Zustand)    │    │ (React Query)   │
└────────────────┘    └─────────────────┘
        │                       │
   ┌────┴────┐           ┌──────┴──────┐
   │         │           │             │
┌──▼──┐ ┌───▼───┐  ┌────▼────┐ ┌──────▼──────┐
│Auth │ │  UI   │  │ Deeds   │ │ Stats       │
│State│ │ State │  │ (cache) │ │ (cache)     │
└─────┘ └───────┘  └─────────┘ └─────────────┘
```

### 2.2. Decision Tree

```
Is this data from API?
├─ YES → Use React Query
│   └─ Example: deeds, stats, user profile
│
└─ NO → Is it shared across components?
    ├─ YES → Use Zustand
    │   └─ Example: auth token, theme, modal state
    │
    └─ NO → Use local component state (useState)
        └─ Example: form input, toggle state
```

---

## 3. Zustand (Client State)

### 3.1. Auth Store

**`src/stores/useAuthStore.ts`:**
```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  displayName: string
  avatarUrl?: string
}

interface AuthState {
  // State
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  
  // Computed
  isAuthenticated: boolean
  
  // Actions
  login: (accessToken: string, refreshToken: string, user: User) => void
  logout: () => void
  setToken: (accessToken: string) => void
  updateUser: (user: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      
      // Computed
      get isAuthenticated() {
        return !!get().accessToken && !!get().user
      },
      
      // Actions
      login: (accessToken, refreshToken, user) => {
        set({ accessToken, refreshToken, user })
      },
      
      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null })
        // Clear React Query cache
        queryClient.clear()
      },
      
      setToken: (accessToken) => {
        set({ accessToken })
      },
      
      updateUser: (userUpdate) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userUpdate } : null
        }))
      }
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        // Only persist these fields
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken
      })
    }
  )
)

// Selectors (for performance)
export const selectUser = (state: AuthState) => state.user
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated
export const selectToken = (state: AuthState) => state.accessToken
```

**Usage:**
```tsx
function Header() {
  const user = useAuthStore(selectUser)
  const logout = useAuthStore((state) => state.logout)
  
  if (!user) return <LoginButton />
  
  return (
    <div>
      <span>{user.displayName}</span>
      <button onClick={logout}>Đăng xuất</button>
    </div>
  )
}
```

### 3.2. UI Store

**`src/stores/useUIStore.ts`:**
```typescript
import { create } from 'zustand'

interface UIState {
  // Modal state
  isAddDeedModalOpen: boolean
  isEditDeedModalOpen: boolean
  editingDeedId: string | null
  
  // Theme
  theme: 'light' | 'dark' | 'system'
  
  // Mobile menu
  isMobileMenuOpen: boolean
  
  // Actions
  openAddDeedModal: () => void
  closeAddDeedModal: () => void
  openEditDeedModal: (deedId: string) => void
  closeEditDeedModal: () => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
}

export const useUIStore = create<UIState>()((set) => ({
  // Initial state
  isAddDeedModalOpen: false,
  isEditDeedModalOpen: false,
  editingDeedId: null,
  theme: 'system',
  isMobileMenuOpen: false,
  
  // Actions
  openAddDeedModal: () => set({ isAddDeedModalOpen: true }),
  closeAddDeedModal: () => set({ isAddDeedModalOpen: false }),
  
  openEditDeedModal: (deedId) => set({ 
    isEditDeedModalOpen: true, 
    editingDeedId: deedId 
  }),
  closeEditDeedModal: () => set({ 
    isEditDeedModalOpen: false, 
    editingDeedId: null 
  }),
  
  setTheme: (theme) => {
    set({ theme })
    // Apply theme to document
    document.documentElement.classList.toggle('dark', 
      theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    )
  },
  
  toggleMobileMenu: () => set((state) => ({ 
    isMobileMenuOpen: !state.isMobileMenuOpen 
  })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false })
}))
```

---

## 4. React Query (Server State)

### 4.1. Query Client Setup

**`src/lib/queryClient.ts`:**
```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30,   // 30 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true
    },
    mutations: {
      retry: 0
    }
  }
})
```

**`src/main.tsx`:**
```tsx
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './lib/queryClient'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
)
```

### 4.2. Query Hooks

**`src/features/deeds/hooks/useDeedsQuery.ts`:**
```typescript
import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Deed, PaginatedResponse } from '@/types'

interface DeedsFilters {
  from?: number
  to?: number
  categoryId?: string
}

// Simple query
export function useDeedsQuery(filters?: DeedsFilters) {
  return useQuery({
    queryKey: ['deeds', filters],
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Deed>>('/deeds', {
        params: filters
      })
      return data
    },
    staleTime: 1000 * 60 * 2 // 2 minutes (deeds change frequently)
  })
}

// Infinite scroll query
export function useDeedsInfiniteQuery(filters?: DeedsFilters) {
  return useInfiniteQuery({
    queryKey: ['deeds', 'infinite', filters],
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<PaginatedResponse<Deed>>('/deeds', {
        params: {
          ...filters,
          cursor: pageParam,
          limit: 20
        }
      })
      return data
    },
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore 
        ? lastPage.pagination.nextCursor 
        : undefined
    },
    initialPageParam: undefined,
    staleTime: 1000 * 60 * 2
  })
}

// Single deed query
export function useDeedQuery(deedId: string) {
  return useQuery({
    queryKey: ['deeds', deedId],
    queryFn: async () => {
      const { data } = await api.get<Deed>(`/deeds/${deedId}`)
      return data
    },
    enabled: !!deedId // Only run if deedId exists
  })
}
```

### 4.3. Mutation Hooks

**`src/features/deeds/hooks/useDeedMutations.ts`:**
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Deed } from '@/types'
import { toast } from 'sonner'

interface CreateDeedInput {
  categoryId: string
  description?: string
  performedAt: number
  isPrivate?: boolean
}

export function useCreateDeed() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (input: CreateDeedInput) => {
      const { data } = await api.post<{ id: string }>('/deeds', input)
      return data
    },
    onSuccess: () => {
      // Invalidate and refetch deeds list
      queryClient.invalidateQueries({ queryKey: ['deeds'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      toast.success('Đã ghi nhận việc thiện')
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Có lỗi xảy ra'
      toast.error(message)
    }
  })
}

export function useUpdateDeed() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateDeedInput> }) => {
      await api.put(`/deeds/${id}`, data)
    },
    onSuccess: (_, variables) => {
      // Invalidate specific deed and list
      queryClient.invalidateQueries({ queryKey: ['deeds', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['deeds'] })
      toast.success('Đã cập nhật')
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Không thể cập nhật'
      toast.error(message)
    }
  })
}

export function useDeleteDeed() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (deedId: string) => {
      await api.delete(`/deeds/${deedId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deeds'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      toast.success('Đã xoá')
    },
    onError: (error: any) => {
      const message = error.response?.data?.error?.message || 'Không thể xoá'
      toast.error(message)
    }
  })
}
```

**Usage:**
```tsx
function AddDeedForm() {
  const createDeed = useCreateDeed()
  const closeModal = useUIStore((state) => state.closeAddDeedModal)
  
  const handleSubmit = async (data: CreateDeedInput) => {
    await createDeed.mutateAsync(data)
    closeModal()
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={createDeed.isPending}>
        {createDeed.isPending ? 'Đang lưu...' : 'Lưu'}
      </button>
    </form>
  )
}
```

### 4.4. Optimistic Updates

**Advanced: Update UI before server responds:**

```typescript
export function useUpdateDeedOptimistic() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Deed> }) => {
      await api.put(`/deeds/${id}`, data)
    },
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['deeds'] })
      
      // Snapshot previous value
      const previousDeeds = queryClient.getQueryData(['deeds'])
      
      // Optimistically update
      queryClient.setQueryData(['deeds'], (old: any) => {
        if (!old) return old
        return {
          ...old,
          data: old.data.map((deed: Deed) =>
            deed.id === id ? { ...deed, ...data } : deed
          )
        }
      })
      
      // Return context with snapshot
      return { previousDeeds }
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousDeeds) {
        queryClient.setQueryData(['deeds'], context.previousDeeds)
      }
      toast.error('Cập nhật thất bại')
    },
    onSettled: () => {
      // Refetch to ensure sync with server
      queryClient.invalidateQueries({ queryKey: ['deeds'] })
    }
  })
}
```

---

## 5. State Flow Examples

### 5.1. Login Flow

```
User clicks "Login with Google"
          │
          ▼
Google OAuth redirects back with code
          │
          ▼
Frontend calls API: POST /auth/google
          │
          ▼
API returns { accessToken, refreshToken, user }
          │
          ▼
Save to Zustand: authStore.login(...)
          │
          ├─→ Persisted to localStorage
          │
          ▼
Redirect to /app
          │
          ▼
React Query starts fetching user data
```

### 5.2. Create Deed Flow

```
User fills form, clicks Submit
          │
          ▼
Call mutation: createDeed.mutate(data)
          │
          ├─→ POST /api/v1/deeds
          │
          ▼
On success:
  ├─→ Invalidate ['deeds'] query
  ├─→ Invalidate ['stats'] query
  ├─→ Show toast notification
  └─→ Close modal (UIStore)
          │
          ▼
React Query auto-refetches deeds list
          │
          ▼
UI updates with new deed
```

### 5.3. Token Refresh Flow

```
API request fails with 401 TOKEN_EXPIRED
          │
          ▼
Axios interceptor catches error
          │
          ▼
Call POST /auth/refresh with refreshToken
          │
          ├─→ Success: Get new accessToken
          │   ├─→ Update Zustand: authStore.setToken(newToken)
          │   └─→ Retry original request
          │
          └─→ Failure: Refresh token invalid/expired
              ├─→ Clear Zustand: authStore.logout()
              ├─→ Clear React Query cache
              └─→ Redirect to /login
```

---

## 6. Query Key Conventions

### 6.1. Naming Pattern

```typescript
// Pattern: [resource, ...filters, ...identifiers]

// Examples:
['deeds'] // All deeds (base)
['deeds', { from: ..., to: ... }] // Filtered deeds
['deeds', 'deed_123'] // Single deed
['deeds', 'infinite', { ... }] // Infinite query

['stats'] // Stats summary
['stats', { from: ..., to: ... }] // Stats for date range

['goals'] // All goals
['goals', 'goal_123'] // Single goal

['achievements'] // User achievements
['achievements', 'definitions'] // Achievement definitions

['categories'] // Categories (rarely invalidated)

['users', 'me'] // Current user profile
```

### 6.2. Invalidation Strategy

```typescript
// When deed is created/updated/deleted:
queryClient.invalidateQueries({ queryKey: ['deeds'] })
queryClient.invalidateQueries({ queryKey: ['stats'] })

// When goal is created/updated:
queryClient.invalidateQueries({ queryKey: ['goals'] })

// When user profile is updated:
queryClient.invalidateQueries({ queryKey: ['users', 'me'] })
```

---

## 7. Performance Optimization

### 7.1. Selective Re-renders (Zustand)

```tsx
// Bad ❌ - re-renders on any auth state change
const { user, accessToken, isAuthenticated } = useAuthStore()

// Good ✅ - only re-renders when user changes
const user = useAuthStore(selectUser)

// Even better ✅ - only re-renders when displayName changes
const displayName = useAuthStore((state) => state.user?.displayName)
```

### 7.2. Query Stale Time

```typescript
// Rarely changes → long stale time
useQuery({
  queryKey: ['categories'],
  queryFn: fetchCategories,
  staleTime: 1000 * 60 * 60 // 1 hour
})

// Changes frequently → short stale time
useQuery({
  queryKey: ['deeds'],
  queryFn: fetchDeeds,
  staleTime: 1000 * 60 * 2 // 2 minutes
})
```

### 7.3. Prefetching

```typescript
// Prefetch next page on hover
function DeedsHistory() {
  const queryClient = useQueryClient()
  const { data, hasNextPage, fetchNextPage } = useDeedsInfiniteQuery()
  
  const prefetchNext = () => {
    if (hasNextPage) {
      fetchNextPage()
    }
  }
  
  return (
    <div>
      {/* Render deeds */}
      {hasNextPage && (
        <button 
          onClick={fetchNextPage}
          onMouseEnter={prefetchNext} // Prefetch on hover
        >
          Load More
        </button>
      )}
    </div>
  )
}
```

---

## 8. Error Handling

### 8.1. Query Error Boundaries

**`src/components/ErrorBoundary.tsx`:**
```tsx
import { QueryErrorResetBoundary } from '@tanstack/react-query'
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary'

export function QueryErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ReactErrorBoundary
          onReset={reset}
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div>
              <h2>Đã xảy ra lỗi</h2>
              <pre>{error.message}</pre>
              <button onClick={resetErrorBoundary}>Thử lại</button>
            </div>
          )}
        >
          {children}
        </ReactErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  )
}
```

### 8.2. Global Error Handler

```tsx
// src/main.tsx
import { QueryCache } from '@tanstack/react-query'

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any) => {
      // Global error handling
      if (error.response?.status === 401) {
        // Already handled by axios interceptor
        return
      }
      
      toast.error(error.response?.data?.error?.message || 'Có lỗi xảy ra')
    }
  })
})
```

---

## 9. Devtools

### 9.1. React Query Devtools

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### 9.2. Zustand Devtools

```typescript
import { devtools } from 'zustand/middleware'

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        // ... state
      }),
      { name: 'auth-storage' }
    ),
    { name: 'AuthStore' }
  )
)
```

---

## 10. Testing State

### 10.1. Testing Zustand

```typescript
import { renderHook, act } from '@testing-library/react'
import { useAuthStore } from './useAuthStore'

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, accessToken: null, refreshToken: null })
  })
  
  it('should login', () => {
    const { result } = renderHook(() => useAuthStore())
    
    act(() => {
      result.current.login('token123', 'refresh123', {
        id: 'user_1',
        email: 'test@example.com',
        displayName: 'Test'
      })
    })
    
    expect(result.current.user?.email).toBe('test@example.com')
    expect(result.current.isAuthenticated).toBe(true)
  })
  
  it('should logout', () => {
    const { result } = renderHook(() => useAuthStore())
    
    // Login first
    act(() => {
      result.current.login('token', 'refresh', mockUser)
    })
    
    // Then logout
    act(() => {
      result.current.logout()
    })
    
    expect(result.current.user).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })
})
```

### 10.2. Testing React Query

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import { useDeedsQuery } from './useDeedsQuery'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useDeedsQuery', () => {
  it('should fetch deeds', async () => {
    const { result } = renderHook(() => useDeedsQuery(), {
      wrapper: createWrapper()
    })
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.data).toBeDefined()
  })
})
```

---

## 11. Kết luận

State management strategy này đảm bảo:
- ✅ Clear separation of concerns (client vs server state)
- ✅ Optimized re-renders
- ✅ Automatic caching & refetching
- ✅ Type-safe state access
- ✅ Easy testing

**Key principles:**
- Use React Query for server state (API data)
- Use Zustand for client state (auth, UI)
- Use local useState for component-specific state
- Keep query keys consistent and hierarchical
- Invalidate queries after mutations
