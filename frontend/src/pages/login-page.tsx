import { Eye, EyeOff, LogIn, Sprout } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuthProvider } from '@/hooks/auth/use-auth-provider'
import { APP_VERSION, PATHS } from '@/lib/constants'
import { getFirebaseErrorMessage } from '@/lib/firebase-errors'
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'
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
  const [showPassword, setShowPassword] = useState(false)
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
    <div className='bg-background text-foreground relative flex min-h-screen items-center justify-center p-6'>
      <main className='relative z-10 mx-auto w-full max-w-xl'>
        {/* Brand Identity */}
        <div className='mt-10 text-center'>
          <div className='bg-surface-container-high mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full'>
            <Sprout className='text-primary h-8 w-8' />
          </div>
          <h1 className='font-headline text-primary mb-3 text-4xl font-bold'>
            {t('auth.login.brandName')}
          </h1>
          <p className='text-on-surface-variant text-sm font-light tracking-wide italic'>
            {t('auth.login.heroDescription')}
          </p>
        </div>

        <div className='mx-auto mt-8'>
          <div className='flex flex-col gap-6'>
            {/* Auth Navigation Tabs */}
            <div className='border-outline-variant/30 mb-0 flex border-b px-2'>
              <button
                className={cn(
                  'flex-1 py-3 text-[11px] font-bold tracking-widest uppercase transition-colors',
                  mode === 'login'
                    ? 'text-primary border-primary border-b-2'
                    : 'text-muted-foreground hover:text-primary',
                )}
                onClick={() => handleModeChange('login')}>
                {t('auth.form.modes.login')}
              </button>
              <button
                className={cn(
                  'flex-1 py-3 text-[11px] font-bold tracking-widest uppercase transition-colors',
                  mode === 'register'
                    ? 'text-primary border-primary border-b-2'
                    : 'text-muted-foreground hover:text-primary',
                )}
                onClick={() => handleModeChange('register')}>
                {t('auth.form.modes.register')}
              </button>
              <button
                className={cn(
                  'flex-1 py-3 text-right text-[11px] font-bold tracking-widest uppercase transition-colors',
                  mode === 'forgot'
                    ? 'text-primary border-primary border-b-2'
                    : 'text-muted-foreground hover:text-primary',
                )}
                onClick={() => handleModeChange('forgot')}>
                {t('auth.form.modes.forgot')}
              </button>
            </div>

            {/* Login Card */}
            <Card className='relative overflow-hidden'>
              {/* Subtle Background Accent */}
              <div className='bg-primary/5 absolute -top-12 -right-12 h-32 w-32 rounded-full blur-2xl' />

              <CardContent className='p-6 md:p-8'>
                {error && (
                  <div className='mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800'>
                    {error}
                  </div>
                )}
                {notice && (
                  <div className='mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800'>
                    {notice}
                  </div>
                )}

                <form className='relative z-10 space-y-6' onSubmit={handleSubmit}>
                  {mode === 'register' ? (
                    <div className='space-y-2'>
                      <label className='text-on-surface-variant block px-1 text-[10px] font-bold tracking-[0.15em] uppercase'>
                        {t('auth.form.fields.displayName')}
                      </label>
                      <Input
                        placeholder={t('auth.form.fields.displayName')}
                        value={displayName}
                        onChange={(event) => setDisplayName(event.target.value)}
                      />
                    </div>
                  ) : null}

                  <div className='space-y-2'>
                    <label className='text-on-surface-variant block px-1 text-[10px] font-bold tracking-[0.15em] uppercase'>
                      {t('auth.form.fields.email')}
                    </label>
                    <Input
                      placeholder='name@example.com'
                      type='email'
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>

                  {mode !== 'forgot' ? (
                    <div className='space-y-2'>
                      <label className='text-on-surface-variant block px-1 text-[10px] font-bold tracking-[0.15em] uppercase'>
                        {t('auth.form.fields.password')}
                      </label>
                      <div className='relative'>
                        <Input
                          className='pr-12'
                          placeholder='••••••••'
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                        />
                        <button
                          className='text-muted-foreground hover:text-primary absolute top-1/2 right-3 -translate-y-1/2 p-1'
                          type='button'
                          onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  ) : null}

                  {mode === 'register' ? (
                    <div className='space-y-2'>
                      <label className='text-on-surface-variant block px-1 text-[10px] font-bold tracking-[0.15em] uppercase'>
                        {t('auth.form.fields.confirmPassword')}
                      </label>
                      <Input
                        placeholder='••••••••'
                        type='password'
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                      />
                    </div>
                  ) : null}

                  <Button
                    className='w-full'
                    disabled={isLoading}
                    size='lg'
                    type='submit'
                    variant='primary-gradient'>
                    <span>
                      {isLoading ? t('auth.login.loading') : t(`auth.form.actions.${mode}`)}
                    </span>
                    <LogIn size={18} />
                  </Button>

                  {mode !== 'forgot' ? (
                    <>
                      {/* Divider */}
                      <div className='flex items-center gap-4 py-2'>
                        <div className='bg-outline-variant/20 h-px grow' />
                        <span className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
                          or
                        </span>
                        <div className='bg-outline-variant/20 h-px grow' />
                      </div>

                      <Button
                        className='text-on-surface-variant w-full'
                        disabled={isLoading}
                        size='lg'
                        type='button'
                        variant='outline'
                        onClick={handleGoogleLogin}>
                        <img
                          alt='Google logo'
                          className='h-5 w-5'
                          src='https://lh3.googleusercontent.com/aida-public/AB6AXuBIaHPkBptnslGbDKY6MRva4MOSUbwZaixONtI3GPno8ivacHLAyW8YKqJA3XNcaeebItWTs0e-rFmB6E7RGKB2eTqcTiMxt8PulAaRpUsc36tMrWONU0CP8u8NmnGemkHFschIwCp5TIVoR1Uqnofw2ierxeAIZA6wm7WJLuwKDt9f1yldOJmHSb5tGcLrZgQdn85y2M4K8zcjjRpLbiwKhTlVt12982gwLBT9IKBhM4EcSFyKIJTIplKqXN34K-3kPJL2CBTwKYja'
                        />
                        <span className='text-sm'>{t('auth.form.actions.google')}</span>
                      </Button>
                    </>
                  ) : null}
                </form>
              </CardContent>
            </Card>

            <div className='mt-10 text-center'>
              <div className='flex items-center justify-center gap-4 pt-4'>
                <span className='text-muted-foreground hover:text-primary pointer-events-none text-[10px] font-medium tracking-widest uppercase transition-colors'>
                  {t('auth.login.termsLabel')}
                </span>
                <div className='bg-outline-variant/40 h-1 w-1 rounded-full' />
                <span className='text-muted-foreground hover:text-primary pointer-events-none text-[10px] font-medium tracking-widest uppercase transition-colors'>
                  {t('auth.login.privacyLabel')}
                </span>
              </div>
              <p className='text-muted-foreground/60 mt-4 text-center text-xs leading-relaxed'>
                {t('auth.login.version', { version: APP_VERSION })}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginPage
