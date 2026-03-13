/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'

type WorkboxManifestEntry = {
  url: string
  revision?: string
}

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: WorkboxManifestEntry[]
}

type PushPayload = {
  title?: string
  body?: string
  url?: string
}

// NOTE: Service worker runs outside React/i18n runtime.
// Keep Vietnamese fallback copy here unless a dedicated worker-locale loader is introduced.
const DEFAULT_PUSH_TITLE = 'Nhắc nhở việc thiện'
const DEFAULT_PUSH_BODY = 'Đến giờ ghi nhận việc thiện 🌱'

clientsClaim()
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('push', (event) => {
  let data: PushPayload | undefined

  if (event.data) {
    try {
      data = event.data.json()
    } catch {
      data = { body: event.data.text() }
    }
  }

  const title = data?.title ?? DEFAULT_PUSH_TITLE
  const body = data?.body ?? DEFAULT_PUSH_BODY
  const url = data?.url ?? '/'
  const targetUrl = new URL(url, self.location.origin).toString()

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { url: targetUrl },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  const targetUrl =
    (event.notification.data as { url?: string } | undefined)?.url ??
    new URL('/', self.location.origin).toString()
  event.notification.close()

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((client) => 'focus' in client)
      if (existing) {
        return (existing as WindowClient).focus().then((focused) => {
          if ('navigate' in focused) {
            return focused.navigate(targetUrl)
          }

          return undefined
        })
      }

      return self.clients.openWindow(targetUrl)
    }),
  )
})
