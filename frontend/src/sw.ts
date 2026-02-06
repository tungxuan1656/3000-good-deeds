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

clientsClaim()
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener('push', (event) => {
  const data = event.data?.json?.() as PushPayload | undefined
  const title = data?.title ?? 'Nhắc nhở việc thiện'
  const body = data?.body ?? 'Đến giờ ghi nhận việc thiện 🌱'
  const url = data?.url ?? '/'

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { url },
    }),
  )
})

self.addEventListener('notificationclick', (event) => {
  const targetUrl = (event.notification.data as { url?: string } | undefined)?.url ?? '/'
  event.notification.close()

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((client) => 'focus' in client)
      if (existing) {
        existing.focus()
        existing.navigate(targetUrl)

        return
      }

      return self.clients.openWindow(targetUrl)
    }),
  )
})
