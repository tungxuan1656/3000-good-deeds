const InnerPage = () => {
  return (
    <div className='bg-background min-h-screen px-4 py-6 sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-4xl flex-col gap-6'>
        <header className='rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm'>
          <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
            Nội tâm
          </p>
          <h1 className='text-foreground mt-2 text-2xl font-semibold'>Kho tàng an yên</h1>
          <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
            Pháp ngữ, sổ tay, thiền thở — tất cả ở một nơi yên tĩnh.
          </p>
        </header>

        <section className='text-muted-foreground rounded-3xl border border-black/5 bg-white/90 p-6 text-center text-sm shadow-sm'>
          Chưa có nội dung. Hãy quay lại khi bạn cần tĩnh tâm.
        </section>
      </div>
    </div>
  )
}

export default InnerPage
