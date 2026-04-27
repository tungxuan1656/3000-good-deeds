self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(Promise.resolve())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

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
