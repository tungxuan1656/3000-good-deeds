/**
 * Firebase error codes and their i18n key mappings
 */

import { t } from './i18n'

// Language-change in this app triggers a full page reload, so module-level t() calls are safe.
const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  // Authentication errors
  'auth/email-already-in-use': t('auth.form.errors.emailAlreadyInUse'),
  'auth/weak-password': t('auth.form.errors.weakPassword'),
  'auth/invalid-email': t('auth.form.errors.invalidEmail'),
  'auth/user-disabled': t('auth.form.errors.userDisabled'),
  'auth/user-not-found': t('auth.form.errors.userNotFound'),
  'auth/wrong-password': t('auth.form.errors.wrongPassword'),
  'auth/invalid-credential': t('auth.form.errors.invalidCredential'),
  'auth/too-many-requests': t('auth.form.errors.tooManyRequests'),
  'auth/operation-not-allowed': t('auth.form.errors.operationNotAllowed'),
  'auth/account-exists-with-different-credential': t(
    'auth.form.errors.accountExistsWithDifferentCredential',
  ),

  // Network errors
  'auth/network-request-failed': t('auth.form.errors.networkRequestFailed'),

  // Popup/Redirect errors
  'auth/popup-blocked': t('auth.form.errors.popupBlocked'),
  'auth/popup-closed-by-user': t('auth.form.errors.popupClosedByUser'),
  'auth/cancelled-popup-request': t('auth.form.errors.cancelledPopupRequest'),

  // Email actions
  'auth/invalid-action-code': t('auth.form.errors.invalidActionCode'),
  'auth/user-token-expired': t('auth.form.errors.userTokenExpired'),
  'auth/expired-action-code': t('auth.form.errors.expiredActionCode'),
}

/**
 * Map Firebase REST API error codes to i18n keys
 * Used for backend API errors (e.g., from exchangeProviderToken)
 */
const REST_API_ERROR_MESSAGES: Record<string, string> = {
  EMAIL_EXISTS: t('auth.form.errors.emailAlreadyInUse'),
  INVALID_PASSWORD: t('auth.form.errors.invalidPassword'),
  USER_DISABLED: t('auth.form.errors.userDisabled'),
  EMAIL_NOT_FOUND: t('auth.form.errors.userNotFound'),
  INVALID_EMAIL: t('auth.form.errors.invalidEmail'),
  OPERATION_NOT_ALLOWED: t('auth.form.errors.operationNotAllowed'),
  TOO_MANY_ATTEMPTS_LOGIN_FAILURE: t(
    'auth.form.errors.tooManyAttemptsLoginFailure',
  ),
  WEAK_PASSWORD: t('auth.form.errors.weakPassword'),
}

export interface FirebaseError {
  code?: string
  message?: string
  error?: {
    code?: number
    message?: string
  }
}

/**
 * Extract user-friendly error message from Firebase errors
 * Handles both Firebase SDK errors and REST API errors
 */
export const getFirebaseErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (!error) {
    return fallback
  }

  // Handle REST API errors from backend (error.error.message format)
  if (
    typeof error === 'object' &&
    'error' in error &&
    typeof error.error === 'object' &&
    error.error !== null &&
    'message' in error.error
  ) {
    const restApiMessage = error.error.message as string
    const friendlyMessage = REST_API_ERROR_MESSAGES[restApiMessage]
    if (friendlyMessage) {
      return friendlyMessage
    }
  }

  // Handle Firebase SDK errors (code property)
  if (typeof error === 'object' && 'code' in error) {
    const code = error.code as string
    const friendlyMessage = FIREBASE_ERROR_MESSAGES[code]
    if (friendlyMessage) {
      return friendlyMessage
    }
  }

  // Handle plain error messages
  if (typeof error === 'string' && error.trim()) {
    return error
  }

  // Handle error objects with message property
  if (
    typeof error === 'object' &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    const message = error.message as string
    if (message.trim()) {
      return message
    }
  }

  return fallback
}
