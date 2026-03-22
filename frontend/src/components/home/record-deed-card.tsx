import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { useCreateDeed } from '@/hooks/api/use-deeds'
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const MOOD_TAGS = [
  { id: 'peaceful', label: 'an vui' },
  { id: 'grateful', label: 'biết ơn' },
  { id: 'lightHearted', label: 'nhẹ nhàng' },
  { id: 'hồi tưởng', label: 'hồi tưởng' },
  { id: 'warm', label: 'ấm áp' },
  { id: 'calm', label: 'bình an' },
  { id: 'hopeful', label: 'hy vọng' },
]

export const RecordDeedCard = () => {
  const [description, setDescription] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const createDeed = useCreateDeed()

  const handleToggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId],
    )
  }

  const handleRecord = async () => {
    if (!description.trim() || description.length < 5) {
      toast.error(t('checkIn.sheet.validation.minNote'))

      return
    }

    try {
      await createDeed.mutateAsync({
        description: description.trim(),
        labels: selectedTags.join(','),
        performedAt: Date.now(),
      })

      toast.success(t('common.success.saved'))
      setDescription('')
      setSelectedTags([])
    } catch (_error) {
      toast.error(t('common.errors.saveFailed'))
    }
  }

  return (
    <Card padding='none' variant='standard'>
      <CardHeader className='flex flex-row items-start justify-between p-8 pb-0'>
        <div className='space-y-1.5'>
          <CardTitle className='text-2xl font-bold'>Record a New Deed</CardTitle>
          <p className='text-muted-foreground text-sm font-medium'>
            What small spark of goodness did you ignite today?
          </p>
        </div>
        <div className='bg-surface-container-low flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-stone-500'>
          {new Date().toLocaleDateString('en-US')}
          <CalendarIcon className='size-3.5' />
        </div>
      </CardHeader>

      <CardContent className='space-y-6 p-8 pt-6'>
        <Textarea
          className='bg-surface-container-low min-h-36 resize-none border-none p-5 text-base placeholder:text-stone-300 focus-visible:ring-0 dark:bg-stone-900/50'
          placeholder='Describe your act of kindness...'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className='space-y-3'>
          <p className='text-muted-foreground text-[10px] font-bold tracking-[0.15em] uppercase'>
            How did it feel?
          </p>
          <div className='flex flex-wrap gap-2'>
            {MOOD_TAGS.map((tag) => (
              <button
                key={tag.id}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-xs transition-all',
                  selectedTags.includes(tag.id)
                    ? 'border-primary/40 bg-primary/10 text-primary font-bold'
                    : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300 dark:border-stone-800 dark:bg-stone-900',
                )}
                onClick={() => handleToggleTag(tag.id)}>
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        <div className='flex justify-end pt-2'>
          <Button
            className='min-w-36 rounded-lg bg-[#526347] py-6 font-bold text-white shadow-none transition-transform hover:bg-[#46573c] active:scale-[0.98]'
            disabled={createDeed.isPending}
            onClick={handleRecord}>
            {createDeed.isPending ? t('common.actions.saving') : 'Record Deed'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
