import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Cloud,
  Heart,
  HeartHandshake,
  Leaf,
  Monitor,
  Quote,
  Shield,
  ShieldCheck,
  Smartphone,
  Sprout,
  Sun,
  Target,
  Users,
} from 'lucide-react'
import Link from 'next/link'

import { FaqSection } from '@/components/faq-section'
import { buildWebAppCtaUrl, getWebAppLoginUrl } from '@/lib/cta-links'

const INSTALL_OPTIONS = [
  {
    icon: Smartphone,
    title: 'Trên iPhone (Safari)',
    steps: [
      'Mở trang web và đăng nhập',
      'Nhấn nút Chia sẻ ở thanh dưới',
      'Chọn "Thêm vào Màn hình chính"',
    ],
  },
  {
    icon: Monitor,
    title: 'Trên Android (Chrome)',
    steps: [
      'Mở trang web và đăng nhập',
      'Nhấn menu dấu ba chấm',
      'Chọn "Thêm vào màn hình chính"',
    ],
  },
]

const LandingPage = () => {
  const appLoginUrl = getWebAppLoginUrl()

  return (
    <div className='bg-background text-foreground selection:bg-primary/20 flex min-h-screen flex-col'>
      <header className='border-border/50 bg-background/90 sticky top-0 z-50 w-full border-b backdrop-blur-md'>
        <div className='container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6'>
          <div className='flex items-center gap-2'>
            <div className='bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg'>
              <Heart className='h-5 w-5 fill-current' />
            </div>
            <span className='font-headline text-lg font-bold tracking-tight sm:text-xl'>
              3000 Việc Thiện
            </span>
          </div>
          <nav className='text-muted-foreground hidden items-center gap-8 text-sm font-medium lg:flex'>
            <Link
              className='hover:text-foreground transition-colors'
              href='#ve-du-an'>
              Về dự án
            </Link>
            <Link
              className='hover:text-foreground transition-colors'
              href='#y-nghia'>
              Ý nghĩa
            </Link>
            <Link
              className='hover:text-foreground transition-colors'
              href='#tinh-nang'>
              Tính năng
            </Link>
            <Link
              className='hover:text-foreground transition-colors'
              href='#cai-dat'>
              Cài đặt
            </Link>
            <Link
              className='hover:text-foreground transition-colors'
              href='#faq'>
              Hỏi đáp
            </Link>
          </nav>
          <div className='flex items-center gap-2 sm:gap-3'>
            <Link
              className='hover:text-primary hidden text-sm font-medium transition-colors sm:inline-flex'
              href={appLoginUrl}>
              Đăng nhập
            </Link>
            <Link
              className='bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold shadow-sm transition-all hover:scale-105 active:scale-95 sm:px-5'
              href={buildWebAppCtaUrl('header_get_started', 'login')}>
              Bắt đầu ngay
            </Link>
          </div>
        </div>
      </header>

      <main className='flex-1'>
        <section className='relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 lg:pt-28 lg:pb-32'>
          <div className='absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(82,99,71,0.15),rgba(255,255,255,0))]' />
          <div className='container mx-auto max-w-6xl px-4 sm:px-6'>
            <div className='mx-auto max-w-4xl text-center'>
              <div className='border-primary/20 bg-primary/5 text-primary mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium'>
                <Sprout className='h-4 w-4' />
                <span>Gieo mầm thiện, gặt bình an</span>
              </div>
              <h1 className='font-headline text-foreground text-5xl/tight font-bold tracking-tight sm:text-6xl/tight lg:text-7xl/tight'>
                Hành Trình Gieo Hạt <br />
                <span className='text-primary'>Giống Thiện</span>
              </h1>
              <p className='text-muted-foreground mx-auto mt-6 max-w-2xl text-base leading-7 md:text-lg md:leading-relaxed'>
                Mỗi hành động nhỏ bé hôm nay là một đóa hoa nở rộ ngày mai. 3000
                Việc Thiện là nơi tĩnh lặng để bạn theo dõi, nuôi dưỡng lòng
                trắc ẩn và lan tỏa những điều tốt đẹp mỗi ngày.
              </p>
              <div className='mt-8 flex flex-col items-center justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4'>
                <Link
                  className='group bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-base font-semibold shadow-lg transition-all'
                  href={buildWebAppCtaUrl('hero_start_journey', 'login')}>
                  Bắt đầu hành trình
                  <ArrowRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
                </Link>
                <Link
                  className='bg-surface-container text-foreground hover:bg-surface-container-high inline-flex h-12 items-center justify-center rounded-full px-7 text-base font-medium transition-colors'
                  href='#y-nghia'>
                  Tìm hiểu thêm
                </Link>
              </div>
              <div className='text-muted-foreground mt-8 flex flex-wrap items-center justify-center gap-3 text-sm sm:mt-10 sm:gap-5'>
                <div className='flex items-center gap-1'>
                  <CheckCircle2 className='text-primary h-4 w-4' />
                  <span>Miễn phí vĩnh viễn</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Shield className='text-primary h-4 w-4' />
                  <span>Bảo mật dữ liệu</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className='bg-surface-container-low scroll-mt-24 py-16 md:py-20 lg:py-24'
          id='ve-du-an'>
          <div className='container mx-auto max-w-6xl px-4 sm:px-6'>
            <div className='grid gap-10 md:grid-cols-2 md:items-start md:gap-12'>
              <div>
                <h2 className='font-headline text-foreground text-3xl font-bold tracking-tight sm:text-4xl'>
                  Vì sao dự án 3000 Việc Thiện ra đời?
                </h2>
                <div className='text-muted-foreground mt-6 space-y-5 text-base leading-7 md:text-lg md:leading-relaxed'>
                  <p>
                    Chúng tôi xây dự án này để giúp bạn giữ thói quen làm điều
                    tốt theo cách đơn giản, nhẹ nhàng và bền vững.
                  </p>
                  <p>
                    Không quảng cáo gây nhiễu, không paywall cho tính năng cốt
                    lõi, không cơ chế thi đua đạo đức. Chỉ có một không gian ghi
                    nhận nội tâm, riêng tư và bình an.
                  </p>
                </div>
                <div className='mt-8 space-y-3'>
                  {[
                    'Miễn phí vĩnh viễn cho trải nghiệm cốt lõi',
                    'Dùng tốt trên điện thoại và máy tính',
                    'Dữ liệu cá nhân được bảo vệ và chỉ bạn xem được',
                  ].map((item) => (
                    <div
                      key={item}
                      className='bg-surface-container flex items-start gap-3 rounded-xl px-4 py-3'>
                      <CheckCircle2 className='text-primary mt-0.5 h-5 w-5 shrink-0' />
                      <p className='text-foreground text-sm leading-6 md:text-base'>
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className='border-border bg-surface-container rounded-3xl border p-6 md:p-8'>
                <div className='bg-primary/10 text-primary mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl'>
                  <Users className='h-6 w-6' />
                </div>
                <h3 className='text-foreground text-2xl leading-tight font-bold'>
                  Ai nên dùng 3000 Việc Thiện?
                </h3>
                <div className='mt-6 grid gap-4'>
                  {[
                    'Người muốn xây thói quen làm việc tốt mỗi ngày, bắt đầu từ việc nhỏ.',
                    'Học sinh, sinh viên, người đi làm cần công cụ gọn nhẹ để tự phản chiếu.',
                    'Nhóm thiện nguyện muốn có không gian cá nhân để duy trì động lực dài hạn.',
                  ].map((item) => (
                    <div
                      key={item}
                      className='text-muted-foreground rounded-2xl bg-white p-4 shadow-sm'>
                      <p className='text-sm leading-6 md:text-base'>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className='bg-surface-container scroll-mt-24 py-16 md:py-20 lg:py-24'
          id='y-nghia'>
          <div className='container mx-auto max-w-6xl px-4 sm:px-6'>
            <div className='grid gap-10 md:grid-cols-2 md:items-center md:gap-16'>
              <div>
                <h2 className='font-headline text-foreground text-3xl font-bold tracking-tight sm:text-4xl'>
                  Tích tiểu thành đại,
                  <br />
                  nước chảy đá mòn
                </h2>
                <div className='text-muted-foreground mt-6 space-y-6 text-base leading-7 md:text-lg md:leading-relaxed'>
                  <p>
                    Làm việc thiện không cần phải là những điều to lớn. Đó có
                    thể là một nụ cười trao đi, một lời động viên đúng lúc, hay
                    đơn giản là nhặt một mẩu rác trên đường.
                  </p>
                  <p>
                    Theo triết lý phương Đông và nguồn cảm hứng từ cuốn sách{' '}
                    <strong>Liễu Phàm Tứ Huấn</strong>, vận mệnh con người hoàn
                    toàn có thể thay đổi bằng cách tích lũy đủ 3000 việc thiện.
                  </p>
                  <p>
                    Chúng tôi tin rằng, khi bạn chú tâm ghi nhận những điều tốt
                    đẹp mình làm mỗi ngày, tâm hồn bạn sẽ trở nên thanh thản
                    hơn, và thế giới xung quanh cũng vì thế mà rực rỡ hơn.
                  </p>
                </div>
              </div>
              <div className='relative'>
                <div className='bg-primary/10 absolute -inset-3 rounded-3xl blur-2xl' />
                <div className='bg-secondary/30 relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl p-6 shadow-inner md:p-8'>
                  <div className='grid w-full grid-cols-2 gap-4'>
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className='rounded-2xl bg-white p-4 shadow-sm transition-shadow hover:shadow-md md:p-6'>
                        <Heart
                          className={`mb-4 h-8 w-8 ${item % 2 === 0 ? 'text-primary' : 'text-accent-foreground'}`}
                        />
                        <div className='bg-surface-container-high mb-2 h-2 w-20 rounded-full' />
                        <div className='bg-surface-container h-2 w-12 rounded-full' />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='relative overflow-hidden py-16 md:py-20 lg:py-24'>
          <div className='container mx-auto max-w-6xl px-4 sm:px-6'>
            <div className='mb-12 text-center md:mb-16'>
              <h2 className='font-headline text-foreground text-3xl font-bold tracking-tight sm:text-4xl'>
                Hành trình nuôi dưỡng sự bình an
              </h2>
              <p className='text-muted-foreground mx-auto mt-4 max-w-2xl text-base leading-7 md:text-lg'>
                Chỉ cần vài phút mỗi ngày, bạn sẽ nhận thấy sự thay đổi tích cực
                từ sâu bên trong.
              </p>
            </div>
            <div className='relative grid gap-10 md:grid-cols-3 md:gap-8'>
              <div className='bg-border absolute top-12 right-[16%] left-[16%] -z-10 hidden h-0.5 md:block' />
              {[
                {
                  step: '01',
                  title: 'Hành động nhỏ',
                  desc: 'Làm một việc tốt dù là nhỏ nhất: Mỉm cười, giúp đỡ, lắng nghe, hay tự bao dung với chính mình.',
                },
                {
                  step: '02',
                  title: 'Ghi nhận tĩnh lặng',
                  desc: 'Mở ứng dụng và dành 1 phút để ghi lại việc tốt đó, kèm theo cảm xúc bạn nhận được.',
                },
                {
                  step: '03',
                  title: 'Quán chiếu tâm hồn',
                  desc: 'Mỗi cuối tuần, hãy dùng Sổ tay quán chiếu để viết lời biết ơn và cảm nhận sự lớn lên của tâm hồn.',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className='bg-background relative flex flex-col items-center text-center'>
                  <div className='bg-surface-container border-background font-headline text-primary mb-6 flex h-20 w-20 items-center justify-center rounded-full border-4 text-2xl font-bold shadow-sm md:h-24 md:w-24'>
                    {item.step}
                  </div>
                  <h3 className='text-foreground mb-3 text-xl font-bold'>
                    {item.title}
                  </h3>
                  <p className='text-muted-foreground max-w-xs text-sm leading-6 md:text-base'>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className='bg-surface-container-low scroll-mt-24 py-16 md:py-20 lg:py-24'
          id='tinh-nang'>
          <div className='container mx-auto max-w-6xl px-4 sm:px-6'>
            <div className='mb-12 text-center md:mb-16'>
              <h2 className='font-headline text-foreground text-3xl font-bold tracking-tight sm:text-4xl'>
                Những công cụ nuôi dưỡng tâm hồn
              </h2>
              <p className='text-muted-foreground mx-auto mt-4 max-w-2xl text-base leading-7 md:text-lg'>
                Một không gian riêng tư, không phán xét, không bảng xếp hạng.
              </p>
            </div>
            <div className='grid gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-8'>
              {[
                {
                  icon: Sprout,
                  title: 'Ghi nhận việc tốt',
                  description:
                    'Ghi lại những hành động tử tế mỗi ngày một cách nhanh chóng và gắn nhãn cảm xúc.',
                },
                {
                  icon: BookOpen,
                  title: 'Sổ tay quán chiếu',
                  description:
                    'Dành thời gian tĩnh lặng để viết nhật ký biết ơn hoặc sám hối.',
                },
                {
                  icon: Target,
                  title: 'Mục tiêu & Thống kê',
                  description:
                    'Đặt mục tiêu thực hành cho tuần, tháng, năm và theo dõi hành trình của bạn.',
                },
                {
                  icon: Quote,
                  title: 'Gợi ý & Cảm hứng',
                  description:
                    'Nhận những câu nói truyền cảm hứng ngẫu nhiên và các gợi ý việc tốt.',
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className='group border-border bg-card hover:border-primary/30 flex flex-col rounded-3xl border p-6 shadow-sm transition-all hover:shadow-md md:p-8'>
                  <div className='bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-colors'>
                    <feature.icon className='h-6 w-6' />
                  </div>
                  <h3 className='text-foreground mb-3 text-2xl leading-tight font-bold md:text-xl'>
                    {feature.title}
                  </h3>
                  <p className='text-muted-foreground flex-1 text-sm leading-6 md:text-base md:leading-relaxed'>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          className='bg-background scroll-mt-24 py-16 md:py-20 lg:py-24'
          id='cai-dat'>
          <div className='container mx-auto max-w-6xl px-4 sm:px-6'>
            <div className='text-center'>
              <h2 className='font-headline text-foreground text-3xl font-bold tracking-tight sm:text-4xl'>
                Cài web app trên iPhone và Android trong 1 phút
              </h2>
              <p className='text-muted-foreground mx-auto mt-4 max-w-3xl text-base leading-7 md:text-lg'>
                Bạn không cần tải từ App Store hay CH Play. Chỉ cần mở trình
                duyệt, đăng nhập, rồi thêm vào màn hình chính để dùng như một
                app.
              </p>
            </div>
            <div className='mt-10 grid gap-5 md:mt-12 md:grid-cols-2 md:gap-8'>
              {INSTALL_OPTIONS.map((item) => (
                <div
                  key={item.title}
                  className='border-border bg-card rounded-3xl border p-6 shadow-sm md:p-8'>
                  <div className='bg-primary/10 text-primary mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl'>
                    <item.icon className='h-6 w-6' />
                  </div>
                  <h3 className='text-foreground text-2xl font-bold'>
                    {item.title}
                  </h3>
                  <ol className='text-muted-foreground mt-6 space-y-3'>
                    {item.steps.map((step, index) => (
                      <li key={step} className='flex items-start gap-3'>
                        <span className='bg-primary/10 text-primary mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold'>
                          {index + 1}
                        </span>
                        <span className='text-sm leading-6 md:text-base'>
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
            <div className='border-border bg-surface-container mt-8 rounded-2xl border p-6 md:p-8'>
              <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
                <div className='flex items-start gap-3'>
                  <Cloud className='text-primary mt-1 h-5 w-5 shrink-0' />
                  <p className='text-muted-foreground text-sm leading-6 md:text-base'>
                    Dữ liệu được lưu theo tài khoản, nên bạn có thể dùng nhiều
                    thiết bị mà tiến trình vẫn đồng bộ.
                  </p>
                </div>
                <Link
                  className='bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 w-full items-center justify-center rounded-full px-6 text-sm font-semibold md:w-auto'
                  href={buildWebAppCtaUrl('install_try_free')}>
                  Dùng thử miễn phí
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className='bg-surface-container-low py-16 md:py-20 lg:py-24'>
          <div className='container mx-auto max-w-6xl px-4 sm:px-6'>
            <div className='grid gap-10 md:grid-cols-2 md:items-center md:gap-16'>
              <div className='relative order-2 md:order-1'>
                <div className='bg-secondary/20 absolute -inset-4 rounded-3xl blur-2xl' />
                <div className='border-border relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm md:aspect-square md:p-8'>
                  <div className='flex h-full flex-col gap-3 md:justify-between'>
                    {[
                      {
                        icon: ShieldCheck,
                        text: 'Hướng vào bên trong thay vì tìm kiếm sự công nhận bên ngoài',
                      },
                      {
                        icon: HeartHandshake,
                        text: 'Sự khiêm tốn quan trọng hơn việc thể hiện',
                      },
                      {
                        icon: Leaf,
                        text: 'Sự kiên trì đều đặn ý nghĩa hơn những nỗ lực bùng phát',
                      },
                      {
                        icon: Sun,
                        text: 'Sự trung thực với bản thân là cốt lõi của sự phát triển',
                      },
                    ].map((item) => (
                      <div
                        key={item.text}
                        className='bg-surface-container hover:bg-surface-container-high flex items-start gap-4 rounded-2xl p-3 transition-colors md:p-4'>
                        <div className='bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full'>
                          <item.icon className='h-5 w-5' />
                        </div>
                        <p className='text-foreground mt-2 text-sm font-medium md:text-base'>
                          {item.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className='order-1 md:order-2'>
                <h2 className='font-headline text-foreground text-3xl font-bold tracking-tight sm:text-4xl'>
                  Giá trị cốt lõi của chúng tôi
                </h2>
                <div className='text-muted-foreground mt-6 space-y-5 text-base leading-7 md:space-y-6 md:text-lg md:leading-relaxed'>
                  <p>
                    3000 Việc Thiện <strong>không phải</strong> là một mạng xã
                    hội ganh đua, không có bảng xếp hạng, và không có hệ thống
                    tính điểm đạo đức.
                  </p>
                  <p>
                    Đó là một không gian kỹ thuật số riêng tư và bình yên. Chúng
                    tôi chống lại việc game hóa quá mức hay việc giữ chân người
                    dùng bằng cảm giác tội lỗi.
                  </p>
                  <p>
                    Mọi tính năng đều được thiết kế để bảo vệ không gian tĩnh
                    lặng của bạn, giúp bạn xây dựng thói quen từ bi một cách bền
                    vững.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FaqSection />

        <section className='bg-primary text-primary-foreground relative overflow-hidden py-16 md:py-20 lg:py-24'>
          <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_0%,transparent_100%)] opacity-10' />
          <div className='relative container mx-auto max-w-4xl px-4 text-center sm:px-6'>
            <h2 className='font-headline text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl'>
              Bạn đã sẵn sàng gieo hạt giống thiện hôm nay?
            </h2>
            <p className='text-primary-foreground/85 mx-auto mt-6 max-w-2xl text-base leading-7 md:text-xl'>
              Hàng ngàn người đã bắt đầu. Hãy tham gia cùng chúng tôi để tạo nên
              một thế giới ấm áp hơn.
            </p>
            <div className='mt-10'>
              <Link
                className='text-primary hover:bg-surface-container inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-base font-bold shadow-lg transition-all hover:scale-105'
                href={buildWebAppCtaUrl('bottom_create_account', 'login')}>
                Tạo tài khoản miễn phí
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className='border-border bg-surface-container-lowest border-t py-12'>
        <div className='container mx-auto max-w-6xl px-4 sm:px-6'>
          <div className='grid gap-8 md:grid-cols-2'>
            <div>
              <div className='mb-6 flex items-center gap-2'>
                <div className='bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg'>
                  <Heart className='h-5 w-5 fill-current' />
                </div>
                <span className='font-headline text-foreground text-xl font-bold'>
                  3000 Việc Thiện
                </span>
              </div>
              <p className='text-muted-foreground mb-6 max-w-sm'>
                Nền tảng miễn phí giúp bạn xây dựng thói quen làm việc tốt, nuôi
                dưỡng lòng biết ơn và sự bình yên trong tâm hồn.
              </p>
              <div className='text-foreground text-sm font-medium'>
                Liên hệ:{' '}
                <a
                  className='text-primary hover:underline'
                  href='mailto:tungxuan.work10@gmail.com'>
                  tungxuan.work10@gmail.com
                </a>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-8 md:justify-items-end'>
              <div>
                <h3 className='text-foreground mb-4 text-lg font-bold'>
                  Sản phẩm
                </h3>
                <ul className='text-muted-foreground space-y-3 text-sm'>
                  <li>
                    <Link
                      className='hover:text-primary transition-colors'
                      href='#tinh-nang'>
                      Tính năng
                    </Link>
                  </li>
                  <li>
                    <Link
                      className='hover:text-primary transition-colors'
                      href='#y-nghia'>
                      Ý nghĩa
                    </Link>
                  </li>
                  <li>
                    <Link
                      className='hover:text-primary transition-colors'
                      href='#faq'>
                      Hỏi đáp
                    </Link>
                  </li>
                  <li>
                    <Link
                      className='hover:text-primary transition-colors'
                      href={appLoginUrl}>
                      Đăng nhập
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className='text-foreground mb-4 text-lg font-bold'>
                  Pháp lý
                </h3>
                <ul className='text-muted-foreground space-y-3 text-sm'>
                  <li>
                    <Link
                      className='hover:text-primary transition-colors'
                      href='/terms'>
                      Điều khoản sử dụng
                    </Link>
                  </li>
                  <li>
                    <Link
                      className='hover:text-primary transition-colors'
                      href='/privacy'>
                      Chính sách bảo mật
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className='border-border text-muted-foreground mt-12 border-t pt-8 text-center text-sm'>
            <p>
              &copy;{' '}
              <span suppressHydrationWarning>{new Date().getFullYear()}</span>{' '}
              3000 Việc Thiện. Mọi quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
