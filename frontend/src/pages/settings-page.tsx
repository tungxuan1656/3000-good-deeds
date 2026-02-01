const SettingsPage = () => {
  return (
    <div className='bg-background min-h-screen px-4 py-6 sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-4xl flex-col gap-6'>
        <header className='rounded-3xl border border-black/5 bg-white/90 p-6 shadow-sm'>
          <p className='text-muted-foreground text-xs font-semibold tracking-widest uppercase'>
            Cài đặt
          </p>
          <h1 className='text-foreground mt-2 text-2xl font-semibold'>Tuỳ chỉnh trải nghiệm</h1>
          <p className='text-muted-foreground mt-3 text-sm leading-relaxed'>
            Bạn có thể thay đổi nhắc nhở, ngôn ngữ và tài khoản tại đây.
          </p>
        </header>

        <section className='text-muted-foreground rounded-3xl border border-black/5 bg-white/90 p-6 text-center text-sm shadow-sm'>
          Cài đặt sẽ được cập nhật trong phiên bản tiếp theo.
        </section>
      </div>
    </div>
  )
}

export default SettingsPage
