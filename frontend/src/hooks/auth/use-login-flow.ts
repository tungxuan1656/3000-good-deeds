import { useGoogleLogin } from '@react-oauth/google'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { loginGoogle } from '@/api/auth'
import { PATHS } from '@/lib/constants'
import { t } from '@/lib/i18n'
import { authActions, useAuthStore } from '@/stores/auth.store'

const isIosStandalonePwa = () => {
  if (typeof window === 'undefined') {
    return false
  }

  const ua = window.navigator.userAgent
  const isIos = /iPad|iPhone|iPod/.test(ua)
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true

  return isIos && isStandalone
}

export const useLoginFlow = () => {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore.use.isAuthenticated()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const useRedirectFlow = isIosStandalonePwa()
  const popupRedirectUri = window.location.origin
  const authRedirectUri = `${window.location.origin}${PATHS.LOGIN}`

  const completeLoginWithCode = async (code: string, redirectUri: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await loginGoogle({ code, redirectUri })

      if (response.success && response.data) {
        authActions.login(response.data)
        navigate(PATHS.HOME, { replace: true })
      } else {
        setError(response.error || t('auth.login.errors.failed'))
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(t('auth.login.errors.unexpected'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate(PATHS.HOME, { replace: true })
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (isAuthenticated) {
      return
    }

    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')

    if (!code) {
      return
    }

    const loginWithCode = async () => {
      try {
        await completeLoginWithCode(code, authRedirectUri)
      } finally {
        window.history.replaceState({}, document.title, PATHS.LOGIN)
      }
    }

    void loginWithCode()
  }, [authRedirectUri, isAuthenticated])

  const redirectGoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      await completeLoginWithCode(codeResponse.code, authRedirectUri)
    },
    onError: (oauthError) => {
      console.error('Google OAuth redirect error:', oauthError)
      setError(t('auth.login.errors.googleConnection'))
    },
    flow: 'auth-code',
    ux_mode: 'redirect',
    redirect_uri: authRedirectUri,
  })

  const popupGoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      await completeLoginWithCode(codeResponse.code, popupRedirectUri)
    },
    onError: (oauthError) => {
      const errText = JSON.stringify(oauthError).toLowerCase()
      const shouldFallbackToRedirect =
        errText.includes('popup_failed_to_open') || errText.includes('popup blocked')

      if (shouldFallbackToRedirect) {
        redirectGoogleLogin()

        return
      }

      console.error('Google OAuth popup error:', oauthError)
      setError(t('auth.login.errors.googleConnection'))
    },
    flow: 'auth-code',
    ux_mode: 'popup',
    redirect_uri: popupRedirectUri,
  })

  const handleGoogleLogin = () => {
    setError(null)

    if (useRedirectFlow) {
      redirectGoogleLogin()

      return
    }

    popupGoogleLogin()
  }

  return {
    isLoading,
    error,
    handleGoogleLogin,
  }
}
