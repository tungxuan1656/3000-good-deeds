import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { LoginSideCard } from '@/components/auth'
import { CardSection } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthProvider } from '@/hooks/auth/use-auth-provider'
import { APP_VERSION, PATHS } from '@/lib/constants'
import { getFirebaseErrorMessage } from '@/lib/firebase-errors'
import { t } from '@/lib/i18n'
import { useAuthStore } from '@/stores/auth.store'

const LoginPage = () => {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore.use.isAuthenticated()
  const {
    loginWithEmailPassword,
    registerWithEmailPassword,
    loginWithGoogle,
    sendResetPasswordLink,
  } = useAuthProvider()

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      navigate(PATHS.HOME, { replace: true })
    }
  }, [isAuthenticated, navigate])

  const resetMessages = () => {
    setError(null)
    setNotice(null)
  }

  const handleModeChange = (nextMode: 'login' | 'register' | 'forgot') => {
    resetMessages()
    setMode(nextMode)
  }

  const handleGoogleLogin = async () => {
    resetMessages()
    setIsLoading(true)

    try {
      await loginWithGoogle()
      navigate(PATHS.HOME, { replace: true })
    } catch (error) {
      setError(getFirebaseErrorMessage(error, t('auth.login.errors.googleConnection')))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    resetMessages()
    setIsLoading(true)

    try {
      if (mode === 'forgot') {
        await sendResetPasswordLink(email.trim())
        setNotice(t('auth.form.messages.resetSent'))

        return
      }

      if (mode === 'register') {
        if (password !== confirmPassword) {
          setError(t('auth.form.validation.passwordMismatch'))

          return
        }

        await registerWithEmailPassword(email.trim(), password, displayName.trim())
        navigate(PATHS.HOME, { replace: true })

        return
      }

      await loginWithEmailPassword(email.trim(), password)
      navigate(PATHS.HOME, { replace: true })
    } catch (error) {
      setError(getFirebaseErrorMessage(error, t('auth.login.errors.failed')))
    } finally {
      setIsLoading(false)
    }
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
            <CardSection className='flex flex-col gap-4'>
              <div className='flex items-center gap-3'>
                <div className='bg-card/80 border-border/45 flex h-14 w-14 items-center justify-center rounded-3xl border shadow-sm'>
                  <img
                    alt={t('auth.login.logoAlt')}
                    className='h-9 w-9'
                    src='/icons/icon_sprout.png'
                  />
                </div>
                <div>
                  <p className='text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase'>
                    {t('auth.login.brandName')}
                  </p>
                  <h1 className='text-foreground mt-1 text-2xl font-semibold'>
                    {t('auth.form.title')}
                  </h1>
                </div>
              </div>

              <p className='text-muted-foreground/90 text-sm'>{t('auth.login.heroDescription')}</p>

              <div className='grid grid-cols-2 gap-2'>
                <Button
                  variant={mode === 'login' ? 'default' : 'outline'}
                  onClick={() => handleModeChange('login')}>
                  {t('auth.form.modes.login')}
                </Button>
                <Button
                  variant={mode === 'register' ? 'default' : 'outline'}
                  onClick={() => handleModeChange('register')}>
                  {t('auth.form.modes.register')}
                </Button>
              </div>
              <div>
                {mode === 'login' || mode === 'forgot' ? (
                  <Button
                    size='xs'
                    variant={mode === 'forgot' ? 'default' : 'link'}
                    onClick={() => handleModeChange('forgot')}>
                    {t('auth.form.modes.forgot')}
                  </Button>
                ) : null}
              </div>

              {error && (
                <div className='rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800'>
                  {error}
                </div>
              )}
              {notice && (
                <div className='rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800'>
                  {notice}
                </div>
              )}

              <form className='mt-3 flex flex-col gap-3' onSubmit={handleSubmit}>
                {mode === 'register' ? (
                  <Input
                    className='h-10'
                    placeholder={t('auth.form.fields.displayName')}
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                  />
                ) : null}
                <Input
                  className='h-10'
                  placeholder={t('auth.form.fields.email')}
                  type='email'
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />

                {mode !== 'forgot' ? (
                  <Input
                    className='h-10'
                    placeholder={t('auth.form.fields.password')}
                    type='password'
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                ) : null}

                {mode === 'register' ? (
                  <Input
                    className='h-10'
                    placeholder={t('auth.form.fields.confirmPassword')}
                    type='password'
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                ) : null}

                <Button className='mt-1 h-11 w-full' disabled={isLoading} type='submit'>
                  {isLoading ? t('auth.login.loading') : t(`auth.form.actions.${mode}`)}
                </Button>
              </form>

              {mode !== 'forgot' ? (
                <Button
                  className='h-11 w-full'
                  disabled={isLoading}
                  variant='outline'
                  onClick={handleGoogleLogin}>
                  {t('auth.form.actions.google')}
                </Button>
              ) : null}
            </CardSection>

            <p className='text-muted-foreground/60 text-center text-xs leading-relaxed'>
              {t('auth.login.termsPrefix')}{' '}
              <span className='font-medium'>{t('auth.login.termsLabel')}</span>{' '}
              {t('auth.login.termsConnector')}{' '}
              <span className='font-medium'>{t('auth.login.privacyLabel')}</span>.
            </p>
            <p className='text-muted-foreground/60 text-center text-xs leading-relaxed'>
              {t('auth.login.version', { version: APP_VERSION })}
            </p>
          </div>

          <div className='hidden items-center justify-center lg:flex'>
            <LoginSideCard />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
