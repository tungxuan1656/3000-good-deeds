/**
 * Firebase error codes and their user-friendly messages
 */
const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  // Authentication errors
  'auth/email-already-in-use':
    'Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.',
  'auth/weak-password': 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu có ít nhất 6 ký tự.',
  'auth/invalid-email': 'Địa chỉ email không hợp lệ. Vui lòng nhập email đúng định dạng.',
  'auth/user-disabled': 'Tài khoản này đã bị vô hiệu hóa. Vui lòng liên hệ hỗ trợ.',
  'auth/user-not-found':
    'Tài khoản không tồn tại. Vui lòng kiểm tra email hoặc đăng ký tài khoản mới.',
  'auth/wrong-password': 'Mật khẩu không chính xác. Vui lòng thử lại.',
  'auth/invalid-credential': 'Email hoặc mật khẩu không chính xác. Vui lòng thử lại.',
  'auth/too-many-requests': 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau.',
  'auth/operation-not-allowed': 'Phương pháp đăng nhập này không được hỗ trợ.',
  'auth/account-exists-with-different-credential':
    'Tài khoản đã tồn tại với phương pháp đăng nhập khác.',

  // Network errors
  'auth/network-request-failed': 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối Internet.',

  // Popup/Redirect errors
  'auth/popup-blocked': 'Cửa sổ đăng nhập bị chặn. Vui lòng cho phép pop-up và thử lại.',
  'auth/popup-closed-by-user': 'Bạn đã đóng cửa sổ đăng nhập. Vui lòng thử lại.',
  'auth/cancelled-popup-request': 'Yêu cầu đăng nhập đã bị hủy. Vui lòng thử lại.',

  // Email actions
  'auth/invalid-action-code': 'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.',
  'auth/user-token-expired': 'Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.',
  'auth/expired-action-code':
    'Liên kết đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu liên kết mới.',
}

/**
 * Map Firebase REST API error codes to user-friendly messages
 * Used for backend API errors (e.g., from exchangeProviderToken)
 */
const REST_API_ERROR_MESSAGES: Record<string, string> = {
  EMAIL_EXISTS: 'Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập.',
  INVALID_PASSWORD: 'Mật khẩu không hợp lệ. Vui lòng thử lại.',
  USER_DISABLED: 'Tài khoản này đã bị vô hiệu hóa. Vui lòng liên hệ hỗ trợ.',
  EMAIL_NOT_FOUND: 'Email không tồn tại. Vui lòng kiểm tra hoặc đăng ký tài khoản mới.',
  INVALID_EMAIL: 'Địa chỉ email không hợp lệ.',
  OPERATION_NOT_ALLOWED: 'Phương pháp đăng nhập này không được hỗ trợ.',
  TOO_MANY_ATTEMPTS_LOGIN_FAILURE: 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau.',
  WEAK_PASSWORD: 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.',
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
export const getFirebaseErrorMessage = (error: unknown, fallback: string): string => {
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
  if (typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    const message = error.message as string
    if (message.trim()) {
      return message
    }
  }

  return fallback
}
