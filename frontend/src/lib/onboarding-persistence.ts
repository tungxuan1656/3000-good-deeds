const ONBOARDING_SEEN_VALUE = 'seen'

type StorageReader = Pick<Storage, 'getItem'>
type StorageWriter = Pick<Storage, 'setItem'>

export const shouldAutoOpenOnboarding = (
  storage: StorageReader,
  storageKey: string,
) => {
  try {
    return !storage.getItem(storageKey)
  } catch {
    return false
  }
}

export const markOnboardingAsSeen = (
  storage: StorageWriter,
  storageKey: string,
) => {
  try {
    storage.setItem(storageKey, ONBOARDING_SEEN_VALUE)

    return true
  } catch {
    return false
  }
}
