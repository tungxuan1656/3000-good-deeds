import { Loader2Icon } from 'lucide-react'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import {
  CardSection,
  DailyQuoteCard,
  HeaderSection,
  InfoButton,
  MiniCheckInCard,
  WeeklyRhythmCard,
} from '@/components/shared'
import { Button } from '@/components/ui/button'
import { TagButton } from '@/components/ui/tag'
import { Textarea } from '@/components/ui/textarea'
import { useCreateInnerJournalEntry } from '@/hooks/api/use-inner-journal'
import {
  INNER_JOURNAL_IMMUTABLE_NOTE,
  INNER_JOURNAL_TYPE_GUIDANCE,
  INNER_JOURNAL_TYPE_LABELS,
  type InnerJournalType,
  PATHS,
} from '@/lib/constants'
import { INFO_COPY } from '@/lib/info-copy'

const schema = z.object({
  type: z.enum(['gratitude', 'repentance']),
  content: z.string().trim().min(1, 'Bạn có thể viết ngắn thôi — nhưng đừng để trống.'),
})

const InnerJournalPage = () => {
  const [type, setType] = React.useState<InnerJournalType>('gratitude')
  const [content, setContent] = React.useState('')
  const [errorText, setErrorText] = React.useState<string | null>(null)

  const createMutation = useCreateInnerJournalEntry()

  const isSaving = createMutation.isPending

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setErrorText(null)

    const parsed = schema.safeParse({ type, content })
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? 'Nội dung chưa hợp lệ'
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
          (result as any).error?.message ?? (result.error ? String(result.error) : 'Lưu thất bại')
        toast.error(message)

        return
      }

      setContent('')
      toast.success('Đã lưu')
    } catch (_e) {
      toast.error('Lưu thất bại')
    }
  }

  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          action={
            <InfoButton
              description={INFO_COPY.journal.description}
              title={INFO_COPY.journal.title}
            />
          }
          description='Ghi lại quán chiếu để nhìn rõ và thấy được sự chuyển biến của tâm.'
          subtitle='Sổ tay'
          title='Sổ tay quán chiếu'
        />

        <form onSubmit={(event) => void handleSubmit(event)}>
          <CardSection className='gap-4'>
            <div className='flex flex-wrap gap-2'>
              {(Object.keys(INNER_JOURNAL_TYPE_LABELS) as InnerJournalType[]).map((key) => {
                const isActive = key === type

                return (
                  <TagButton
                    key={key}
                    isActive={isActive}
                    label={INNER_JOURNAL_TYPE_LABELS[key]}
                    onToggle={() => setType(key)}
                  />
                )
              })}
            </div>

            <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>
              “{INNER_JOURNAL_TYPE_GUIDANCE[type]}”
            </p>

            <div className='flex flex-col gap-2'>
              <Textarea
                className='min-h-44 w-full resize-none rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm leading-relaxed'
                placeholder='Viết ngắn thôi, chỉ điều bạn thật sự nhận ra trong lòng…'
                value={content}
                onChange={(event) => setContent(event.target.value)}
              />
              <p className='text-muted-foreground text-sm leading-relaxed'>
                {INNER_JOURNAL_IMMUTABLE_NOTE}
              </p>
              {errorText && <p className='text-destructive text-xs'>{errorText}</p>}
            </div>

            <Button disabled={isSaving} type='submit'>
              {isSaving ? (
                <>
                  <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
                  Đang lưu…
                </>
              ) : (
                'Lưu'
              )}
            </Button>

            <Button asChild variant='outline'>
              <Link to={PATHS.INNER_JOURNAL_HISTORY}>Xem lại những ngày cũ</Link>
            </Button>
          </CardSection>
        </form>
      </MainColumn>

      <SideColumn hideInMobile>
        <MiniCheckInCard />
        <DailyQuoteCard />
        <WeeklyRhythmCard />
      </SideColumn>
    </MainContainer>
  )
}

export default InnerJournalPage
