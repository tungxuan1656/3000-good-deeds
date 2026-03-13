import { Link } from 'react-router-dom'

import { PWAGuideDialog } from '@/components/layout'
import { CardSection, Leaf, TourGuideButton } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { APP_VERSION, ONBOARDING_CONTENT, ONBOARDING_KEYS, PATHS } from '@/lib/constants'
import { t } from '@/lib/i18n'

type LoginHeroCardProps = {
  error: string | null
  isLoading: boolean
  onGoogleLogin: () => void
}

export const LoginHeroCard = ({ error, isLoading, onGoogleLogin }: LoginHeroCardProps) => {
  return (
    <>
      <CardSection className='flex flex-col gap-3'>
        <Leaf className='opacity-30' position='top-right' variant={2} />
        <div className='flex items-start justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <div className='flex h-16 w-16 items-center justify-center rounded-3xl border border-black/5 bg-card/80 shadow-sm'>
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
          onClick={onGoogleLogin}>
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
    </>
  )
}
