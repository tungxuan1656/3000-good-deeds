# D_06. PWA & OFFLINE STRATEGY

## 1. Mục đích

Tài liệu này định nghĩa:
- Progressive Web App (PWA) implementation
- Offline-first strategy
- Service Worker configuration
- Cache strategies
- Background sync

---

## 2. Tại sao PWA?

### 2.1. Benefits cho "3000 Việc Thiện"

- **Installable:** Users có thể "cài" app lên home screen
- **Offline access:** Ghi nhận việc thiện ngay cả khi offline
- **Fast loading:** Cache assets → load nhanh
- **Native feel:** Full-screen, no browser UI
- **Push notifications:** Nhắc nhở (future)

### 2.2. Core Requirements

- ✅ HTTPS (Cloudflare Pages provides)
- ✅ Service Worker
- ✅ Web App Manifest
- ✅ Responsive design (already mobile-first)

---

## 3. Setup PWA với Vite

### 3.1. Install vite-plugin-pwa

```bash
cd frontend
pnpm add -D vite-plugin-pwa
```

### 3.2. Configure Vite

**`vite.config.ts`:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: '3000 Việc Thiện',
        short_name: '3000 Thiện',
        description: 'Ứng dụng ghi nhận việc thiện mỗi ngày',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        categories: ['lifestyle', 'health'],
        shortcuts: [
          {
            name: 'Ghi nhận việc thiện',
            short_name: 'Ghi nhận',
            description: 'Nhanh chóng ghi nhận việc thiện',
            url: '/app?action=add-deed',
            icons: [{ src: 'pwa-192x192.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            // Cache API responses (Network First strategy)
            urlPattern: ({ url }) => url.pathname.startsWith('/api/v1'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              networkTimeoutSeconds: 10,
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            // Cache images (Cache First strategy)
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true // Enable in dev for testing
      }
    })
  ]
})
```

---

## 4. Cache Strategies

### 4.1. Strategy Selection

```
┌─────────────────────────────────────────┐
│        Cache Strategy Decision          │
└─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
   Static Assets          API Responses
        │                       │
   Cache First           Network First
        │                       │
   - HTML                - Deeds
   - CSS                 - Stats
   - JS bundles          - User data
   - Images
```

### 4.2. Detailed Strategies

#### Cache First (Static Assets)
```
1. Check cache
   ├─ Found → Return from cache
   └─ Not found → Fetch from network
                 └─ Save to cache
                 └─ Return
```

**Use for:**
- HTML, CSS, JS bundles
- Images, fonts
- Icons

#### Network First (API Data)
```
1. Try network (with timeout)
   ├─ Success → Update cache → Return
   └─ Fail/Timeout → Check cache
                    ├─ Found → Return stale data
                    └─ Not found → Error
```

**Use for:**
- User deeds (can work offline with stale data)
- Stats (stale is better than nothing)
- Categories (rarely changes)

#### Network Only (Auth)
```
1. Always fetch from network
   └─ Never cache
```

**Use for:**
- Login/logout
- Token refresh
- Sensitive operations

---

## 5. Offline Detection

### 5.1. Hook: useOnlineStatus

**`src/hooks/useOnlineStatus.ts`:**
```typescript
import { useState, useEffect } from 'react'

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
  
  return isOnline
}
```

### 5.2. Offline Banner Component

**`src/components/OfflineBanner.tsx`:**
```tsx
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { WifiOff } from 'lucide-react'

export function OfflineBanner() {
  const isOnline = useOnlineStatus()
  
  if (isOnline) return null
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white px-4 py-2 text-center">
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="w-4 h-4" />
        <span className="text-sm">
          Bạn đang offline. Dữ liệu sẽ được đồng bộ khi có kết nối.
        </span>
      </div>
    </div>
  )
}
```

---

## 6. Offline Data Persistence

### 6.1. IndexedDB for Pending Actions

**Install Dexie (IndexedDB wrapper):**
```bash
pnpm add dexie
```

**`src/lib/db.ts`:**
```typescript
import Dexie, { Table } from 'dexie'

export interface PendingAction {
  id?: number
  type: 'create_deed' | 'update_deed' | 'delete_deed'
  payload: any
  timestamp: number
  synced: boolean
}

class GoodDeedsDB extends Dexie {
  pendingActions!: Table<PendingAction, number>
  
  constructor() {
    super('GoodDeedsDB')
    this.version(1).stores({
      pendingActions: '++id, type, timestamp, synced'
    })
  }
}

export const db = new GoodDeedsDB()
```

### 6.2. Queue Mutations When Offline

**`src/features/deeds/hooks/useDeedMutations.ts` (enhanced):**
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { db } from '@/lib/db'
import api from '@/lib/api'

export function useCreateDeedOffline() {
  const queryClient = useQueryClient()
  const isOnline = useOnlineStatus()
  
  return useMutation({
    mutationFn: async (input: CreateDeedInput) => {
      if (!isOnline) {
        // Save to IndexedDB for later sync
        await db.pendingActions.add({
          type: 'create_deed',
          payload: input,
          timestamp: Date.now(),
          synced: false
        })
        
        // Return fake ID (will be replaced on sync)
        return { id: `temp_${Date.now()}` }
      }
      
      // Online: normal API call
      const { data } = await api.post<{ id: string }>('/deeds', input)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deeds'] })
      toast.success(
        isOnline 
          ? 'Đã ghi nhận việc thiện' 
          : 'Đã lưu. Sẽ đồng bộ khi online.'
      )
    }
  })
}
```

### 6.3. Background Sync

**Register sync event:**
```typescript
// In Service Worker (auto-generated by vite-plugin-pwa)
// Add custom sync handler

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-deeds') {
    event.waitUntil(syncPendingActions())
  }
})

async function syncPendingActions() {
  // Get pending actions from IndexedDB
  const pending = await db.pendingActions
    .where('synced')
    .equals(false)
    .toArray()
  
  for (const action of pending) {
    try {
      // Execute action
      switch (action.type) {
        case 'create_deed':
          await fetch('/api/v1/deeds', {
            method: 'POST',
            body: JSON.stringify(action.payload)
          })
          break
        // ... other actions
      }
      
      // Mark as synced
      await db.pendingActions.update(action.id!, { synced: true })
    } catch (error) {
      console.error('Sync failed for action', action.id, error)
    }
  }
}
```

**Request sync when online:**
```typescript
// src/hooks/useSyncOnline.ts
import { useEffect } from 'react'
import { useOnlineStatus } from './useOnlineStatus'
import { db } from '@/lib/db'

export function useSyncOnline() {
  const isOnline = useOnlineStatus()
  
  useEffect(() => {
    if (isOnline) {
      syncPendingActions()
    }
  }, [isOnline])
}

async function syncPendingActions() {
  const pending = await db.pendingActions
    .where('synced')
    .equals(false)
    .toArray()
  
  if (pending.length === 0) return
  
  toast.info(`Đang đồng bộ ${pending.length} thao tác...`)
  
  // Sync each action
  for (const action of pending) {
    try {
      await syncAction(action)
      await db.pendingActions.update(action.id!, { synced: true })
    } catch (error) {
      console.error('Sync failed', error)
    }
  }
  
  // Cleanup synced actions
  await db.pendingActions
    .where('synced')
    .equals(true)
    .delete()
  
  toast.success('Đã đồng bộ thành công')
}
```

---

## 7. PWA Install Prompt

### 7.1. Detect Install Capability

**`src/hooks/useInstallPWA.ts`:**
```typescript
import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function useInstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }
    
    window.addEventListener('beforeinstallprompt', handler)
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])
  
  const installPWA = async () => {
    if (!deferredPrompt) return
    
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      setIsInstallable(false)
      setDeferredPrompt(null)
    }
  }
  
  return { isInstallable, installPWA }
}
```

### 7.2. Install Banner Component

**`src/components/InstallBanner.tsx`:**
```tsx
import { useInstallPWA } from '@/hooks/useInstallPWA'
import { Download, X } from 'lucide-react'
import { useState } from 'react'

export function InstallBanner() {
  const { isInstallable, installPWA } = useInstallPWA()
  const [dismissed, setDismissed] = useState(
    localStorage.getItem('install-banner-dismissed') === 'true'
  )
  
  if (!isInstallable || dismissed) return null
  
  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem('install-banner-dismissed', 'true')
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 shadow-lg z-50">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Download className="w-5 h-5" />
          <div>
            <p className="font-medium">Cài đặt ứng dụng</p>
            <p className="text-sm text-blue-100">
              Sử dụng nhanh hơn, ngay cả khi offline
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={installPWA}
            className="px-4 py-2 bg-white text-blue-600 rounded-md font-medium hover:bg-blue-50"
          >
            Cài đặt
          </button>
          <button
            onClick={handleDismiss}
            className="p-2 hover:bg-blue-700 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
```

---

## 8. Update Notification

### 8.1. Detect New Version

**`src/components/UpdateNotification.tsx`:**
```tsx
import { useRegisterSW } from 'virtual:pwa-register/react'
import { RefreshCw } from 'lucide-react'

export function UpdateNotification() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r)
    },
    onRegisterError(error) {
      console.error('SW registration error', error)
    }
  })
  
  if (!needRefresh) return null
  
  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-sm z-50">
      <div className="flex items-start gap-3">
        <RefreshCw className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">
            Có phiên bản mới
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Cập nhật để sử dụng phiên bản mới nhất
          </p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => updateServiceWorker(true)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Cập nhật
            </button>
            <button
              onClick={() => setNeedRefresh(false)}
              className="px-3 py-1.5 text-gray-700 rounded-md text-sm hover:bg-gray-100"
            >
              Để sau
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

---

## 9. Testing PWA

### 9.1. Local Testing

```bash
# Build production
pnpm build

# Preview (simulates production)
pnpm preview
```

**Open in browser:**
1. Open DevTools → Application tab
2. Check Service Worker status
3. Check Manifest
4. Test offline mode (Network tab → Offline)
5. Test install prompt

### 9.2. Lighthouse Audit

```bash
# Install Lighthouse CLI
pnpm add -g lighthouse

# Run audit
lighthouse http://localhost:4173 --view
```

**PWA checklist:**
- [ ] Installable
- [ ] Works offline
- [ ] Fast load time (< 3s)
- [ ] Responsive
- [ ] HTTPS

---

## 10. Best Practices

### 10.1. Cache Management

**Limit cache size:**
```typescript
workbox: {
  runtimeCaching: [
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 100, // Limit cache size
          maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
        }
      }
    }
  ]
}
```

### 10.2. Precache Only Essentials

```typescript
// Don't precache everything
workbox: {
  globPatterns: [
    '**/*.{js,css,html}', // Yes
    // Don't precache large assets that may not be used
  ]
}
```

### 10.3. Version Control

Service Worker auto-updates when:
- New build → new hash → SW reinstalls
- No manual version management needed

---

## 11. iOS Considerations

### 11.1. Add to Home Screen (iOS)

**Meta tags in index.html:**
```html
<!-- iOS -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="3000 Thiện">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

### 11.2. iOS Limitations

- No install prompt (user must manually "Add to Home Screen")
- Service Worker support limited (but improving)
- No push notifications (yet)

**Workaround: Show instruction**
```tsx
function IOSInstallInstructions() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  
  if (!isIOS) return null
  
  return (
    <div className="p-4 bg-blue-50 rounded-lg">
      <p className="text-sm">
        Để cài đặt trên iOS: Nhấn nút <strong>Share</strong> → 
        <strong>Add to Home Screen</strong>
      </p>
    </div>
  )
}
```

---

## 12. Kết luận

PWA strategy này đảm bảo:
- ✅ App có thể cài đặt như native app
- ✅ Works offline với cache thông minh
- ✅ Fast loading với precache
- ✅ Auto-sync khi online
- ✅ Native feel trên mobile

**Critical for "3000 Việc Thiện":**
- User có thể ghi nhận việc thiện **bất cứ lúc nào**, kể cả offline
- Data sẽ được sync khi có internet
- Trải nghiệm mượt mà, không bị gián đoạn
