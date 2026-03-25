import { QuoteIcon, RefreshCwIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useRandomQuote } from '@/hooks/api/use-cultivation'
import { t } from '@/lib/i18n'

export const DailyQuoteCard = () => {
  const { data, isFetching, refetch } = useRandomQuote()
  const apiQuote = data?.data
  const displayQuote = apiQuote?.content || t('quote.card.defaultQuote')

  return (
    <Card className='relative' variant='surface'>
      <div className='absolute top-3 left-3 opacity-10'>
        <QuoteIcon className='size-8 rotate-180 fill-stone-500 text-stone-500' />
      </div>

      <div className='absolute top-3 right-3'>
        <Button
          className='size-8 text-stone-400 hover:bg-transparent hover:text-stone-600'
          size='icon'
          title={t('quote.card.refreshButton')}
          variant='ghost'
          onClick={() => refetch()}>
          <RefreshCwIcon
            className={isFetching ? 'size-4 animate-spin' : 'size-4'}
          />
        </Button>
      </div>

      <CardContent className='mt-5 space-y-6'>
        <p className='font-headline text-foreground/80 text-lg leading-relaxed italic'>
          "{displayQuote}"
        </p>

        <div className='flex flex-col items-end gap-0.5'>
          <p className='font-headline text-muted-foreground text-xs font-medium tracking-wider uppercase'>
            {t('quote.card.authorPrefix')}
            {[apiQuote?.author].filter(Boolean).join(', ')}
            {t('quote.card.authorSuffix')}
          </p>
          {apiQuote?.source ? (
            <p className='font-headline text-muted-foreground/70 tracking-xs text-xs font-medium'>
              {apiQuote?.source}
            </p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
