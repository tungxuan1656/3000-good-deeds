import { useState } from 'react'

import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import {
  CardSection,
  DailyQuoteCard,
  HeaderSection,
  MiniCheckInCard,
  WeeklyRhythmCard,
} from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { t } from '@/lib/i18n'

const InnerJournalEditorPage = () => {
  const [mode, setMode] = useState<'grateful' | 'repent'>('grateful')

  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          description={t('pages.innerJournalEditor.header.description')}
          note={t('pages.innerJournalEditor.header.note')}
          subtitle={t('pages.innerJournalEditor.header.subtitle')}
          title={t('pages.innerJournalEditor.header.title')}
        />

        <CardSection className={`gap-4 ${mode === 'repent' ? 'bg-muted/60' : ''}`}>
          <div className='flex flex-wrap gap-2'>
            <button
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                mode === 'grateful'
                  ? 'border-primary/40 bg-primary/15 text-primary'
                  : 'text-muted-foreground border-black/5 bg-white'
              }`}
              type='button'
              onClick={() => setMode('grateful')}>
              {t('journal.types.gratitude.label')}
            </button>
            <button
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                mode === 'repent'
                  ? 'border-primary/40 bg-primary/15 text-primary'
                  : 'text-muted-foreground border-black/5 bg-white'
              }`}
              type='button'
              onClick={() => setMode('repent')}>
              {t('journal.types.repentance.label')}
            </button>
          </div>
          <Input
            className='rounded-2xl border border-black/5 bg-white px-4 py-2 text-sm'
            placeholder={t('pages.innerJournalEditor.form.titlePlaceholder')}
          />
          <Textarea
            className='min-h-44 w-full resize-none rounded-2xl bg-white px-4 py-3 text-sm leading-relaxed'
            placeholder={t('pages.innerJournalEditor.form.contentPlaceholder')}
          />
          <p className='text-muted-foreground text-sm'>
            {t('pages.innerJournalEditor.form.privateNote')}
          </p>
          <Button className='h-11 w-full rounded-full'>
            {t('pages.innerJournalEditor.form.save')}
          </Button>
        </CardSection>
      </MainColumn>

      <SideColumn>
        <MiniCheckInCard />
        <DailyQuoteCard />
        <WeeklyRhythmCard />
      </SideColumn>
    </MainContainer>
  )
}

export default InnerJournalEditorPage
