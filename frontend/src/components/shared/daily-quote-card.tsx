import { SparklesIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { CardSection } from '@/components/shared/card-section'
import { cn } from '@/lib/utils'

type DailyQuoteCardProps = {
  quote: string
  label?: string
  source?: string
  decoration?: ReactNode
  className?: string
}

export const DailyQuoteCard = ({
  quote,
  label = 'Pháp ngữ mỗi ngày',
  source = 'Lời nhắc từ thiện tâm',
  decoration,
  className,
}: DailyQuoteCardProps) => {
  return (
    <CardSection className={cn(className)}>
      {decoration}
      <div className='flex items-start gap-4'>
        <div className='bg-primary/60 mt-1 h-12 w-1 rounded-full' />
        <div>
          <div className='text-muted-foreground/80 mb-3 flex items-center gap-2 text-xs font-semibold'>
            <SparklesIcon className='text-accent h-4 w-4' />
            {label}
          </div>
          <p className='text-foreground/85 text-lg font-medium italic leading-relaxed'>
            {quote}
          </p>
          {source && (
            <div className='text-muted-foreground/60 mt-3 flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] uppercase'>
              {source}
            </div>
          )}
        </div>
      </div>
    </CardSection>
  )
}
