import { CtaButton } from '@/components/cta-button'
import { FaqItem } from '@/components/faq-item'
import { FeatureCard } from '@/components/feature-card'
import { SectionBlock } from '@/components/section-block'
import { SiteHeader } from '@/components/site-header'

export default function Home() {
  const webAppUrl = 'https://3000-viec-thien.web.app/'

  return (
    <div className='min-h-screen bg-[var(--background)] text-slate-900'>
      <SiteHeader webAppUrl={webAppUrl} />

      <main id='top'>
        <section className='relative overflow-hidden'>
          <div className='pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[var(--brand-accent)]/20 blur-3xl' />
          <div className='pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[var(--brand-primary)]/15 blur-3xl' />

          <div className='mx-auto w-full max-w-6xl px-6 py-16 md:py-24'>
            <p className='text-xs font-semibold tracking-[0.22em] text-[var(--brand-primary)] uppercase'>
              Nền tảng cộng đồng miễn phí
            </p>
            <h1 className='mt-4 max-w-4xl text-4xl leading-tight font-bold tracking-tight md:text-6xl'>
              3000 Việc Thiện - Theo dõi việc tốt mỗi ngày, miễn phí vĩnh viễn
            </h1>
            <p className='mt-6 max-w-3xl text-base leading-7 text-slate-700 md:text-lg'>
              Landing page giúp bạn hiểu nhanh ý nghĩa dự án, cách hoạt động và
              cách bắt đầu chỉ trong vài phút. Mục tiêu là lan tỏa thói quen làm
              việc tốt bền vững cho cộng đồng Việt Nam.
            </p>
            <div className='mt-8 flex flex-wrap gap-4'>
              <CtaButton href={webAppUrl} label='Bắt đầu dùng miễn phí' />
              <CtaButton
                href={webAppUrl}
                label='Mở webapp chính'
                variant='secondary'
              />
            </div>
          </div>
        </section>

        <SectionBlock
          id='y-nghia-du-an'
          tone='muted'
          title='Vì sao dự án 3000 Việc Thiện ra đời?'
          description='Mục tiêu của dự án là biến việc tốt thành một thói quen bền vững, bắt đầu từ những hành động nhỏ mỗi ngày. Người dùng có thể theo dõi hành trình, duy trì động lực và lan tỏa ảnh hưởng tích cực.'
        />

        <SectionBlock id='cach-hoat-dong' title='Cách bắt đầu trong 3 bước'>
          <div className='mt-6 grid gap-6 md:grid-cols-3'>
            <FeatureCard
              step='Bước 01'
              title='Mở web app'
              description='Truy cập nền tảng từ trình duyệt trên điện thoại hoặc máy tính.'
            />
            <FeatureCard
              step='Bước 02'
              title='Ghi nhận việc tốt'
              description='Lưu lại các hành động tích cực trong ngày để theo dõi tiến trình.'
            />
            <FeatureCard
              step='Bước 03'
              title='Duy trì đều đặn'
              description='Xây dựng chuỗi thói quen và lan tỏa tinh thần thiện nguyện đến cộng đồng.'
            />
          </div>
        </SectionBlock>

        <SectionBlock id='faq' tone='muted' title='Câu hỏi thường gặp'>
          <div className='mt-6 space-y-6'>
            <FaqItem
              question='3000 Việc Thiện có mất phí không?'
              answer='Không. Dự án được định hướng miễn phí vĩnh viễn cho người dùng.'
            />
            <FaqItem
              question='Tôi có thể dùng trên điện thoại không?'
              answer='Có. Bạn có thể mở trực tiếp bằng trình duyệt và lưu ra màn hình chính như một web app.'
            />
            <div className='mt-6'>
              <CtaButton href={webAppUrl} label='Mở web app 3000 Việc Thiện' />
            </div>
          </div>
        </SectionBlock>
      </main>

      <footer className='border-t border-slate-200 bg-white'>
        <div className='mx-auto w-full max-w-6xl px-6 py-8 text-sm text-slate-600'>
          © 3000 Việc Thiện
        </div>
      </footer>
    </div>
  )
}

