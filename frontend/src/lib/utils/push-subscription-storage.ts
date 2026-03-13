const PUSH_ENDPOINT_STORAGE_KEY = 'push-subscription-endpoint'
const PUSH_LAST_SYNCED_USER_ID_KEY = 'push-subscription-synced-user-id'
const PUSH_LAST_SYNCED_ENDPOINT_KEY = 'push-subscription-synced-endpoint'

export const getStoredEndpoint = () => {
  try {
    return localStorage.getItem(PUSH_ENDPOINT_STORAGE_KEY)
  } catch {
    return null
  }
}

export const setStoredEndpoint = (endpoint: string) => {
  try {
    localStorage.setItem(PUSH_ENDPOINT_STORAGE_KEY, endpoint)
  } catch {
    // Ignore storage failures
  }
}

export const clearStoredEndpoint = () => {
  try {
    localStorage.removeItem(PUSH_ENDPOINT_STORAGE_KEY)
  } catch {
    // Ignore storage failures
  }
}

export const getLastSyncedUserId = () => {
  try {
    return localStorage.getItem(PUSH_LAST_SYNCED_USER_ID_KEY)
  } catch {
    return null
  }
}

export const getLastSyncedEndpoint = () => {
  try {
    return localStorage.getItem(PUSH_LAST_SYNCED_ENDPOINT_KEY)
  } catch {
    return null
  }
}

export const setLastSyncedInfo = (userId: string, endpoint: string) => {
  try {
    localStorage.setItem(PUSH_LAST_SYNCED_USER_ID_KEY, userId)
    localStorage.setItem(PUSH_LAST_SYNCED_ENDPOINT_KEY, endpoint)
  } catch {
    // Ignore storage failures
  }
}

export const clearLastSyncedInfo = () => {
  try {
    localStorage.removeItem(PUSH_LAST_SYNCED_USER_ID_KEY)
    localStorage.removeItem(PUSH_LAST_SYNCED_ENDPOINT_KEY)
  } catch {
    // Ignore storage failures
  }
}
