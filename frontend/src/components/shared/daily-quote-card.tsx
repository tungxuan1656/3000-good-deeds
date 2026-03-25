import { QuoteIcon, RefreshCwIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRandomQuote } from '@/hooks/api/use-cultivation'
import { t } from '@/lib/i18n'

export const DailyQuoteCard = () => {
  const { data, isFetching, refetch } = useRandomQuote()
  const apiQuote = data?.data
  const displayQuote = apiQuote?.content || t('quote.card.defaultQuote')
  const displaySource = apiQuote?.author || apiQuote?.source || 'Aesop'

  return (
    <Card className='relative border-none' padding='none' variant='surface'>
      <div className='absolute top-6 left-6 opacity-10'>
        <QuoteIcon className='size-12 rotate-180 fill-stone-500 text-stone-500' />
      </div>

      <div className='absolute top-6 right-6'>
        <Button
          className='size-8 text-stone-400 hover:bg-transparent hover:text-stone-600'
          size='icon'
          variant='ghost'
          onClick={() => refetch()}>
          <RefreshCwIcon
            className={isFetching ? 'size-4 animate-spin' : 'size-4'}
          />
        </Button>
      </div>

      <CardContent className='space-y-6 p-10 pt-16'>
        <p className='font-headline text-xl leading-relaxed text-stone-700 italic'>
          "{displayQuote}"
        </p>

        <div className='flex justify-start pt-2'>
          <p className='text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase'>
            — {displaySource.toUpperCase()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
