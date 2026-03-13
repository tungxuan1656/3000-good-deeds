import { CheckIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useGoals, useUpsertGoals } from '@/hooks/api/use-goals'
import { GOAL_LABELS } from '@/lib/constants'
import { t } from '@/lib/i18n'
import type { GoalType } from '@/types/api'

import { Button } from '../ui/button'

type GoalFormState = {
  targetCount: string
  isEnabled: boolean
}

export const GoalSettingCard = () => {
  const goalTypes = useMemo(() => ['weekly', 'monthly', 'yearly'] as const, [])
  const [goalForms, setGoalForms] = useState<Record<GoalType, GoalFormState>>({
    weekly: { targetCount: '1', isEnabled: false },
    monthly: { targetCount: '1', isEnabled: false },
    yearly: { targetCount: '1', isEnabled: false },
  })

  const { data: goalsResponse, isLoading } = useGoals()
  const upsertGoalsMutation = useUpsertGoals()

  useEffect(() => {
    if (goalsResponse?.success && goalsResponse.data) {
      const goals = goalsResponse.data
      const goalsMap = new Map(goals.map((item) => [item.type, item]))
      const forms = goalTypes.reduce(
        (acc, type) => {
          const goal = goalsMap.get(type)

          acc[type] = {
            targetCount: goal ? String(goal.targetCount) : '1',
            isEnabled: goal?.isEnabled ?? false,
          }

          return acc
        },
        {} as Record<GoalType, GoalFormState>,
      )

      setGoalForms(forms)
    }
  }, [goalsResponse, goalTypes])

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
      toast.error(t('goals.messages.invalidTargetCount'))

      return
    }

    try {
      await upsertGoalsMutation.mutateAsync({ goals: payload })
      toast.success(t('goals.messages.saved'))
    } catch (error) {
      console.error(error)
      toast.error(t('goals.messages.saveFailed'))
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-start justify-between'>
        <div>
          <p className='text-foreground text-base font-semibold'>{t('goals.setting.title')}</p>
          <p className='text-muted-foreground mt-1 text-sm'>{t('goals.setting.subtitle')}</p>
          <p className='text-muted-foreground mt-1 text-sm'>{t('goals.setting.helper')}</p>
        </div>
        <Button
          disabled={isLoading || upsertGoalsMutation.isPending}
          size={'xs'}
          onClick={() => void handleSave()}>
          <CheckIcon className='mr-1' />
          {upsertGoalsMutation.isPending
            ? t('common.actions.saving')
            : t('goals.setting.saveAction')}
        </Button>
      </div>
      <div className='grid gap-2'>
        {goalTypes.map((type) => (
          <div key={type} className='flex items-center justify-between gap-3'>
            <p className='text-foreground text-sm font-semibold'>{GOAL_LABELS[type]}</p>
            <div className='flex items-center gap-5'>
              <Input
                className='w-24 rounded-full text-sm'
                disabled={isLoading || upsertGoalsMutation.isPending}
                min={1}
                type='number'
                value={goalForms[type].targetCount}
                onChange={(event) => handleTargetChange(type, event.target.value)}
              />
              <Switch
                checked={goalForms[type].isEnabled}
                disabled={isLoading || upsertGoalsMutation.isPending}
                onCheckedChange={(value) => handleToggle(type, value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
