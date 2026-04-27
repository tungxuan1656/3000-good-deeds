import { withBasePath } from './base-path'

const SERVICE_WORKER_URL = withBasePath('/sw.js')

const toUint8Array = (value: ArrayBuffer | Uint8Array | null | undefined) => {
  if (!value) return null
  if (value instanceof Uint8Array) return value

  return new Uint8Array(value)
}

export const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

export const isSameApplicationServerKey = (
  currentKey: ArrayBuffer | Uint8Array | null | undefined,
  expectedKey: Uint8Array,
) => {
  const current = toUint8Array(currentKey)
  if (!current || current.byteLength !== expectedKey.byteLength) {
    return false
  }

  for (let i = 0; i < current.byteLength; i++) {
    if (current[i] !== expectedKey[i]) {
      return false
    }
  }

  return true
}

export const isPushSupported = () => {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

export const getOrRegisterServiceWorker = async () => {
  const existing = await navigator.serviceWorker.getRegistration()
  if (existing) {
    await navigator.serviceWorker.ready

    return existing
  }

  await navigator.serviceWorker.register(SERVICE_WORKER_URL, {
    type: 'classic',
  })

  return await navigator.serviceWorker.ready
}
