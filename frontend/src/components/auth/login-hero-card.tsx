import { useEffect, useRef } from 'react'

import { PWAGuideDialog } from '@/components/layout'
import {
  Leaf,
  OnboardingDialog,
  type OnboardingDialogHandle,
} from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  APP_VERSION,
  ONBOARDING_CONTENT,
  ONBOARDING_KEYS,
} from '@/lib/constants'
import { t } from '@/lib/i18n'
import {
  markOnboardingAsSeen,
  shouldAutoOpenOnboarding,
} from '@/lib/onboarding-persistence'

import { Card } from '../ui'

type LoginHeroCardProps = {
  error: string | null
  isLoading: boolean
  onGoogleLogin: () => void
}

export const LoginHeroCard = ({
  error,
  isLoading,
  onGoogleLogin,
}: LoginHeroCardProps) => {
  const onboardingDialogRef = useRef<OnboardingDialogHandle>(null)

  useEffect(() => {
    if (shouldAutoOpenOnboarding(localStorage, ONBOARDING_KEYS.general)) {
      onboardingDialogRef.current?.open()
    }
  }, [])

  const handleOnboardingClose = () => {
    markOnboardingAsSeen(localStorage, ONBOARDING_KEYS.general)
  }

  return (
    <>
      <Card className='flex flex-col gap-3'>
        <OnboardingDialog
          ref={onboardingDialogRef}
          flowTitle={ONBOARDING_CONTENT.general.title}
          steps={ONBOARDING_CONTENT.general.steps}
          onClose={handleOnboardingClose}
        />
        <Leaf className='opacity-30' position='top-right' variant={2} />
        <div className='flex items-start gap-4'>
          <div className='bg-card/80 border-border/45 flex h-16 w-16 items-center justify-center rounded-3xl border shadow-sm'>
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
        <p className='text-muted-foreground/90 text-base leading-relaxed'>
          {t('auth.login.heroDescription')}
        </p>
        <p className='text-muted-foreground text-sm'>
          {t('auth.login.privacyNote')}
        </p>

        {error && (
          <div className='rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800'>
            {error}
          </div>
        )}

        <Button
          className='bg-primary hover:bg-primary/90 mt-3 h-12 w-full rounded-full'
          disabled={isLoading}
          onClick={onGoogleLogin}>
          {isLoading ? <Spinner /> : null}
          {isLoading ? t('auth.login.loading') : t('auth.login.googleAction')}
        </Button>
        <PWAGuideDialog showIcon />
      </Card>

      <p className='text-muted-foreground/60 text-center text-xs leading-relaxed'>
        {t('auth.login.termsPrefix')}{' '}
        <span className='font-medium'>{t('auth.login.termsLabel')}</span>{' '}
        {t('auth.login.termsConnector')}{' '}
        <span className='font-medium'>{t('auth.login.privacyLabel')}</span>.
      </p>
      <p className='text-muted-foreground/60 text-center text-xs leading-relaxed'>
        {t('auth.login.version', { version: APP_VERSION })}
      </p>
    </>
  )
}
