import { useGoogleLogin } from '@react-oauth/google'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { loginGoogle } from '@/api/auth'
import { PWAGuideDialog } from '@/components/layout/pwa-guide-dialog'
import { CardSection } from '@/components/shared/card-section'
import Leaf from '@/components/shared/leaf'
import { TourGuideButton } from '@/components/shared/tour-guide-button'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { APP_VERSION, ONBOARDING_CONTENT, ONBOARDING_KEYS, PATHS } from '@/lib/constants'
import { t } from '@/lib/i18n'
import { authActions, useAuthStore } from '@/stores/auth-store'

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

const LoginPage = () => {
  const navigate = useNavigate()
  const isSessionChecked = useAuthStore.use.isSessionChecked()
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
      const response = await loginGoogle({
        code,
        redirectUri,
      })

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
    if (isSessionChecked && isAuthenticated) {
      navigate(PATHS.HOME, { replace: true })
    }
  }, [isSessionChecked, isAuthenticated, navigate])

  useEffect(() => {
    if (!isSessionChecked || isAuthenticated) {
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
  }, [authRedirectUri, isAuthenticated, isSessionChecked, navigate])

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

  if (!isSessionChecked) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <Spinner />
      </div>
    )
  }

  return (
    <div className='bg-background min-h-screen px-4 py-8 sm:px-6 lg:px-8'>
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='bg-primary/10 absolute -top-24 right-0 h-72 w-72 rounded-full blur-3xl' />
        <div className='bg-secondary/30 absolute top-32 left-6 h-52 w-52 rounded-full blur-3xl' />
      </div>

      <div className='relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl items-center'>
        <div className='grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]'>
          <div className='flex flex-col justify-center gap-6'>
            <CardSection className='flex flex-col gap-3'>
              <Leaf className='opacity-30' position='top-right' variant={2} />
              <div className='flex items-start justify-between gap-4'>
                <div className='flex items-center gap-4'>
                  <div className='flex h-16 w-16 items-center justify-center rounded-3xl border border-black/5 bg-white/80 shadow-sm'>
                    <img
                      alt={t('auth.login.logoAlt')}
                      className='h-10 w-10'
                      src='/icons/icon_sprout.png'
                    />
                  </div>
                  <div>
                    <p className='text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase'>
                      {t('auth.login.brandName')}
                    </p>
                    <h1 className='text-foreground mt-2 text-2xl font-semibold sm:text-3xl'>
                      {t('auth.login.heroTitle')}
                    </h1>
                  </div>
                </div>
                <TourGuideButton
                  autoOpen
                  flowTitle={ONBOARDING_CONTENT.general.title}
                  steps={ONBOARDING_CONTENT.general.steps}
                  storageKey={ONBOARDING_KEYS.general}
                />
              </div>
              <p className='text-muted-foreground/90 text-base leading-relaxed'>
                {t('auth.login.heroDescription')}
              </p>
              <p className='text-muted-foreground text-sm'>{t('auth.login.privacyNote')}</p>

              {error && (
                <div className='rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800'>
                  {error}
                </div>
              )}

              <Button
                className='bg-primary hover:bg-primary/90 mt-3 h-12 w-full rounded-full'
                disabled={isLoading}
                onClick={handleGoogleLogin}>
                {isLoading ? <Spinner /> : null}
                {isLoading ? t('auth.login.loading') : t('auth.login.googleAction')}
              </Button>
              <PWAGuideDialog showIcon />
            </CardSection>

            <p className='text-muted-foreground/60 text-center text-xs leading-relaxed'>
              {t('auth.login.termsPrefix')}{' '}
              <Link className='underline decoration-dashed underline-offset-2' to={PATHS.TERMS}>
                {t('auth.login.termsLabel')}
              </Link>{' '}
              {t('auth.login.termsConnector')}{' '}
              <Link className='underline decoration-dashed underline-offset-2' to={PATHS.PRIVACY}>
                {t('auth.login.privacyLabel')}
              </Link>
              .
            </p>
            <p className='text-muted-foreground/60 text-center text-xs leading-relaxed'>
              {t('auth.login.version', { version: APP_VERSION })}
            </p>
          </div>

          <div className='hidden items-center justify-center lg:flex'>
            <CardSection className='flex w-full max-w-sm flex-col gap-4'>
              <Leaf className='opacity-25' position='bottom-left' variant={3} />
              <div className='text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase'>
                {t('auth.login.sideTitle')}
              </div>
              <p className='text-foreground text-lg leading-relaxed font-semibold'>
                {t('auth.login.sideQuote')}
              </p>
              <div className='text-muted-foreground/80 text-sm leading-relaxed'>
                {t('auth.login.sideDescription')}
              </div>
            </CardSection>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
