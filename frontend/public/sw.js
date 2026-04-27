const APP_SHELL_CACHE = 'app-shell-v2'
const STATIC_ASSET_CACHE = 'static-assets-v2'
const CACHES_TO_KEEP = [APP_SHELL_CACHE, STATIC_ASSET_CACHE]
const APP_SHELL_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/appicon.png',
  '/apple-touch-icon-180x180.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/maskable-icon-512x512.png',
]

const DEFAULT_PUSH_TITLE = 'Nhắc nhở việc thiện'
const DEFAULT_PUSH_BODY = 'Đến giờ ghi nhận việc thiện 🌱'
const APP_ICON_URL = '/pwa-192x192.png'

const resolveTargetUrl = (url) => {
  if (!url || url === '/') {
    return '/home'
  }

  try {
    return new URL(url, self.location.origin).toString()
  } catch {
    return `${self.location.origin}/home`
  }
}

const isSameOrigin = (requestUrl) => {
  return new URL(requestUrl).origin === self.location.origin
}

const isStaticAssetRequest = (request) => {
  const staticDestinations = ['script', 'style', 'font', 'image']

  return staticDestinations.includes(request.destination)
}

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches
      .open(APP_SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL_ASSETS))
      .catch(() => undefined),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => !CACHES_TO_KEEP.includes(cacheName))
            .map((cacheName) => caches.delete(cacheName)),
        ),
      ),
    ]),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET' || !isSameOrigin(request.url)) {
    return
  }

  const requestUrl = new URL(request.url)
  if (requestUrl.pathname.startsWith('/api/')) {
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        return (await caches.match('/')) || Response.error()
      }),
    )

    return
  }

  if (!isStaticAssetRequest(request)) {
    return
  }

  event.respondWith(
    caches.match(request).then(async (cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      try {
        const response = await fetch(request)
        if (response.ok && response.type === 'basic') {
          const cache = await caches.open(STATIC_ASSET_CACHE)
          await cache.put(request, response.clone())
        }

        return response
      } catch {
        return Response.error()
      }
    }),
  )
})

self.addEventListener('push', (event) => {
  let payload = {}

  if (event.data) {
    try {
      payload = event.data.json()
    } catch {
      payload = { body: event.data.text() }
    }
  }

  const title = payload.title || DEFAULT_PUSH_TITLE
  const body = payload.body || DEFAULT_PUSH_BODY
  const url = resolveTargetUrl(payload.url)

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: APP_ICON_URL,
      badge: APP_ICON_URL,
      data: { url },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  const targetUrl = event.notification.data?.url || `${self.location.origin}/home`
  event.notification.close()

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        const matchingClient = clients.find((client) => 'focus' in client)

        if (matchingClient) {
          return matchingClient.focus().then((focusedClient) => {
            if ('navigate' in focusedClient) {
              return focusedClient.navigate(targetUrl)
            }

            return undefined
          })
        }

        return self.clients.openWindow(targetUrl)
      }),
  )
})
