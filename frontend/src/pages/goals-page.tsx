import { CheckCircle2Icon, PlusIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import { CardSection, DailyQuoteCard, HeaderSection, MiniCheckInCard } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Toggle } from '@/components/ui/toggle'
import { getGoalHistory, getGoals, upsertGoal } from '@/api/goals'
import type { GoalHistoryDTO } from '@/types/api'

const GoalsPage = () => {
  const goalTypes = useMemo(() => ['weekly', 'monthly', 'yearly'] as const, [])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({})
  const [goalForms, setGoalForms] = useState<
    Record<(typeof goalTypes)[number], { targetCount: string; isEnabled: boolean }>
  >({
    weekly: { targetCount: '1', isEnabled: false },
    monthly: { targetCount: '1', isEnabled: false },
    yearly: { targetCount: '1', isEnabled: false },
  })
  const [historyGoals, setHistoryGoals] = useState<GoalHistoryDTO[]>([])

  const goalTypeLabel = (type: (typeof goalTypes)[number]) => {
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

  const formatPeriodLabel = (history: GoalHistoryDTO) => {
    if (history.type === 'weekly') {
      return `Tuần ${history.periodTime}`
    }

    return history.periodTime
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
        {} as Record<(typeof goalTypes)[number], { targetCount: string; isEnabled: boolean }>,
      )

      setGoalForms(forms)

      if (goals.length === 0) {
        setHistoryGoals([])
        return
      }

      const historyResponses = await Promise.all(
        goals.map((goal) => getGoalHistory(goal.id, { limit: 20 })),
      )

      const histories = historyResponses
        .filter((res) => res.success && res.data)
        .flatMap((res) => res.data?.data ?? [])
        .sort((a, b) => b.startDate - a.startDate)

      setHistoryGoals(histories)
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

  const handleTargetChange = (type: (typeof goalTypes)[number], value: string) => {
    setGoalForms((prev) => ({
      ...prev,
      [type]: { ...prev[type], targetCount: value },
    }))
  }

  const handleToggle = async (type: (typeof goalTypes)[number], isEnabled: boolean) => {
    const targetCount = Number(goalForms[type].targetCount)
    if (!Number.isFinite(targetCount) || targetCount <= 0) {
      toast.error('Số lượng mục tiêu không hợp lệ')
      return
    }

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

  const handleSave = async (type: (typeof goalTypes)[number]) => {
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
    <MainContainer>
      <MainColumn>
        <HeaderSection
          description='Đặt mục tiêu vừa sức để nuôi dưỡng thói quen thiện.'
          subtitle='Mục tiêu'
          title='Giữ nhịp đều đặn'
        />

        {isLoading && (
          <div className='flex flex-col gap-4'>
            {[1, 2].map((item) => (
              <div
                key={item}
                className='rounded-2xl border border-black/5 bg-white/80 p-4 shadow-sm'>
                <div className='bg-muted mb-3 h-4 w-32 animate-pulse rounded-full' />
                <div className='bg-muted h-20 w-full animate-pulse rounded-2xl' />
              </div>
            ))}
          </div>
        )}

        {!isLoading && historyGoals.length === 0 && (
          <CardSection className='flex flex-col items-center gap-3 text-center'>
            <p className='text-muted-foreground text-sm'>Bạn chưa có lịch sử mục tiêu.</p>
          </CardSection>
        )}

        {!isLoading && (
          <CardSection className='gap-4'>
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
                      <p className='text-muted-foreground text-xs'>
                        Thiết lập nhịp phù hợp với bạn.
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-muted-foreground text-xs'>Tắt/Bật</span>
                      <Toggle
                        aria-label={`Bật tắt mục tiêu ${goalTypeLabel(type)}`}
                        className='rounded-full border border-black/5 px-3'
                        pressed={goalForms[type].isEnabled}
                        onPressedChange={(value) => {
                          setGoalForms((prev) => ({
                            ...prev,
                            [type]: { ...prev[type], isEnabled: value },
                          }))
                          void handleToggle(type, value)
                        }}>
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
                      min={1}
                      type='number'
                      value={goalForms[type].targetCount}
                      onChange={(event) => handleTargetChange(type, event.target.value)}
                    />
                  </div>
                  <Button
                    className='h-10 w-full rounded-full'
                    disabled={isSaving[type]}
                    onClick={() => void handleSave(type)}>
                    {isSaving[type] ? 'Đang lưu...' : 'Lưu mục tiêu'}
                  </Button>
                </div>
              ))}
            </div>
          </CardSection>
        )}

        {!isLoading && historyGoals.length > 0 && (
          <CardSection className='gap-4'>
            <p className='text-foreground text-base font-semibold'>Lịch sử mục tiêu</p>
            <div className='flex flex-col gap-3'>
              {historyGoals.map((goal) => (
                <div
                  key={goal.id}
                  className='flex flex-col gap-2 rounded-2xl border border-black/5 bg-white/80 p-4'>
                  <div className='flex items-center justify-between'>
                    <p className='text-foreground text-sm font-semibold'>
                      {goalTypeLabel(goal.type)}
                    </p>
                    <span className='text-muted-foreground text-xs'>{formatPeriodLabel(goal)}</span>
                  </div>
                  <p className='text-muted-foreground text-xs'>
                    Mục tiêu {goal.targetCount} việc thiện
                  </p>
                  <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                    <CheckCircle2Icon className='text-primary h-3.5 w-3.5' />
                    {goal.completed
                      ? 'Đã hoàn thành'
                      : `Hoàn thành ${goal.actualCount}/${goal.targetCount}`}
                  </div>
                </div>
              ))}
            </div>
          </CardSection>
        )}
      </MainColumn>

      <SideColumn>
        <MiniCheckInCard />
        <DailyQuoteCard />
      </SideColumn>
    </MainContainer>
  )
}

export default GoalsPage
