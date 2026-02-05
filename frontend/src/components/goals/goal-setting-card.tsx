import { PlusIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { getGoals, upsertGoal } from '@/api/goals'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Toggle } from '@/components/ui/toggle'

type GoalType = 'weekly' | 'monthly' | 'yearly'

type GoalFormState = {
  targetCount: string
  isEnabled: boolean
}

const GoalSettingCard = () => {
  const goalTypes = useMemo(() => ['weekly', 'monthly', 'yearly'] as const, [])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({})
  const [goalForms, setGoalForms] = useState<Record<GoalType, GoalFormState>>({
    weekly: { targetCount: '1', isEnabled: false },
    monthly: { targetCount: '1', isEnabled: false },
    yearly: { targetCount: '1', isEnabled: false },
  })

  const goalTypeLabel = (type: GoalType) => {
    switch (type) {
      case 'weekly':
        return 'Mục tiêu tuần'
      case 'monthly':
        return 'Mục tiêu tháng'
      case 'yearly':
        return 'Mục tiêu năm'
      default:
        return 'Mục tiêu'
    }
  }

  const loadGoals = async () => {
    setIsLoading(true)

    try {
      const response = await getGoals()
      if (!response.success || !response.data) {
        throw new Error('Không thể tải mục tiêu')
      }

      const goals = response.data
      const forms = goalTypes.reduce(
        (acc, type) => {
          const goal = goals.find((item) => item.type === type)

          acc[type] = {
            targetCount: goal ? String(goal.targetCount) : '1',
            isEnabled: goal?.isEnabled ?? false,
          }

          return acc
        },
        {} as Record<GoalType, GoalFormState>,
      )

      setGoalForms(forms)
    } catch (error) {
      console.error(error)
      toast.error('Không thể tải mục tiêu')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadGoals()
  }, [])

  const handleTargetChange = (type: GoalType, value: string) => {
    setGoalForms((prev) => ({
      ...prev,
      [type]: { ...prev[type], targetCount: value },
    }))
  }

  const handleToggle = async (type: GoalType, isEnabled: boolean) => {
    const targetCount = Number(goalForms[type].targetCount)
    if (!Number.isFinite(targetCount) || targetCount <= 0) {
      toast.error('Số lượng mục tiêu không hợp lệ')

      return
    }

    setGoalForms((prev) => ({
      ...prev,
      [type]: { ...prev[type], isEnabled },
    }))

    setIsSaving((prev) => ({ ...prev, [type]: true }))

    try {
      const response = await upsertGoal({ type, targetCount, isEnabled })
      if (!response.success) {
        throw new Error('Không thể cập nhật mục tiêu')
      }

      await loadGoals()
    } catch (error) {
      console.error(error)
      toast.error('Không thể cập nhật mục tiêu')
    } finally {
      setIsSaving((prev) => ({ ...prev, [type]: false }))
    }
  }

  const handleSave = async (type: GoalType) => {
    const targetCount = Number(goalForms[type].targetCount)
    if (!Number.isFinite(targetCount) || targetCount <= 0) {
      toast.error('Số lượng mục tiêu không hợp lệ')

      return
    }

    setIsSaving((prev) => ({ ...prev, [type]: true }))

    try {
      const response = await upsertGoal({
        type,
        targetCount,
        isEnabled: goalForms[type].isEnabled,
      })
      if (!response.success) {
        throw new Error('Không thể cập nhật mục tiêu')
      }

      await loadGoals()
    } catch (error) {
      console.error(error)
      toast.error('Không thể cập nhật mục tiêu')
    } finally {
      setIsSaving((prev) => ({ ...prev, [type]: false }))
    }
  }

  return (
    <div className='gap-4'>
      <div className='flex items-center justify-between'>
        <div>
          <p className='text-foreground text-base font-semibold'>Thiết lập mục tiêu mới</p>
          <p className='text-muted-foreground mt-1 text-xs'>Chọn nhịp phù hợp với bạn.</p>
        </div>
        <div className='bg-secondary/40 flex h-9 w-9 items-center justify-center rounded-full'>
          <PlusIcon className='text-primary h-4 w-4' />
        </div>
      </div>
      <div className='grid gap-4'>
        {goalTypes.map((type) => (
          <div
            key={type}
            className='flex flex-col gap-3 rounded-2xl border border-black/5 bg-white/70 p-4'>
            <div className='flex items-center justify-between gap-3'>
              <div>
                <p className='text-foreground text-sm font-semibold'>{goalTypeLabel(type)}</p>
                <p className='text-muted-foreground text-xs'>Thiết lập nhịp phù hợp với bạn.</p>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-muted-foreground text-xs'>Tắt/Bật</span>
                <Toggle
                  aria-label={`Bật tắt mục tiêu ${goalTypeLabel(type)}`}
                  className='rounded-full border border-black/5 px-3'
                  disabled={isLoading || isSaving[type]}
                  pressed={goalForms[type].isEnabled}
                  onPressedChange={(value) => void handleToggle(type, value)}>
                  {goalForms[type].isEnabled ? 'Bật' : 'Tắt'}
                </Toggle>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <Label className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
                Số lượng việc thiện
              </Label>
              <Input
                className='rounded-2xl border border-black/5 bg-white px-4 py-2 text-sm'
                disabled={isLoading || isSaving[type]}
                min={1}
                type='number'
                value={goalForms[type].targetCount}
                onChange={(event) => handleTargetChange(type, event.target.value)}
              />
            </div>
            <Button
              className='h-10 w-full rounded-full'
              disabled={isLoading || isSaving[type]}
              onClick={() => void handleSave(type)}>
              {isSaving[type] ? 'Đang lưu...' : 'Lưu mục tiêu'}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GoalSettingCard
