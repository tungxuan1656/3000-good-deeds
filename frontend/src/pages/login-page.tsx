import { LoginHeroCard, LoginSideCard } from '@/components/auth'
import { Spinner } from '@/components/ui/spinner'
import { useLoginFlow } from '@/hooks/auth/use-login-flow'

const LoginPage = () => {
  const { isSessionChecked, isLoading, error, handleGoogleLogin } = useLoginFlow()

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
            <LoginHeroCard error={error} isLoading={isLoading} onGoogleLogin={handleGoogleLogin} />
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
