import { CardSection } from '@/components/shared/card-section'

const InnerPage = () => {
  return (
    <div className='mx-auto flex w-full max-w-4xl flex-col gap-6'>
      <CardSection as='header'>
        <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
          Nội tâm
        </p>
        <h1 className='text-foreground mt-2 text-2xl font-semibold'>Kho tàng an yên</h1>
        <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
          Pháp ngữ, sổ tay, thiền thở — tất cả ở một nơi yên tĩnh.
        </p>
      </CardSection>

      <CardSection className='text-muted-foreground text-center text-sm'>
        Chưa có nội dung. Hãy quay lại khi bạn cần tĩnh tâm.
      </CardSection>
    </div>
  )
}

export default InnerPage
