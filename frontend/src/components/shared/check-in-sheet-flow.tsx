import { format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { CalendarIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { SheetFooter } from '@/components/ui/sheet'
import { Spinner } from '@/components/ui/spinner'
import { TagButton } from '@/components/ui/tag'
import { Textarea } from '@/components/ui/textarea'
import { MOOD_TAGS } from '@/lib/constants'
import { t } from '@/lib/i18n'

type CreateDeedAction = {
  isPending: boolean
  mutateAsync: (payload: {
    categoryCode: string
    description?: string
    labels?: string
    performedAt: number
  }) => Promise<unknown>
}

type CheckInSheetFlowProps = {
  step: number
  category: string | null
  resetSeed: number
  setStep: Dispatch<SetStateAction<number>>
  setIsOpen: Dispatch<SetStateAction<boolean>>
  createDeed: CreateDeedAction
}

type CheckInFormState = {
  selectedDate: Date
  note: string
  moodTags: string[]
}

const buildInitialFormState = (): CheckInFormState => ({
  selectedDate: new Date(),
  note: '',
  moodTags: [],
})

export const CheckInSheetFlow = ({
  step,
  category,
  resetSeed,
  setStep,
  setIsOpen,
  createDeed,
}: CheckInSheetFlowProps) => {
  const [formState, setFormState] = useState<CheckInFormState>(buildInitialFormState)

  useEffect(() => {
    setFormState(buildInitialFormState())
  }, [resetSeed])

  const formattedDate = useMemo(() => {
    const value = format(formState.selectedDate, t('dates.formats.fullDate'), { locale: vi })

    return value.charAt(0).toUpperCase() + value.slice(1)
  }, [formState.selectedDate])

  const handleContinue = useCallback(() => {
    if (step === 2 && formState.note.length < 5) {
      toast.error(t('checkIn.sheet.validation.minNote'))

      return
    }

    setStep((prev) => Math.min(4, prev + 1))
  }, [formState.note.length, setStep, step])

  const handleSubmit = useCallback(async () => {
    if (!category) return

    const performedAt = new Date(formState.selectedDate)
    performedAt.setHours(0, 0, 0, 0)

    await createDeed.mutateAsync({
      categoryCode: category,
      description: formState.note.trim() || undefined,
      labels: formState.moodTags.length ? formState.moodTags.join(', ') : undefined,
      performedAt: performedAt.getTime(),
    })

    setIsOpen(false)
  }, [category, createDeed, formState.moodTags, formState.note, formState.selectedDate, setIsOpen])

  const toggleMoodTag = useCallback((tag: string) => {
    setFormState((prev) => ({
      ...prev,
      moodTags: prev.moodTags.includes(tag)
        ? prev.moodTags.filter((item) => item !== tag)
        : [...prev.moodTags, tag],
    }))
  }, [])

  return (
    <>
      <div className='px-4 pb-4'>
        {step === 2 && (
          <div className='flex flex-col gap-4'>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className='border-input justify-between rounded-2xl border bg-white px-4 py-2 text-sm'
                    variant='secondary'>
                    <CalendarIcon className='h-4 w-4' />
                    {formattedDate}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align='start' className='bg-white'>
                  <Calendar
                    disabled={(date) => date > new Date()}
                    mode='single'
                    selected={formState.selectedDate}
                    onSelect={(date: Date | undefined) => {
                      if (!date) return

                      setFormState((prev) => ({ ...prev, selectedDate: date }))
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Textarea
              className='min-h-28 w-full resize-none rounded-2xl bg-white px-4 py-3 text-sm leading-relaxed'
              placeholder={t('checkIn.sheet.notePlaceholder')}
              value={formState.note}
              onChange={(event) => {
                const nextNote = event.target.value
                setFormState((prev) => ({ ...prev, note: nextNote }))
              }}
            />
            <p className='text-muted-foreground text-sm'>{t('checkIn.sheet.privateNote')}</p>
          </div>
        )}

        {step === 3 && (
          <div className='flex flex-col gap-4'>
            <div className='flex flex-wrap gap-2'>
              {MOOD_TAGS.map((tag) => {
                return (
                  <TagButton
                    key={tag}
                    isActive={formState.moodTags.includes(tag)}
                    label={tag}
                    onToggle={() => toggleMoodTag(tag)}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>

      <SheetFooter className='gap-3'>
        <div className='flex items-center justify-center gap-2'>
          {[1, 2, 3].map((item) => (
            <span
              key={item}
              className={`h-2 w-2 rounded-full ${item === step ? 'bg-primary' : 'bg-black/10'}`}
            />
          ))}
        </div>
        {step > 1 && (
          <div className='flex w-full items-center justify-between'>
            <Button
              className='h-9 rounded-full px-4 text-sm'
              variant='ghost'
              onClick={() => setStep((prev) => Math.max(1, prev - 1))}>
              <ChevronLeftIcon className='h-4 w-4' />
              {t('onboarding.dialog.back')}
            </Button>
            {step < 3 ? (
              <Button className='h-11 rounded-full px-6' onClick={handleContinue}>
                {t('onboarding.dialog.continue')}
                <ChevronRightIcon className='h-4 w-4' />
              </Button>
            ) : (
              <Button
                className='h-11 rounded-full px-6'
                disabled={createDeed.isPending}
                onClick={handleSubmit}>
                {createDeed.isPending ? <Spinner /> : <CheckIcon className='h-4 w-4' />}
                {createDeed.isPending ? t('common.actions.saving') : t('checkIn.sheet.saveAction')}
              </Button>
            )}
          </div>
        )}
      </SheetFooter>
    </>
  )
}
