import { CtaButton } from './cta-button'

type SiteHeaderProps = {
  webAppUrl: string
}

export function SiteHeader({ webAppUrl }: SiteHeaderProps) {
  return (
    <header className='sticky top-0 z-20 border-b border-slate-200/90 bg-white/95 backdrop-blur-md'>
      <div className='mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6'>
        <a
          href='#top'
          className='text-base font-bold tracking-tight text-slate-900 cursor-pointer'>
          3000 Việc Thiện
        </a>

        <nav
          aria-label='Điều hướng chính'
          className='hidden items-center gap-6 text-sm md:flex'>
          <a
            className='text-slate-700 hover:text-(--brand-primary-strong) cursor-pointer'
            href='#y-nghia-du-an'>
            Ý nghĩa dự án
          </a>
          <a
            className='text-slate-700 hover:text-(--brand-primary-strong) cursor-pointer'
            href='#cach-hoat-dong'>
            Cách hoạt động
          </a>
          <a
            className='text-slate-700 hover:text-(--brand-primary-strong) cursor-pointer'
            href='#faq'>
            FAQ
          </a>
        </nav>

        <CtaButton href={webAppUrl} label='Mở web app' />
      </div>
    </header>
  )
}

