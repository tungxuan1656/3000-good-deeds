import { PauseIcon, PlayIcon, TimerIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { MainColumn, MainContainer, SideColumn } from '@/components/layout'
import {
  CardSection,
  DailyQuoteCard,
  HeaderSection,
  MiniCheckInCard,
  WeeklyRhythmCard,
} from '@/components/shared'
import { Button } from '@/components/ui/button'

const InnerMeditationPage = () => {
  const phases = useMemo(
    () => [
      { label: 'Hít vào', seconds: 4 },
      { label: 'Giữ', seconds: 4 },
      { label: 'Thở ra', seconds: 4 },
    ],
    [],
  )
  const durations = useMemo(
    () => [
      { label: '3 phút', minutes: 3 },
      { label: '5 phút', minutes: 5 },
      { label: '10 phút', minutes: 10 },
    ],
    [],
  )

  const [durationMinutes, setDurationMinutes] = useState(5)
  const [remainingSeconds, setRemainingSeconds] = useState(durationMinutes * 60)
  const [phaseState, setPhaseState] = useState({
    index: 0,
    secondsLeft: phases[0].seconds,
  })
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  const phaseLabel = phases[phaseState.index]?.label ?? phases[0].label
  const timeLabel = useMemo(() => {
    const minutes = Math.floor(remainingSeconds / 60)
    const seconds = remainingSeconds % 60

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }, [remainingSeconds])

  useEffect(() => {
    if (isRunning) return

    setRemainingSeconds(durationMinutes * 60)
    setPhaseState({ index: 0, secondsLeft: phases[0].seconds })
    setIsFinished(false)
  }, [durationMinutes, isRunning, phases])

  useEffect(() => {
    if (!isRunning) return undefined

    const timer = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false)
          setIsFinished(true)

          return 0
        }

        return prev - 1
      })

      setPhaseState((prev) => {
        if (prev.secondsLeft <= 1) {
          const nextIndex = (prev.index + 1) % phases.length

          return { index: nextIndex, secondsLeft: phases[nextIndex].seconds }
        }

        return { ...prev, secondsLeft: prev.secondsLeft - 1 }
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [isRunning, phases])

  return (
    <MainContainer>
      <MainColumn>
        <HeaderSection
          description='Thở chậm để trở về chánh niệm và an trú nơi tâm.'
          subtitle='Thiền & thở'
          title='Trở về với hơi thở'
        />

        <CardSection className='gap-4'>
          <div className='flex flex-col items-center gap-4'>
            <div
              className={`border-primary/20 bg-primary/10 flex h-44 w-44 items-center justify-center rounded-full border ${
                isRunning ? 'ring-primary/20 ring-2' : ''
              }`}>
              <div className='border-primary/30 flex h-28 w-28 items-center justify-center rounded-full border bg-white'>
                <span
                  className={`text-sm font-semibold ${
                    isRunning ? 'text-primary' : 'text-foreground'
                  }`}>
                  {phaseLabel}
                </span>
              </div>
            </div>
            <p className='text-muted-foreground text-xs'>Chu kỳ 4-4-4</p>
            <div className='text-foreground text-2xl font-semibold'>{timeLabel}</div>
          </div>

          <div className='flex flex-wrap items-center justify-center gap-2'>
            {durations.map((item) => (
              <button
                key={item.label}
                className={`rounded-full border px-4 py-2 text-sm font-medium disabled:opacity-50 ${
                  durationMinutes === item.minutes
                    ? 'border-primary/40 bg-primary/15 text-primary'
                    : 'text-muted-foreground border-black/5 bg-white'
                }`}
                disabled={isRunning}
                onClick={() => setDurationMinutes(item.minutes)}>
                {item.label}
              </button>
            ))}
          </div>

          <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center'>
            <Button
              className='h-11 w-full rounded-full sm:w-auto'
              onClick={() => {
                if (remainingSeconds === 0) {
                  setRemainingSeconds(durationMinutes * 60)
                  setPhaseState({ index: 0, secondsLeft: phases[0].seconds })
                }
                setIsRunning(true)
                setIsFinished(false)
              }}>
              <PlayIcon className='h-4 w-4' />
              Bắt đầu
            </Button>
            <Button
              className='text-foreground h-11 w-full rounded-full border border-black/5 bg-white hover:bg-white/80 sm:w-auto'
              disabled={!isRunning}
              variant='secondary'
              onClick={() => {
                setIsRunning(false)
              }}>
              <PauseIcon className='h-4 w-4' />
              Tạm dừng
            </Button>
            <Button
              className='text-muted-foreground hover:text-foreground h-11 w-full rounded-full sm:w-auto'
              variant='ghost'
              onClick={() => {
                setIsRunning(false)
                setIsFinished(false)
                setRemainingSeconds(durationMinutes * 60)
                setPhaseState({ index: 0, secondsLeft: phases[0].seconds })
              }}>
              <TimerIcon className='h-4 w-4' />
              Đặt lại
            </Button>
          </div>

          {isFinished && (
            <div className='text-muted-foreground rounded-2xl border border-black/5 bg-white/80 px-4 py-3 text-sm'>
              Bạn cảm thấy thế nào lúc này?
            </div>
          )}
        </CardSection>
      </MainColumn>

      <SideColumn hideInMobile>
        <MiniCheckInCard />
        <DailyQuoteCard />
        <WeeklyRhythmCard />
      </SideColumn>
    </MainContainer>
  )
}

export default InnerMeditationPage
