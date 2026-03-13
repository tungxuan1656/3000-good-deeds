import { Loader2Icon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

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
import { useCreateInnerJournalEntry } from '@/hooks/api/use-inner-journal'
import { t } from '@/lib/i18n'

const InnerJournalEditorPage = () => {
  const [mode, setMode] = useState<'grateful' | 'repent'>('grateful')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const createMutation = useCreateInnerJournalEntry()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const normalizedTitle = title.trim()
    const normalizedContent = content.trim()
    const payloadContent = normalizedTitle
      ? `${normalizedTitle}\n\n${normalizedContent}`.trim()
      : normalizedContent

    if (!payloadContent) {
      toast.error(t('common.errors.invalidContent'))

      return
    }

    try {
      const response = await createMutation.mutateAsync({
        type: mode === 'grateful' ? 'gratitude' : 'repentance',
        content: payloadContent,
      })

      if (!response.success) {
        toast.error(response.error || t('common.errors.saveFailed'))

        return
      }

      setTitle('')
      setContent('')
      toast.success(t('common.success.saved'))
    } catch {
      toast.error(t('common.errors.saveFailed'))
    }
  }

  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          description={t('pages.innerJournalEditor.header.description')}
          note={t('pages.innerJournalEditor.header.note')}
          subtitle={t('pages.innerJournalEditor.header.subtitle')}
          title={t('pages.innerJournalEditor.header.title')}
        />

        <form onSubmit={(event) => void handleSubmit(event)}>
          <CardSection className={`gap-4 ${mode === 'repent' ? 'bg-muted/60' : ''}`}>
            <div className='flex flex-wrap gap-2'>
              <button
                className={`rounded-full border px-4 py-2 text-sm font-medium ${
                  mode === 'grateful'
                    ? 'border-primary/40 bg-primary/15 text-primary'
                    : 'text-muted-foreground border-black/5 bg-card'
                }`}
                type='button'
                onClick={() => setMode('grateful')}>
                {t('journal.types.gratitude.label')}
              </button>
              <button
                className={`rounded-full border px-4 py-2 text-sm font-medium ${
                  mode === 'repent'
                    ? 'border-primary/40 bg-primary/15 text-primary'
                    : 'text-muted-foreground border-black/5 bg-card'
                }`}
                type='button'
                onClick={() => setMode('repent')}>
                {t('journal.types.repentance.label')}
              </button>
            </div>
            <Input
              className='rounded-2xl border border-black/5 bg-card px-4 py-2 text-sm'
              placeholder={t('pages.innerJournalEditor.form.titlePlaceholder')}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <Textarea
              className='bg-card min-h-44 w-full resize-none rounded-2xl px-4 py-3 text-sm leading-relaxed'
              placeholder={t('pages.innerJournalEditor.form.contentPlaceholder')}
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
            <p className='text-muted-foreground text-sm'>
              {t('pages.innerJournalEditor.form.privateNote')}
            </p>
            <Button className='h-11 w-full rounded-full' disabled={createMutation.isPending} type='submit'>
              {createMutation.isPending ? (
                <>
                  <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
                  {t('common.actions.saving')}
                </>
              ) : (
                t('pages.innerJournalEditor.form.save')
              )}
            </Button>
          </CardSection>
        </form>
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
