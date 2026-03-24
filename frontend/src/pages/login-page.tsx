import { EyeIcon, EyeOffIcon, LogIn } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  AuthBrand,
  AuthField,
  AuthFooter,
  type AuthMode,
  AuthTabs,
  SocialAuth,
} from '@/components/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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

  const [mode, setMode] = useState<AuthMode>('login')
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

  const handleModeChange = (nextMode: AuthMode) => {
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
    <div className='bg-background text-foreground relative flex min-h-screen justify-center p-6'>
      <main className='relative z-10 mx-auto w-full max-w-xl'>
        {/* Brand Identity */}
        <AuthBrand />

        <div className='mx-auto mt-8'>
          <div className='flex flex-col gap-6'>
            {/* Auth Navigation Tabs */}
            <AuthTabs mode={mode} onModeChange={handleModeChange} />

            {/* Login Card */}
            <Card className='relative overflow-hidden' padding='sm'>
              <CardContent>
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

                <form className='relative z-10 space-y-4 md:space-y-6' onSubmit={handleSubmit}>
                  {mode === 'register' && (
                    <AuthField label={t('auth.form.fields.displayName')}>
                      <Input
                        placeholder={t('auth.form.fields.displayName')}
                        value={displayName}
                        onChange={(event) => setDisplayName(event.target.value)}
                      />
                    </AuthField>
                  )}

                  <AuthField label={t('auth.form.fields.email')}>
                    <Input
                      placeholder='name@example.com'
                      type='email'
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </AuthField>

                  {mode !== 'forgot' && (
                    <AuthField label={t('auth.form.fields.password')}>
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
                          {showPassword ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
                        </button>
                      </div>
                    </AuthField>
                  )}

                  {mode === 'register' && (
                    <AuthField label={t('auth.form.fields.confirmPassword')}>
                      <Input
                        placeholder='••••••••'
                        type='password'
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                      />
                    </AuthField>
                  )}

                  <Button
                    className='w-full'
                    disabled={isLoading}
                    type='submit'
                    variant='primary-gradient'>
                    <span>
                      {isLoading ? t('auth.login.loading') : t(`auth.form.actions.${mode}` as any)}
                    </span>
                    <LogIn size={18} />
                  </Button>

                  <SocialAuth
                    isLoading={isLoading}
                    showSocial={mode !== 'forgot'}
                    onGoogleLogin={handleGoogleLogin}
                  />
                </form>
              </CardContent>
            </Card>

            <AuthFooter version={APP_VERSION} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginPage
