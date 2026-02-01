const GoalsPage = () => {
  return (
    <div className='bg-background min-h-screen px-4 py-6 sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-4xl flex-col gap-6'>
        <header className='rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm'>
          <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
            Mục tiêu
          </p>
          <h1 className='text-foreground mt-2 text-2xl font-semibold'>Giữ nhịp đều đặn</h1>
          <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
            Cài đặt mục tiêu vừa đủ để nuôi dưỡng thói quen tốt.
          </p>
        </header>

        <section className='text-muted-foreground rounded-3xl border border-black/5 bg-white/90 p-6 text-center text-sm shadow-sm'>
          Bạn chưa thiết lập mục tiêu nào.
        </section>
      </div>
    </div>
  )
}

export default GoalsPage
