import { Button } from '@/components/ui/button'
import { t } from '@/lib/i18n'

interface SocialAuthProps {
  isLoading: boolean
  onGoogleLogin: () => void
  showSocial?: boolean
}

export const SocialAuth = ({ isLoading, onGoogleLogin, showSocial = true }: SocialAuthProps) => {
  if (!showSocial) return null

  return (
    <>
      {/* Divider */}
      <div className='flex items-center'>
        <div className='bg-outline-variant/20 h-px grow' />
        <span className='text-muted-foreground text-xss font-bold tracking-widest uppercase'>
          {t('common.actions.or')}
        </span>
        <div className='bg-outline-variant/20 h-px grow' />
      </div>

      <Button
        className='text-on-surface-variant w-full'
        disabled={isLoading}
        type='button'
        variant='outline'
        onClick={onGoogleLogin}>
        <img
          alt='Google logo'
          className='h-5 w-5'
          src='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/500px-Google_%22G%22_logo.svg.png'
        />
        <span className='text-sm'>{t('auth.form.actions.google')}</span>
      </Button>
    </>
  )
}
