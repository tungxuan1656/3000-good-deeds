import { LightbulbIcon, RefreshCwIcon } from 'lucide-react'

import { useRandomActs } from '@/hooks/api/use-cultivation'
import { t } from '@/lib/i18n'

import { Button } from '../ui/button'
import { Card, CardContent, CardHeader } from '../ui/card'

export const KindnessSuggestionCard = () => {
  const { data, isFetching, refetch } = useRandomActs(1)
  const suggestion = data?.data?.[0]

  const suggestionText =
    [suggestion?.name, suggestion?.detail, suggestion?.note].filter(Boolean).join(' - ') ||
    t('pages.handbook.kindnessSuggestion.empty')

  return (
    <Card padding='none' variant='standard'>
      <CardHeader className='flex flex-row items-center justify-between p-8 pb-0'>
        <div className='flex items-center gap-3'>
          <LightbulbIcon className='size-5 text-stone-700' />
          <p className='text-[10px] font-bold tracking-[0.2em] text-stone-700 uppercase'>
            Daily Suggestion
          </p>
        </div>
        <Button
          className='size-8 text-stone-400 hover:bg-transparent hover:text-stone-600'
          size='icon'
          variant='ghost'
          onClick={() => refetch()}>
          <RefreshCwIcon className={isFetching ? 'size-4 animate-spin' : 'size-4'} />
        </Button>
      </CardHeader>

      <CardContent className='space-y-8 p-8 pt-6'>
        <p className='text-sm leading-relaxed font-medium text-stone-600'>{suggestionText}</p>

        <Button
          className='w-full border-stone-200 py-6 text-[10px] font-bold tracking-[0.2em] text-stone-500 uppercase hover:bg-stone-50'
          variant='outline'>
          Accept Suggestion
        </Button>
      </CardContent>
    </Card>
  )
}
