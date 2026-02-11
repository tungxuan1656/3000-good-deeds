import { useGoogleLogin } from '@react-oauth/google'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { loginGoogle } from '@/api/auth'
import { CardSection } from '@/components/shared/card-section'
import Leaf from '@/components/shared/leaf'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { PATHS } from '@/lib/constants'
import { authActions } from '@/stores/auth-store'

const LoginPage = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setIsLoading(true)
      setError(null)

      try {
        // Send authorization code to backend
        const response = await loginGoogle({
          code: codeResponse.code,
          redirectUri: window.location.origin,
        })

        if (response.success && response.data) {
          // Save auth data to store
          authActions.login(response.data)

          // Redirect to home
          navigate(PATHS.HOME, { replace: true })
        } else {
          setError(response.error || 'Đăng nhập thất bại')
        }
      } catch (err) {
        console.error('Login error:', err)
        setError('Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.')
      } finally {
        setIsLoading(false)
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error)
      setError('Không thể kết nối với Google. Vui lòng thử lại.')
    },
    flow: 'auth-code',
  })

  return (
    <div className='bg-background min-h-screen px-4 py-8 sm:px-6 lg:px-8'>
      <div className='pointer-events-none absolute inset-0 overflow-hidden'>
        <div className='bg-primary/10 absolute -top-24 right-0 h-72 w-72 rounded-full blur-3xl' />
        <div className='bg-secondary/30 absolute top-32 left-6 h-52 w-52 rounded-full blur-3xl' />
      </div>

      <div className='relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl items-center'>
        <div className='grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]'>
          <div className='flex flex-col justify-center gap-6'>
            <CardSection className='flex flex-col gap-6'>
              <Leaf className='opacity-30' position='top-right' variant={2} />
              <div className='flex items-center gap-4'>
                <div className='flex h-16 w-16 items-center justify-center rounded-3xl border border-black/5 bg-white/80 shadow-sm'>
                  <img alt='Mầm từ bi' className='h-10 w-10' src='/icons/icon_sprout.png' />
                </div>
                <div>
                  <p className='text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase'>
                    3000 Việc Thiện
                  </p>
                  <h1 className='text-foreground mt-2 text-2xl font-semibold sm:text-3xl'>
                    Nuôi dưỡng tâm từ bi
                  </h1>
                </div>
              </div>
              <p className='text-muted-foreground/90 text-base leading-relaxed'>
                Mỗi ngày một việc thiện nhỏ, ta trở về với sự tử tế và bình an.
              </p>
              <p className='text-muted-foreground text-sm'>
                Dữ liệu của bạn mặc định riêng tư và có thể xoá hoặc xuất bất cứ lúc nào.
              </p>

              {error && (
                <div className='rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800'>
                  {error}
                </div>
              )}

              <Button
                className='bg-primary hover:bg-primary/90 h-12 w-full rounded-full'
                disabled={isLoading}
                onClick={() => handleGoogleLogin()}>
                {isLoading ? <Spinner /> : null}
                {isLoading ? 'Đang đăng nhập...' : 'Tiếp tục với Google'}
              </Button>
            </CardSection>

            <p className='text-muted-foreground/60 text-center text-xs leading-relaxed'>
              Bằng cách tiếp tục, bạn đồng ý với{' '}
              <span className='underline decoration-dashed underline-offset-2'>
                Điều khoản sử dụng
              </span>{' '}
              và{' '}
              <span className='underline decoration-dashed underline-offset-2'>
                Chính sách riêng tư
              </span>
              .
            </p>
          </div>

          <div className='hidden items-center justify-center lg:flex'>
            <CardSection className='flex w-full max-w-sm flex-col gap-4'>
              <Leaf className='opacity-25' position='bottom-left' variant={3} />
              <div className='text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase'>
                Hành trình nhẹ nhàng
              </div>
              <p className='text-foreground text-lg leading-relaxed font-semibold'>
                “Mỗi việc thiện nhỏ đều nuôi dưỡng tâm.”
              </p>
              <div className='text-muted-foreground/80 text-sm leading-relaxed'>
                Giữ lại những điều tốt đẹp, để bạn thấy sự thay đổi của mình mỗi ngày.
              </div>
            </CardSection>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
