import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useCreateDeed } from '@/hooks/api/use-deeds'
import { t } from '@/lib/i18n'
import { cn } from '@/lib/utils'

import { Card } from '../ui'

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
    <Card className='flex flex-col gap-4 p-6'>
      <div className='flex items-center justify-between'>
        <h3 className='font-headline text-primary text-lg font-bold'>Record a New Deed</h3>
        <span className='text-muted-foreground text-xs'>
          {new Date().toLocaleDateString('vi-VN')}
        </span>
      </div>

      <p className='text-muted-foreground text-sm'>
        What small spark of goodness did you ignite today?
      </p>

      <Textarea
        className='focus-visible:ring-primary/20 min-h-30 resize-none border-none bg-stone-50 p-4 focus-visible:ring-1 dark:bg-stone-900/50'
        placeholder='Describe your act of kindness...'
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className='space-y-3'>
        <p className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
          How did it feel?
        </p>
        <div className='flex flex-wrap gap-2'>
          {MOOD_TAGS.map((tag) => (
            <button
              key={tag.id}
              className={cn(
                'rounded-full px-3 py-1 text-xs transition-all',
                selectedTags.includes(tag.id)
                  ? 'bg-primary/20 text-primary font-medium'
                  : 'text-muted-foreground bg-stone-100 hover:bg-stone-200 dark:bg-stone-800',
              )}
              onClick={() => handleToggleTag(tag.id)}>
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      <div className='mt-2 flex justify-end'>
        <Button
          className='bg-primary text-primary-foreground shadow-primary/20 rounded-xl px-8 font-bold shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]'
          disabled={createDeed.isPending}
          onClick={handleRecord}>
          {createDeed.isPending ? t('common.actions.saving') : 'Record Deed'}
        </Button>
      </div>
    </Card>
  )
}
