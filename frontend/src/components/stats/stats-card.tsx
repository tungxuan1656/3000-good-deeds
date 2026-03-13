import { LeafIcon } from 'lucide-react'

import { useStatsSummary } from '@/hooks/api/use-stats'
import { t } from '@/lib/i18n'

import { CardSection } from '../shared'
import { EmptyDataView } from '../shared/empty-data-view'
import { SkeletonList } from '../shared/skeleton-list'

export const StatsCard = () => {
  const { data, isLoading } = useStatsSummary()
  const summary = data?.data
  const isEmpty = !isLoading && !summary

  const summaryCards = [
    {
      title: t('stats.card.recordedTitle'),
      value: summary
        ? t('stats.card.totalValue', { count: summary.totalDeeds })
        : t('stats.card.totalValueFallback'),
    },
  ]

  return (
    <>
      {isLoading && <SkeletonList length={2} />}

      {isEmpty && !isLoading && (
        <EmptyDataView
          Icon={<LeafIcon />}
          description={t('stats.card.emptyDescription')}
          title={t('stats.card.emptyTitle')}
        />
      )}

      {!isEmpty && !isLoading && (
        <div className='flex flex-row gap-5'>
          {summaryCards.map((card) => {
            return (
              <CardSection key={card.title} className='flex-1'>
                <div className='flex items-start justify-between gap-3'>
                  <p className='text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase sm:text-xs'>
                    {card.title}
                  </p>
                </div>
                <p className='text-foreground text-xl leading-tight font-semibold sm:text-3xl'>
                  {card.value}
                </p>
              </CardSection>
            )
          })}
        </div>
      )}
    </>
  )
}
