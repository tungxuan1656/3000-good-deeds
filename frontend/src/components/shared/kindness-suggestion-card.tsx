import { LightbulbIcon, RefreshCwIcon } from 'lucide-react'

import { useRandomActs } from '@/hooks/api/use-cultivation'
import { t } from '@/lib/i18n'

import { Button } from '../ui/button'
import { Card, CardContent, CardHeader } from '../ui/card'

export const KindnessSuggestionCard = () => {
  const { data, isFetching, refetch } = useRandomActs(1)
  const suggestion = data?.data?.[0]

  const suggestionText =
    [suggestion?.name, suggestion?.detail, suggestion?.note]
      .filter(Boolean)
      .join(' - ') || t('pages.handbook.kindnessSuggestion.empty')

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <div className='flex items-center gap-3'>
          <LightbulbIcon className='size-5 text-stone-700' />
          <p className='text-muted-foreground text-xss font-semibold tracking-[0.2em] uppercase'>
            {t('kindness.suggestion.card.label')}
          </p>
        </div>
        <Button
          className='size-8 text-stone-400 hover:bg-transparent hover:text-stone-600'
          size='icon'
          title={t('kindness.suggestion.card.refreshButton')}
          variant='ghost'
          onClick={() => refetch()}>
          <RefreshCwIcon
            className={isFetching ? 'size-4 animate-spin' : 'size-4'}
          />
        </Button>
      </CardHeader>

      <CardContent className='space-y-6'>
        <p className='text-foreground/70 font-headline text-base leading-relaxed font-medium italic'>
          {suggestionText}
        </p>
      </CardContent>
    </Card>
  )
}
