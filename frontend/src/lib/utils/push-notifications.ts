import {
  getVapidPublicKey,
  subscribePush,
  unsubscribePush,
} from '@/api/reminders'
import { t } from '@/lib/i18n'
import { useAuthStore } from '@/stores/auth.store'
import type { PushSubscriptionPayloadDTO } from '@/types/api'

import {
  clearLastSyncedInfo,
  clearStoredEndpoint,
  getLastSyncedEndpoint,
  getLastSyncedUserId,
  getStoredEndpoint,
  setLastSyncedInfo,
  setStoredEndpoint,
} from './push-subscription-storage'
import {
  getOrRegisterServiceWorker,
  isPushSupported,
  isSameApplicationServerKey,
  urlBase64ToUint8Array,
} from './push-sw'

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

const removeEndpointFromServer = async (endpoint: string) => {
  try {
    await unsubscribePush({ endpoint })
  } catch {
    // Best effort cleanup
  }
}

export { isPushSupported }

export const syncPushSubscription = async ({
  requestPermission,
}: {
  requestPermission: boolean
}): Promise<PushSyncResult> => {
  const currentUser = useAuthStore.getState().user

  if (!currentUser?.id) {
    return {
      success: false,
      error: t('push.errors.unauthenticated'),
      code: 'unauthenticated',
    }
  }

  if (!requestPermission && !currentUser.reminderEnabled) {
    return {
      success: false,
      error: t('push.errors.reminderDisabled'),
      code: 'reminder-disabled',
    }
  }

  if (!isPushSupported()) {
    return {
      success: false,
      error: t('push.errors.unsupported'),
      code: 'unsupported',
    }
  }

  let permission = Notification.permission
  if (permission === 'default' && requestPermission) {
    permission = await Notification.requestPermission()
  }

  if (permission === 'default') {
    return {
      success: false,
      error: t('push.errors.permissionDefault'),
      code: 'permission-default',
    }
  }

  if (permission !== 'granted') {
    return {
      success: false,
      error: t('push.errors.permissionDenied'),
      code: 'permission-denied',
    }
  }

  const registration = await getOrRegisterServiceWorker()

  const publicKeyResponse = await getVapidPublicKey()
  const publicKey = publicKeyResponse.data?.publicKey
  if (!publicKey) {
    return {
      success: false,
      error: t('push.errors.missingPublicKey'),
      code: 'missing-public-key',
    }
  }

  const applicationServerKey = urlBase64ToUint8Array(publicKey)

  let subscription = await registration.pushManager.getSubscription()

  if (
    subscription &&
    !isSameApplicationServerKey(
      subscription.options.applicationServerKey,
      applicationServerKey,
    )
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
      error: t('push.errors.invalidEndpoint'),
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
      error: t('push.errors.invalidKeys'),
      code: 'invalid-keys',
    }
  }

  const previousEndpoint = getStoredEndpoint()
  const lastSyncedUserId = getLastSyncedUserId()
  const lastSyncedEndpoint = getLastSyncedEndpoint()

  const isAlreadySyncedForThisUser =
    lastSyncedUserId === currentUser.id &&
    lastSyncedEndpoint === payload.endpoint

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

export const subscribeToPushNotifications =
  async (): Promise<PushSyncResult> => {
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
