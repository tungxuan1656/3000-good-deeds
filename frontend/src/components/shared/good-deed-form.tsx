import { format } from 'date-fns'
import { CalendarIcon, PencilIcon, PlusIcon } from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { TagButton } from '@/components/ui/tag'
import { Textarea } from '@/components/ui/textarea'
import { useCreateDeed, useUpdateDeed } from '@/hooks/api/use-deeds'
import { MOOD_TAGS } from '@/lib/constants'
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import type { CreateDeedRequest, DeedDTO } from '@/types/api'

type GoodDeedInitialValue = Partial<DeedDTO>

type GoodDeedFormProps = {
  mode: 'create' | 'edit'
  initialValue?: GoodDeedInitialValue
  className?: string
  formId?: string
  resetOnSuccess?: boolean
  showHeader?: boolean
  showActions?: boolean
  submitLabel?: string
  onSuccess?: () => void
}

type FormState = {
  selectedDate: Date
  description: string
  selectedMoodTags: string[]
  availableMoodTags: string[]
}

const splitLabels = (value?: string) =>
  value
    ? value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    : []

const getUniqueTags = (tags: string[]) => {
  const deduped: string[] = []
  const seen = new Set<string>()

  for (const tag of tags) {
    const normalized = tag.toLowerCase()
    if (seen.has(normalized)) continue
    seen.add(normalized)
    deduped.push(tag)
  }

  return deduped
}

const buildInitialState = (initialValue?: GoodDeedInitialValue): FormState => {
  const selectedMoodTags = getUniqueTags(splitLabels(initialValue?.labels))
  const availableMoodTags = getUniqueTags([...MOOD_TAGS, ...selectedMoodTags])
  const selectedDate = new Date(
    initialValue?.performedAt || initialValue?.createdAt || Date.now(),
  )

  return {
    selectedDate,
    description: initialValue?.description || '',
    selectedMoodTags,
    availableMoodTags,
  }
}

export const GoodDeedForm = ({
  mode,
  initialValue,
  className,
  formId,
  resetOnSuccess = mode === 'create',
  showHeader = mode === 'create',
  showActions = mode === 'create',
  submitLabel,
  onSuccess,
}: GoodDeedFormProps) => {
  const createDeed = useCreateDeed()
  const updateDeed = useUpdateDeed()

  const [formState, setFormState] = React.useState<FormState>(() =>
    buildInitialState(initialValue),
  )
  const [isCustomMoodInputVisible, setIsCustomMoodInputVisible] =
    React.useState(false)
  const [customMoodValue, setCustomMoodValue] = React.useState('')

  const customMoodInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    setFormState(buildInitialState(initialValue))
    setCustomMoodValue('')
    setIsCustomMoodInputVisible(false)
  }, [initialValue])

  React.useEffect(() => {
    if (!isCustomMoodInputVisible) return
    customMoodInputRef.current?.focus()
  }, [isCustomMoodInputVisible])

  const activeMoodTagSet = React.useMemo(
    () => new Set(formState.selectedMoodTags),
    [formState.selectedMoodTags],
  )

  const datePillLabel = React.useMemo(
    () => format(formState.selectedDate, 'd/M/yyyy'),
    [formState.selectedDate],
  )

  const toggleMoodTag = React.useCallback((tag: string) => {
    setFormState((prev) => ({
      ...prev,
      selectedMoodTags: prev.selectedMoodTags.includes(tag)
        ? prev.selectedMoodTags.filter((item) => item !== tag)
        : [...prev.selectedMoodTags, tag],
    }))
  }, [])

  const addCustomMood = React.useCallback(() => {
    const trimmedMood = customMoodValue.trim()
    if (!trimmedMood) return

    setFormState((prev) => {
      const existingTag = prev.availableMoodTags.find(
        (tag) => tag.toLowerCase() === trimmedMood.toLowerCase(),
      )
      const moodToSelect = existingTag || trimmedMood

      return {
        ...prev,
        availableMoodTags: existingTag
          ? prev.availableMoodTags
          : [...prev.availableMoodTags, trimmedMood],
        selectedMoodTags: prev.selectedMoodTags.includes(moodToSelect)
          ? prev.selectedMoodTags
          : [...prev.selectedMoodTags, moodToSelect],
      }
    })

    setCustomMoodValue('')
    setIsCustomMoodInputVisible(false)
  }, [customMoodValue])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const isSubmitting = createDeed.isPending || updateDeed.isPending
    if (isSubmitting) return

    const trimmedDescription = formState.description.trim()

    if (mode === 'create' && trimmedDescription.length < 5) {
      toast.error(t('checkIn.sheet.validation.minNote'))

      return
    }

    const performedAt = new Date(formState.selectedDate)
    performedAt.setHours(0, 0, 0, 0)

    const payload: CreateDeedRequest = {
      description:
        trimmedDescription.length > 0 ? trimmedDescription : undefined,
      labels: formState.selectedMoodTags.length
        ? formState.selectedMoodTags.join(', ')
        : undefined,
      performedAt: performedAt.getTime(),
    }

    try {
      if (mode === 'edit') {
        if (!initialValue?.id) {
          toast.error(t('deeds.edit.messages.updateFailed'))

          return
        }

        await updateDeed.mutateAsync({
          id: initialValue.id,
          data: payload,
        })

        toast.success(t('deeds.edit.messages.updated'))
      } else {
        await createDeed.mutateAsync(payload)
        toast.success(t('common.success.saved'))
      }

      onSuccess?.()

      if (resetOnSuccess) {
        setFormState(buildInitialState())
        setCustomMoodValue('')
        setIsCustomMoodInputVisible(false)
      }
    } catch {
      // No-op: parent container handles error feedback.
    }
  }

  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      id={formId}
      onSubmit={(event) => void handleSubmit(event)}>
      {showHeader && (
        <div className='flex items-start justify-between gap-4'>
          <div className='space-y-1.5'>
            <h3 className='font-headline text-primary text-2xl font-medium italic'>
              {t('deeds.form.title')}
            </h3>
            <p className='text-muted-foreground text-sm font-light'>
              {t('deeds.form.subtitle')}
            </p>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                aria-label={t('deeds.form.fields.date')}
                className='border-input bg-card text-muted-foreground h-9 justify-between rounded-full border px-3 py-1.5 text-xs'
                type='button'
                variant='secondary'>
                {datePillLabel}
                <CalendarIcon className='size-3.5' />
              </Button>
            </PopoverTrigger>
            <PopoverContent align='end' className='bg-card w-auto p-0'>
              <Calendar
                disabled={(date) => date > new Date()}
                mode='single'
                selected={formState.selectedDate}
                onSelect={(date) =>
                  date &&
                  setFormState((prev) => ({
                    ...prev,
                    selectedDate: date,
                  }))
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {!showHeader && (
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                aria-label={t('deeds.form.fields.date')}
                className='border-input bg-card text-muted-foreground h-9 justify-between rounded-full border px-3 py-1.5 text-xs'
                type='button'
                variant='secondary'>
                {datePillLabel}
                <CalendarIcon className='size-3.5' />
              </Button>
            </PopoverTrigger>
            <PopoverContent align='start' className='bg-card w-auto p-0'>
              <Calendar
                disabled={(date) => date > new Date()}
                mode='single'
                selected={formState.selectedDate}
                onSelect={(date) =>
                  date &&
                  setFormState((prev) => ({
                    ...prev,
                    selectedDate: date,
                  }))
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      <Textarea
        className='bg-muted placeholder:text-muted-foreground/45 min-h-36 resize-none rounded-2xl border-none p-5 text-base focus-visible:ring-0'
        placeholder={t('deeds.form.fields.descriptionPlaceholder')}
        value={formState.description}
        onChange={(event) =>
          setFormState((prev) => ({
            ...prev,
            description: event.target.value,
          }))
        }
      />

      <div className='space-y-3'>
        <p className='text-muted-foreground text-xss font-bold tracking-[0.15em] uppercase'>
          {t('deeds.form.fields.moodHeading')}
        </p>

        <div className='flex flex-wrap gap-2'>
          {formState.availableMoodTags.map((tag) => (
            <TagButton
              key={tag}
              isActive={activeMoodTagSet.has(tag)}
              label={tag}
              onToggle={() => toggleMoodTag(tag)}
            />
          ))}

          <Button
            aria-label={t('deeds.form.actions.addCustomMood')}
            className='rounded-full'
            size='icon-sm'
            type='button'
            variant='outline'
            onClick={() => setIsCustomMoodInputVisible((prev) => !prev)}>
            <PencilIcon />
          </Button>
        </div>

        {isCustomMoodInputVisible && (
          <div className='flex items-center gap-2'>
            <Input
              ref={customMoodInputRef}
              className='h-9 max-w-60 rounded-full text-sm'
              placeholder={t('deeds.form.fields.customMoodPlaceholder')}
              value={customMoodValue}
              onChange={(event) => setCustomMoodValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  addCustomMood()
                }

                if (event.key === 'Escape') {
                  setCustomMoodValue('')
                  setIsCustomMoodInputVisible(false)
                }
              }}
            />

            <Button
              className='rounded-full'
              size='icon-sm'
              type='button'
              variant='secondary'
              onClick={addCustomMood}>
              <PlusIcon />
            </Button>
          </div>
        )}
      </div>

      {showActions && (
        <div className='flex justify-end pt-2'>
          <Button
            className='min-w-36 rounded-2xl px-6 py-6 text-base font-bold shadow-none'
            disabled={createDeed.isPending || updateDeed.isPending}
            type='submit'>
            {createDeed.isPending || updateDeed.isPending
              ? t('common.actions.saving')
              : (submitLabel ??
                (mode === 'create'
                  ? t('deeds.form.actions.record')
                  : t('deeds.form.actions.saveChanges')))}
          </Button>
        </div>
      )}
    </form>
  )
}
