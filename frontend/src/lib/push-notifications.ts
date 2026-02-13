import { getVapidPublicKey, subscribePush, unsubscribePush } from '@/api/reminders'
import { useAuthStore } from '@/stores/auth-store'
import type { PushSubscriptionPayloadDTO } from '@/types/api'

const SERVICE_WORKER_URL = import.meta.env.DEV ? '/dev-sw.js?dev-sw' : '/sw.js'
const PUSH_ENDPOINT_STORAGE_KEY = 'push-subscription-endpoint'
const PUSH_LAST_SYNCED_USER_ID_KEY = 'push-subscription-synced-user-id'
const PUSH_LAST_SYNCED_ENDPOINT_KEY = 'push-subscription-synced-endpoint'

type PushSyncErrorCode =
  | 'unauthenticated'
  | 'reminder-disabled'
  | 'unsupported'
  | 'permission-default'
  | 'permission-denied'
  | 'missing-public-key'
  | 'invalid-endpoint'
  | 'invalid-keys'

type PushSyncResult = {
  success: boolean
  error?: string
  code?: PushSyncErrorCode
}

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

const getStoredEndpoint = () => {
  try {
    return localStorage.getItem(PUSH_ENDPOINT_STORAGE_KEY)
  } catch {
    return null
  }
}

const setStoredEndpoint = (endpoint: string) => {
  try {
    localStorage.setItem(PUSH_ENDPOINT_STORAGE_KEY, endpoint)
  } catch {
    // Ignore storage failures
  }
}

const clearStoredEndpoint = () => {
  try {
    localStorage.removeItem(PUSH_ENDPOINT_STORAGE_KEY)
  } catch {
    // Ignore storage failures
  }
}

const getLastSyncedUserId = () => {
  try {
    return localStorage.getItem(PUSH_LAST_SYNCED_USER_ID_KEY)
  } catch {
    return null
  }
}

const getLastSyncedEndpoint = () => {
  try {
    return localStorage.getItem(PUSH_LAST_SYNCED_ENDPOINT_KEY)
  } catch {
    return null
  }
}

const setLastSyncedInfo = (userId: string, endpoint: string) => {
  try {
    localStorage.setItem(PUSH_LAST_SYNCED_USER_ID_KEY, userId)
    localStorage.setItem(PUSH_LAST_SYNCED_ENDPOINT_KEY, endpoint)
  } catch {
    // Ignore storage failures
  }
}

const clearLastSyncedInfo = () => {
  try {
    localStorage.removeItem(PUSH_LAST_SYNCED_USER_ID_KEY)
    localStorage.removeItem(PUSH_LAST_SYNCED_ENDPOINT_KEY)
  } catch {
    // Ignore storage failures
  }
}

const toUint8Array = (value: ArrayBuffer | Uint8Array | null | undefined) => {
  if (!value) return null
  if (value instanceof Uint8Array) return value

  return new Uint8Array(value)
}

const isSameApplicationServerKey = (
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

const getOrRegisterServiceWorker = async () => {
  const existing = await navigator.serviceWorker.getRegistration()
  if (existing) {
    await navigator.serviceWorker.ready

    return existing
  }

  await navigator.serviceWorker.register(SERVICE_WORKER_URL, {
    type: import.meta.env.DEV ? 'module' : 'classic',
  })

  return await navigator.serviceWorker.ready
}

const removeEndpointFromServer = async (endpoint: string) => {
  try {
    await unsubscribePush({ endpoint })
  } catch {
    // Best effort cleanup
  }
}

export const syncPushSubscription = async ({
  requestPermission,
}: {
  requestPermission: boolean
}): Promise<PushSyncResult> => {
  const currentUser = useAuthStore.getState().user

  if (!currentUser?.id) {
    return { success: false, error: 'Chưa đăng nhập.', code: 'unauthenticated' }
  }

  if (!requestPermission && !currentUser.reminderEnabled) {
    return { success: false, error: 'Bạn đang tắt nhắc nhở.', code: 'reminder-disabled' }
  }

  if (!isPushSupported()) {
    return { success: false, error: 'Thiết bị chưa hỗ trợ Web Push.', code: 'unsupported' }
  }

  let permission = Notification.permission
  if (permission === 'default' && requestPermission) {
    permission = await Notification.requestPermission()
  }

  if (permission === 'default') {
    return {
      success: false,
      error: 'Thiết bị này chưa cấp quyền thông báo.',
      code: 'permission-default',
    }
  }

  if (permission !== 'granted') {
    return {
      success: false,
      error: 'Bạn cần cấp quyền thông báo để bật nhắc nhở.',
      code: 'permission-denied',
    }
  }

  const registration = await getOrRegisterServiceWorker()

  const publicKeyResponse = await getVapidPublicKey()
  const publicKey = publicKeyResponse.data?.publicKey
  if (!publicKey) {
    return {
      success: false,
      error: 'Không lấy được khoá thông báo từ máy chủ.',
      code: 'missing-public-key',
    }
  }

  const applicationServerKey = urlBase64ToUint8Array(publicKey)

  let subscription = await registration.pushManager.getSubscription()

  if (
    subscription &&
    !isSameApplicationServerKey(subscription.options.applicationServerKey, applicationServerKey)
  ) {
    const oldEndpoint = subscription.endpoint
    await subscription.unsubscribe()
    await removeEndpointFromServer(oldEndpoint)
    subscription = null
  }

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    })
  }

  const payloadJson = subscription.toJSON()
  if (!payloadJson.endpoint) {
    return {
      success: false,
      error: 'Subscription endpoint không hợp lệ.',
      code: 'invalid-endpoint',
    }
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
    return {
      success: false,
      error: 'Không thể tạo khoá Web Push hợp lệ.',
      code: 'invalid-keys',
    }
  }

  const previousEndpoint = getStoredEndpoint()
  const lastSyncedUserId = getLastSyncedUserId()
  const lastSyncedEndpoint = getLastSyncedEndpoint()

  const isAlreadySyncedForThisUser =
    lastSyncedUserId === currentUser.id && lastSyncedEndpoint === payload.endpoint

  if (!isAlreadySyncedForThisUser) {
    await subscribePush(payload)
  }

  if (previousEndpoint && previousEndpoint !== payload.endpoint) {
    await removeEndpointFromServer(previousEndpoint)
  }

  setStoredEndpoint(payload.endpoint)
  setLastSyncedInfo(currentUser.id, payload.endpoint)

  return { success: true }
}

export const subscribeToPushNotifications = async (): Promise<PushSyncResult> => {
  return syncPushSubscription({ requestPermission: true })
}

export const syncPushSubscriptionSilently = async (): Promise<PushSyncResult> => {
  return syncPushSubscription({ requestPermission: true })
}

export const unsubscribeFromPushNotifications = async () => {
  const storedEndpoint = getStoredEndpoint()

  if (!isPushSupported()) {
    if (storedEndpoint) {
      await removeEndpointFromServer(storedEndpoint)
      clearStoredEndpoint()
      clearLastSyncedInfo()
    }

    return
  }

  const registration = await navigator.serviceWorker.getRegistration()
  if (!registration) {
    if (storedEndpoint) {
      await removeEndpointFromServer(storedEndpoint)
      clearStoredEndpoint()
      clearLastSyncedInfo()
    }

    return
  }

  const subscription = await registration.pushManager.getSubscription()
  if (!subscription) {
    if (storedEndpoint) {
      await removeEndpointFromServer(storedEndpoint)
      clearStoredEndpoint()
      clearLastSyncedInfo()
    }

    return
  }

  await removeEndpointFromServer(subscription.endpoint)
  await subscription.unsubscribe()
  clearStoredEndpoint()
  clearLastSyncedInfo()
}
