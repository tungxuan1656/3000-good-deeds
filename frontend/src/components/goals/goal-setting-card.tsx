import { CheckIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { getGoals, upsertGoals } from '@/api/goals'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { GOAL_LABELS } from '@/lib/constants'

import { Button } from '../ui/button'

type GoalType = 'weekly' | 'monthly' | 'yearly'

type GoalFormState = {
  targetCount: string
  isEnabled: boolean
}

const GoalSettingCard = () => {
  const goalTypes = useMemo(() => ['weekly', 'monthly', 'yearly'] as const, [])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [goalForms, setGoalForms] = useState<Record<GoalType, GoalFormState>>({
    weekly: { targetCount: '1', isEnabled: false },
    monthly: { targetCount: '1', isEnabled: false },
    yearly: { targetCount: '1', isEnabled: false },
  })

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

  const handleToggle = (type: GoalType, isEnabled: boolean) => {
    setGoalForms((prev) => ({
      ...prev,
      [type]: { ...prev[type], isEnabled },
    }))
  }

  const handleSave = async () => {
    const payload = goalTypes.map((type) => {
      const targetCount = Number(goalForms[type].targetCount)

      return {
        type,
        targetCount,
        isEnabled: goalForms[type].isEnabled,
      }
    })

    const invalid = payload.some(
      (goal) => !Number.isFinite(goal.targetCount) || goal.targetCount <= 0,
    )
    if (invalid) {
      toast.error('Số lượng mục tiêu không hợp lệ')

      return
    }

    setIsSaving(true)

    try {
      const response = await upsertGoals({ goals: payload })
      if (!response.success) {
        throw new Error('Không thể cập nhật mục tiêu')
      }

      await loadGoals()
    } catch (error) {
      console.error(error)
      toast.error('Không thể cập nhật mục tiêu')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-start justify-between'>
        <div>
          <p className='text-foreground text-base font-semibold'>Thiết lập mục tiêu mới</p>
          <p className='text-muted-foreground mt-1 text-xs'>Chọn nhịp phù hợp với bạn.</p>
        </div>
        <Button disabled={isLoading || isSaving} size={'xs'} onClick={() => void handleSave()}>
          <CheckIcon className='mr-1' />
          {isSaving ? 'Đang lưu...' : 'Lưu tất cả mục tiêu'}
        </Button>
      </div>
      <div className='grid gap-2'>
        {goalTypes.map((type) => (
          <div key={type} className='flex items-center justify-between gap-3'>
            <p className='text-foreground text-sm font-semibold'>{GOAL_LABELS[type]}</p>
            <div className='flex items-center gap-5'>
              <Input
                className='w-24 rounded-full text-sm'
                disabled={isLoading || isSaving}
                min={1}
                type='number'
                value={goalForms[type].targetCount}
                onChange={(event) => handleTargetChange(type, event.target.value)}
              />
              <Switch
                checked={goalForms[type].isEnabled}
                disabled={isLoading || isSaving}
                onCheckedChange={(value) => handleToggle(type, value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GoalSettingCard
