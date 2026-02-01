import { CardSection } from '@/components/shared/card-section'

const SettingsPage = () => {
  return (
    <div className='mx-auto flex w-full max-w-4xl flex-col gap-6'>
      <CardSection as='header'>
        <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
          Cài đặt
        </p>
        <h1 className='text-foreground mt-2 text-2xl font-semibold'>Tuỳ chỉnh trải nghiệm</h1>
        <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
          Bạn có thể thay đổi nhắc nhở, ngôn ngữ và tài khoản tại đây.
        </p>
      </CardSection>

      <CardSection className='text-muted-foreground text-center text-sm'>
        Cài đặt sẽ được cập nhật trong phiên bản tiếp theo.
      </CardSection>
    </div>
  )
}

export default SettingsPage
