import { PauseIcon, PlayIcon, TimerIcon } from 'lucide-react'
import { useState } from 'react'

import { CardSection } from '@/components/shared/card-section'
import { Button } from '@/components/ui/button'

const InnerMeditationPage = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [phase, setPhase] = useState('Hít vào')
  const [isFinished, setIsFinished] = useState(false)

  return (
    <div className='mx-auto flex w-full max-w-3xl flex-col gap-4'>
      <CardSection as='header'>
        <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
          Thiền & thở
        </p>
        <h1 className='text-foreground mt-2 text-2xl font-semibold tracking-tight'>
          Trở về với hơi thở
        </h1>
        <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
          Một vòng thở chậm để bạn dịu lại.
        </p>
      </CardSection>

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
                {phase}
              </span>
            </div>
          </div>
          <p className='text-muted-foreground text-xs'>Chu kỳ 4-4-4</p>
          <div className='text-foreground text-2xl font-semibold'>05:00</div>
        </div>

        <div className='flex flex-wrap items-center justify-center gap-2'>
          {['3 phút', '5 phút', '10 phút'].map((item) => (
            <button
              key={item}
              className='text-muted-foreground rounded-full border border-black/5 bg-white px-4 py-2 text-sm font-medium disabled:opacity-50'
              disabled={isRunning}>
              {item}
            </button>
          ))}
        </div>

        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center'>
          <Button
            className='h-11 w-full rounded-full sm:w-auto'
            onClick={() => {
              setIsRunning(true)
              setIsFinished(false)
              setPhase('Hít vào')
            }}>
            <PlayIcon className='h-4 w-4' />
            Bắt đầu
          </Button>
          <Button
            className='text-foreground h-11 w-full rounded-full border border-black/5 bg-white hover:bg-white/80 sm:w-auto'
            variant='secondary'
            disabled={!isRunning}
            onClick={() => {
              setIsRunning(false)
              setPhase('Giữ')
            }}>
            <PauseIcon className='h-4 w-4' />
            Tạm dừng
          </Button>
          <Button
            className='text-muted-foreground hover:text-foreground h-11 w-full rounded-full sm:w-auto'
            variant='ghost'
            onClick={() => {
              setIsRunning(false)
              setIsFinished(true)
              setPhase('Thở ra')
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
    </div>
  )
}

export default InnerMeditationPage
