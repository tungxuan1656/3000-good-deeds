import {
  BellDotIcon,
  ChevronRightIcon,
  HeartHandshakeIcon,
  TargetIcon,
  UserCogIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import { LogoutButton } from '@/components/settings'
import {
  CardSection,
  DailyQuoteCard,
  HeaderSection,
  LegalFooter,
  MiniCheckInCard,
  WeeklyRhythmCard,
} from '@/components/shared'
import { PATHS } from '@/lib/constants'
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const ROWS = [
  {
    title: t('pages.more.rows.account.title'),
    description: t('pages.more.rows.account.description'),
    icon: UserCogIcon,
    to: PATHS.SETTINGS,
    bgIcon: 'bg-blue-100',
    color: 'text-blue-500',
  },
  {
    title: t('pages.more.rows.notifications.title'),
    description: t('pages.more.rows.notifications.description'),
    icon: BellDotIcon,
    to: PATHS.SETTINGS,
    bgIcon: 'bg-orange-100',
    color: 'text-amber-500',
  },
  {
    title: t('pages.more.rows.goals.title'),
    description: t('pages.more.rows.goals.description'),
    icon: TargetIcon,
    to: PATHS.GOALS,
    bgIcon: 'bg-secondary/40',
    color: 'text-primary',
  },
  {
    title: t('pages.more.rows.randomActs.title'),
    description: t('pages.more.rows.randomActs.description'),
    icon: HeartHandshakeIcon,
    to: PATHS.INNER_RANDOM_ACTS,
    bgIcon: 'bg-purple-100',
    color: 'text-purple-500',
  },
]

const MorePage = () => {
  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          description={t('pages.more.header.description')}
          note={t('pages.more.header.note')}
          subtitle={t('pages.more.header.subtitle')}
          title={t('pages.more.header.title')}
        />

        <CardSection className='gap-5'>
          {ROWS.map(({ description, icon: Icon, title, to, bgIcon, color }) => (
            <Link key={title} to={to}>
              <div className='flex flex-row items-center gap-4'>
                <div
                  className={cn('flex h-12 w-12 items-center justify-center rounded-2xl', bgIcon)}>
                  <Icon className={cn('text-primary h-5 w-5', color)} />
                </div>
                <div className='flex-1'>
                  <p className='text-foreground text-base font-semibold'>{title}</p>
                  <p className='text-muted-foreground mt-1 text-sm'>{description}</p>
                </div>
                <ChevronRightIcon className='text-muted-foreground' size={20} />
              </div>
            </Link>
          ))}
        </CardSection>
        <LogoutButton className='text-destructive' variant={'ghost'} />

        <LegalFooter />
      </MainColumn>

      <SideColumn hideInMobile>
        <MiniCheckInCard />
        <DailyQuoteCard />
        <WeeklyRhythmCard />
      </SideColumn>
    </MainContainer>
  )
}

export default MorePage
