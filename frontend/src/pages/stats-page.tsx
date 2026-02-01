import { CardSection } from '@/components/shared/card-section'

const StatsPage = () => {
  return (
    <div className='mx-auto flex w-full max-w-4xl flex-col gap-6'>
      <CardSection as='header'>
        <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
          Thống kê
        </p>
        <h1 className='text-foreground mt-2 text-2xl font-semibold'>Nhìn lại hành trình</h1>
        <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
          Một góc nhỏ để thấy rõ nhịp điệu thiện lành của bạn.
        </p>
      </CardSection>

      <CardSection className='text-muted-foreground text-center text-sm'>
        Chưa có dữ liệu thống kê. Hãy ghi nhận vài việc thiện đầu tiên.
      </CardSection>
    </div>
  )
}

export default StatsPage
