import { CardSection } from '@/components/shared/card-section'

const GoalsPage = () => {
  return (
    <div className='mx-auto flex w-full max-w-4xl flex-col gap-6'>
      <CardSection as='header'>
        <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
          Mục tiêu
        </p>
        <h1 className='text-foreground mt-2 text-2xl font-semibold'>Giữ nhịp đều đặn</h1>
        <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
          Cài đặt mục tiêu vừa đủ để nuôi dưỡng thói quen tốt.
        </p>
      </CardSection>

      <CardSection className='text-muted-foreground text-center text-sm'>
        Bạn chưa thiết lập mục tiêu nào.
      </CardSection>
    </div>
  )
}

export default GoalsPage
