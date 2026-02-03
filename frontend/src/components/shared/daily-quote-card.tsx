import { RefreshCwIcon, SparklesIcon } from 'lucide-react'

import { CardSection } from '@/components/shared/card-section'
import { Button } from '@/components/ui/button'
import { useRandomQuote } from '@/hooks/api/use-cultivation'
import { cn } from '@/lib/utils'

import Leaf from './leaf'

type DailyQuoteCardProps = {
  label?: string
  source?: string
  className?: string
}

export const DailyQuoteCard = ({
  label = 'Pháp ngữ mỗi ngày',
  source = 'Lời nhắc từ thiện tâm',
  className,
}: DailyQuoteCardProps) => {
  const { data, isFetching, refetch } = useRandomQuote()
  const apiQuote = data?.data
  const displayQuote = apiQuote?.content || 'Mỗi việc thiện nhỏ đều gieo một hạt giống.'
  const displaySource = [apiQuote?.author ?? '', apiQuote?.source ?? ''].join(', ') || source

  return (
    <CardSection className={cn(className)}>
      <Leaf position='bottom-right' variant={5} />
      <div className='flex items-start gap-4'>
        <div className='bg-primary/60 mt-1 h-12 w-1 rounded-full' />
        <div className='flex flex-1 flex-col'>
          <div className='text-muted-foreground/80 mb-3 flex items-center justify-between gap-2 font-medium'>
            <div className='flex items-center gap-2'>
              <SparklesIcon className='text-accent h-4 w-4' />
              {label}
            </div>
            <Button
              className='h-7 w-7 rounded-full'
              size='icon'
              variant='ghost'
              onClick={() => refetch()}>
              <RefreshCwIcon className={isFetching ? 'h-3.5 w-3.5 animate-spin' : 'h-3.5 w-3.5'} />
            </Button>
          </div>
          <p className='text-foreground/85 text-lg leading-relaxed font-medium whitespace-pre-wrap italic'>
            {displayQuote}
          </p>
          {displaySource && (
            <div className='text-muted-foreground/60 mt-3 flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase'>
              {displaySource}
            </div>
          )}
        </div>
      </div>
    </CardSection>
  )
}
