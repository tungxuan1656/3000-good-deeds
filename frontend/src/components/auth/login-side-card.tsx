import { CardSection, Leaf } from '@/components/shared'
import { t } from '@/lib/i18n'

export const LoginSideCard = () => {
  return (
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
  )
}
