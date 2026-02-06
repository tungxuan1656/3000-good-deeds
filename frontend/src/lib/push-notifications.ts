import { getVapidPublicKey, subscribePush, unsubscribePush } from '@/api/reminders'
import type { PushSubscriptionPayloadDTO } from '@/types/api'

const SERVICE_WORKER_URL = '/sw.js'

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i)
  }

  return outputArray
}

export const isPushSupported = () => {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

const getOrRegisterServiceWorker = async () => {
  const existing = await navigator.serviceWorker.getRegistration()
  if (existing) return existing

  return await navigator.serviceWorker.register(SERVICE_WORKER_URL)
}

export const subscribeToPushNotifications = async (): Promise<{
  success: boolean
  error?: string
}> => {
  if (!isPushSupported()) {
    return { success: false, error: 'Thiết bị chưa hỗ trợ Web Push.' }
  }

  const permission =
    Notification.permission === 'default'
      ? await Notification.requestPermission()
      : Notification.permission

  if (permission !== 'granted') {
    return { success: false, error: 'Bạn cần cấp quyền thông báo để bật nhắc nhở.' }
  }

  const registration = await getOrRegisterServiceWorker()

  const publicKeyResponse = await getVapidPublicKey()
  const publicKey = publicKeyResponse.data?.publicKey
  if (!publicKey) {
    return { success: false, error: 'Không lấy được khoá thông báo từ máy chủ.' }
  }

  let subscription = await registration.pushManager.getSubscription()

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    })
  }

  const payloadJson = subscription.toJSON()
  if (!payloadJson.endpoint) {
    return { success: false, error: 'Subscription endpoint không hợp lệ.' }
  }

  const payload: PushSubscriptionPayloadDTO = {
    endpoint: payloadJson.endpoint,
    expirationTime: payloadJson.expirationTime ?? null,
    keys: {
      p256dh: payloadJson.keys?.p256dh ?? '',
      auth: payloadJson.keys?.auth ?? '',
    },
    userAgent: navigator.userAgent,
    platform: navigator.platform,
  }

  if (!payload.keys.p256dh || !payload.keys.auth) {
    return { success: false, error: 'Không thể tạo khoá Web Push hợp lệ.' }
  }

  await subscribePush(payload)

  return { success: true }
}

export const unsubscribeFromPushNotifications = async () => {
  if (!isPushSupported()) return

  const registration = await navigator.serviceWorker.getRegistration()
  if (!registration) return

  const subscription = await registration.pushManager.getSubscription()
  if (!subscription) return

  await unsubscribePush({ endpoint: subscription.endpoint })
  await subscription.unsubscribe()
}
