import { CardSection } from '@/components/shared/card-section'

const TimelinePage = () => {
  return (
    <div className='mx-auto flex w-full max-w-4xl flex-col gap-6'>
      <CardSection as='header'>
        <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
          Hành trình
        </p>
        <h1 className='text-foreground mt-2 text-2xl font-semibold'>Nhật ký việc thiện</h1>
        <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
          Nơi lưu giữ những điều tốt đẹp theo dòng thời gian.
        </p>
      </CardSection>

      <CardSection className='text-muted-foreground text-center text-sm'>
        Chưa có việc thiện nào. Hãy bắt đầu từ một việc nhỏ.
      </CardSection>
    </div>
  )
}

export default TimelinePage
