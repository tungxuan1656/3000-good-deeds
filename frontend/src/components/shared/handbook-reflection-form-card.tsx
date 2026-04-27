import { BookOpenIcon, HeartIcon, Loader2Icon } from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'

import { Card } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useCreateInnerJournalEntry } from '@/hooks/api/use-inner-journal'
import {
  INNER_JOURNAL_TYPES,
  type InnerJournalType,
} from '@/lib/constants/journal'
import { innerJournalSchema } from '@/lib/forms/form-schemas'
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export const HandbookReflectionFormCard = () => {
  const [type, setType] = React.useState<InnerJournalType>('gratitude')
  const [content, setContent] = React.useState('')
  const [errorText, setErrorText] = React.useState<string | null>(null)

  const createMutation = useCreateInnerJournalEntry()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setErrorText(null)

    const parsed = innerJournalSchema.safeParse({ type, content })
    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? t('common.errors.invalidContent')
      setErrorText(message)

      return
    }

    try {
      const result = await createMutation.mutateAsync({
        type: parsed.data.type,
        content: parsed.data.content,
      })

      if (!result.success) {
        const message =
          (result as any).error?.message ??
          (result.error ? String(result.error) : t('common.errors.saveFailed'))
        toast.error(message)

        return
      }

      setContent('')
      toast.success(t('common.success.saved'))
    } catch {
      toast.error(t('common.errors.saveFailed'))
    }
  }

  return (
    <form onSubmit={(event) => void handleSubmit(event)}>
      <Card className='gap-6'>
        <div className='flex items-center gap-4 pb-5'>
          {INNER_JOURNAL_TYPES.map((key) => {
            const isActive = key === type

            return (
              <button
                key={key}
                className={`inline-flex items-center gap-1.5 border-b px-1 pb-2 text-sm transition-colors ${
                  isActive
                    ? 'text-foreground border-primary font-medium'
                    : 'text-muted-foreground border-transparent'
                }`}
                type='button'
                onClick={() => setType(key)}>
                {key === 'gratitude' ? (
                  <HeartIcon
                    className={cn(
                      'text-primary size-3.5',
                      isActive ? 'fill-primary' : '',
                    )}
                  />
                ) : (
                  <BookOpenIcon
                    className={cn(
                      'text-primary size-3.5',
                      isActive ? 'fill-primary' : '',
                    )}
                  />
                )}
                {t(`journal.types.${key}.label`)}
              </button>
            )
          })}
        </div>

        <div className='flex flex-col gap-1'>
          <p className='text-muted-foreground text-xss tracking-widest uppercase'>
            {t('journal.page.form.inquiryLabel')}
          </p>
          <p className='font-headline text-foreground text-base leading-snug italic md:text-lg'>
            {t(`journal.page.form.questions.${type}`)}
          </p>

          <div className='relative mt-2 space-y-2'>
            <Textarea
              className='placeholder:text-muted-foreground/55 bg-secondary/20 min-h-56 w-full resize-none rounded-md border-none px-5 py-4 text-base leading-relaxed'
              placeholder={t('journal.page.form.placeholder')}
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
          </div>
        </div>

        <p className='text-muted-foreground/70 mt-3 text-xs leading-relaxed md:text-sm'>
          {t('journal.page.immutableNote')}
        </p>
        {errorText && <p className='text-destructive text-xs'>{errorText}</p>}

        <div className='flex items-center justify-end gap-4 pt-2'>
          <Button
            className='min-w-44'
            disabled={createMutation.isPending}
            type='submit'>
            {createMutation.isPending ? (
              <>
                <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
                {t('common.actions.saving')}
              </>
            ) : (
              t('journal.page.form.submitLabel')
            )}
          </Button>
        </div>
      </Card>
    </form>
  )
}
