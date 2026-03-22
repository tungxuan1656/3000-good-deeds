import { HandHeartIcon, RefreshCwIcon } from 'lucide-react'

import { useRandomActs } from '@/hooks/api/use-cultivation'
import { INFO_COPY } from '@/lib/constants/info-copy'
import { t } from '@/lib/i18n'

import { Button } from '../ui/button'
import { CardSection } from './card-section'
import { InfoButton } from './info-button'

export const KindnessSuggestionCard = () => {
  const { data, isFetching, refetch } = useRandomActs(1)
  const suggestion = data?.data?.[0]

  const suggestionText =
    [suggestion?.name, suggestion?.detail, suggestion?.note].filter(Boolean).join(' - ') ||
    t('pages.handbook.kindnessSuggestion.empty')

  return (
    <CardSection>
      <div className='flex items-start justify-between gap-3'>
        <div className='flex items-center gap-2'>
          <HandHeartIcon className='text-tertiary size-4' />
          <p className='font-label text-muted-foreground text-xs tracking-[0.15em] uppercase'>
            {t('pages.handbook.kindnessSuggestion.title')}
          </p>
        </div>
        <div className='flex items-center gap-1'>
          <InfoButton
            description={INFO_COPY.randomActs.description}
            title={INFO_COPY.randomActs.title}
          />
          <Button
            className='h-7 w-7 rounded-full'
            size='icon'
            variant='ghost'
            onClick={() => refetch()}>
            <RefreshCwIcon className={isFetching ? 'size-3.5 animate-spin' : 'size-3.5'} />
          </Button>
        </div>
      </div>
      <p className='text-foreground mt-3 text-sm leading-relaxed'>{suggestionText}</p>
    </CardSection>
  )
}
