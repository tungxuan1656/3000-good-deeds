import { PauseIcon, PlayIcon, TimerIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

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
import { INFO_COPY } from '@/lib/constants/info-copy'
import { t } from '@/lib/i18n'

const InnerMeditationPage = () => {
  const phases = useMemo(
    () => [
      { label: t('pages.innerMeditation.phases.inhale'), seconds: 4 },
      { label: t('pages.innerMeditation.phases.hold'), seconds: 4 },
      { label: t('pages.innerMeditation.phases.exhale'), seconds: 4 },
    ],
    [],
  )
  const durations = useMemo(
    () => [
      { label: t('pages.innerMeditation.durations.3m'), minutes: 3 },
      { label: t('pages.innerMeditation.durations.5m'), minutes: 5 },
      { label: t('pages.innerMeditation.durations.10m'), minutes: 10 },
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
          action={
            <InfoButton
              description={INFO_COPY.breathing.description}
              title={INFO_COPY.breathing.title}
            />
          }
          description={t('pages.innerMeditation.header.description')}
          note={t('pages.innerMeditation.header.note')}
          subtitle={t('pages.innerMeditation.header.subtitle')}
          title={t('pages.innerMeditation.header.title')}
        />

        <CardSection className='gap-4'>
          <div className='flex flex-col items-center gap-4'>
            <div
              className={`border-primary/20 bg-primary/10 flex h-44 w-44 items-center justify-center rounded-full border ${
                isRunning ? 'ring-primary/20 ring-2' : ''
              }`}>
              <div className='border-primary/30 bg-card flex h-28 w-28 items-center justify-center rounded-full border'>
                <span
                  className={`text-sm font-semibold ${
                    isRunning ? 'text-primary' : 'text-foreground'
                  }`}>
                  {phaseLabel}
                </span>
              </div>
            </div>
            <p className='text-muted-foreground text-xs'>{t('pages.innerMeditation.cycle')}</p>
            <div className='text-foreground text-2xl font-semibold'>{timeLabel}</div>
          </div>

          <div className='flex flex-wrap items-center justify-center gap-2'>
            {durations.map((item) => (
              <button
                key={item.label}
                className={`rounded-full border px-4 py-2 text-sm font-medium disabled:opacity-50 ${
                  durationMinutes === item.minutes
                    ? 'border-primary/40 bg-primary/15 text-primary'
                    : 'text-muted-foreground bg-card border-black/5'
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
              {t('pages.innerMeditation.actions.start')}
            </Button>
            <Button
              className='text-foreground bg-card hover:bg-card/80 h-11 w-full rounded-full border border-black/5 sm:w-auto'
              disabled={!isRunning}
              variant='secondary'
              onClick={() => {
                setIsRunning(false)
              }}>
              <PauseIcon className='h-4 w-4' />
              {t('pages.innerMeditation.actions.pause')}
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
              {t('pages.innerMeditation.actions.reset')}
            </Button>
          </div>

          {isFinished && (
            <div className='text-muted-foreground bg-card/80 rounded-2xl border border-black/5 px-4 py-3 text-sm'>
              {t('pages.innerMeditation.finishedPrompt')}
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
