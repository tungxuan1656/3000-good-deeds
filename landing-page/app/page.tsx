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

export default function Home() {
  const appLoginUrl = getWebAppLoginUrl()

  return (
    <div className="bg-background text-foreground selection:bg-primary/20 flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="border-border/40 bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
              <Heart className="h-5 w-5 fill-current" />
            </div>
            <span className="font-headline text-xl font-bold tracking-tight">
              3000 Việc Thiện
            </span>
          </div>
          <nav className="text-muted-foreground hidden items-center gap-8 text-sm font-medium md:flex">
            <Link
              href="#ve-du-an"
              className="hover:text-foreground transition-colors">
              Về dự án
            </Link>
            <Link
              href="#y-nghia"
              className="hover:text-foreground transition-colors">
              Ý nghĩa
            </Link>
            <Link
              href="#tinh-nang"
              className="hover:text-foreground transition-colors">
              Tính năng
            </Link>
            <Link
              href="#cai-dat"
              className="hover:text-foreground transition-colors">
              Cài đặt
            </Link>
            <Link
              href="#faq"
              className="hover:text-foreground transition-colors">
              Hỏi đáp
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href={appLoginUrl}
              className="hover:text-primary text-sm font-medium transition-colors">
              Đăng nhập
            </Link>
            <Link
              href={buildWebAppCtaUrl('header_get_started', 'login')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-5 py-2 text-sm font-medium shadow-sm transition-all hover:scale-105 active:scale-95">
              Bắt đầu ngay
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(82,99,71,0.15),rgba(255,255,255,0))]" />

          <div className="container mx-auto max-w-6xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="border-primary/20 bg-primary/5 text-primary mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium">
                <Sprout className="h-4 w-4" />
                <span>Gieo mầm thiện, gặt bình an</span>
              </div>
              <h1 className="font-headline text-foreground text-5xl font-bold tracking-tight sm:text-6xl/tight md:text-7xl/tight">
                Hành Trình Gieo Hạt <br />
                <span className="text-primary">Giống Thiện</span>
              </h1>
              <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-relaxed md:text-xl">
                Mỗi hành động nhỏ bé hôm nay là một đóa hoa nở rộ ngày mai. 3000
                Việc Thiện là nơi tĩnh lặng để bạn theo dõi, nuôi dưỡng lòng
                trắc ẩn và lan tỏa những điều tốt đẹp mỗi ngày.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href={buildWebAppCtaUrl('hero_start_journey', 'login')}
                  className="group bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90 flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold shadow-lg transition-all">
                  Bắt đầu hành trình
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="#y-nghia"
                  className="bg-surface-container text-foreground hover:bg-surface-container-high flex items-center justify-center rounded-full px-8 py-4 text-base font-medium transition-colors">
                  Tìm hiểu thêm
                </Link>
              </div>

              <div className="text-muted-foreground mt-12 flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="text-primary h-4 w-4" />
                  <span>Miễn phí vĩnh viễn</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="text-primary h-4 w-4" />
                  <span>Bảo mật dữ liệu</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="ve-du-an" className="py-24">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="grid gap-12 md:grid-cols-2 md:items-start">
              <div>
                <h2 className="font-headline text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                  Vì sao dự án 3000 Việc Thiện ra đời?
                </h2>
                <div className="text-muted-foreground mt-6 space-y-5 text-lg leading-relaxed">
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
                <div className="mt-8 space-y-3">
                  {[
                    'Miễn phí vĩnh viễn cho trải nghiệm cốt lõi',
                    'Dùng tốt trên điện thoại và máy tính',
                    'Dữ liệu cá nhân được bảo vệ và chỉ bạn xem được',
                  ].map((item) => (
                    <div
                      key={item}
                      className="bg-surface-container flex items-start gap-3 rounded-xl px-4 py-3">
                      <CheckCircle2 className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                      <p className="text-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-border bg-surface-container rounded-3xl border p-8">
                <div className="bg-primary/10 text-primary mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-foreground text-2xl font-bold">
                  Ai nên dùng 3000 Việc Thiện?
                </h3>
                <div className="mt-6 grid gap-4">
                  {[
                    'Người muốn xây thói quen làm việc tốt mỗi ngày, bắt đầu từ việc nhỏ.',
                    'Học sinh, sinh viên, người đi làm cần công cụ gọn nhẹ để tự phản chiếu.',
                    'Nhóm thiện nguyện muốn có không gian cá nhân để duy trì động lực dài hạn.',
                  ].map((item) => (
                    <div
                      key={item}
                      className="text-muted-foreground rounded-2xl bg-white p-4 shadow-sm">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section id="y-nghia" className="bg-surface-container py-24">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="grid gap-16 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="font-headline text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                  Tích tiểu thành đại,
                  <br />
                  nước chảy đá mòn
                </h2>
                <div className="text-muted-foreground mt-6 space-y-6 text-lg leading-relaxed">
                  <p>
                    Làm việc thiện không cần phải là những điều to lớn. Đó có
                    thể là một nụ cười trao đi, một lời động viên đúng lúc, hay
                    đơn giản là nhặt một mẩu rác trên đường.
                  </p>
                  <p>
                    Theo triết lý phương Đông và nguồn cảm hứng từ cuốn sách{' '}
                    <strong>Liễu Phàm Tứ Huấn</strong>, vận mệnh con người hoàn
                    toàn có thể thay đổi bằng cách tích lũy đủ 3000 việc thiện.
                    Đây không phải là một áp lực, mà là một hành trình dài để
                    cải biến tâm tính.
                  </p>
                  <p>
                    Chúng tôi tin rằng, khi bạn chú tâm ghi nhận những điều tốt
                    đẹp mình làm mỗi ngày, tâm hồn bạn sẽ trở nên thanh thản
                    hơn, và thế giới xung quanh cũng vì thế mà rực rỡ hơn.
                  </p>
                </div>
                <div className="mt-8">
                  <div className="inline-flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
                    <div className="bg-accent/30 text-accent-foreground flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
                      <Sun className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium">
                        Sống chánh niệm
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Trân trọng từng khoảnh khắc
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-primary/10 absolute -inset-4 rounded-3xl blur-2xl" />
                <div className="bg-secondary/30 relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl p-8 shadow-inner">
                  <div className="grid w-full grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                        <Heart
                          className={`mb-4 h-8 w-8 ${i % 2 === 0 ? 'text-primary' : 'text-accent-foreground'}`}
                        />
                        <div className="bg-surface-container-high mb-2 h-2 w-20 rounded-full" />
                        <div className="bg-surface-container h-2 w-12 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="relative overflow-hidden py-24">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="mb-16 text-center">
              <h2 className="font-headline text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                Hành trình nuôi dưỡng sự bình an
              </h2>
              <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
                Chỉ cần vài phút mỗi ngày, bạn sẽ nhận thấy sự thay đổi tích cực
                từ sâu bên trong.
              </p>
            </div>

            <div className="relative grid gap-8 md:grid-cols-3">
              <div className="bg-border absolute top-12 right-[16%] left-[16%] -z-10 hidden h-0.5 md:block" />
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
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-background relative flex flex-col items-center text-center">
                  <div className="bg-surface-container border-background font-headline text-primary mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 text-2xl font-bold shadow-sm">
                    {item.step}
                  </div>
                  <h3 className="text-foreground mb-3 text-xl font-bold">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="tinh-nang" className="bg-surface-container py-24">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="mb-16 text-center">
              <h2 className="font-headline text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                Những công cụ nuôi dưỡng tâm hồn
              </h2>
              <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-lg">
                Một không gian riêng tư, không phán xét, không bảng xếp hạng.
                Chỉ có bạn và hành trình trở thành phiên bản tốt hơn mỗi ngày.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Sprout,
                  title: 'Ghi nhận việc tốt',
                  description:
                    'Ghi lại những hành động tử tế mỗi ngày một cách nhanh chóng và gắn nhãn cảm xúc (an vui, biết ơn, nhẹ lòng...).',
                },
                {
                  icon: BookOpen,
                  title: 'Sổ tay quán chiếu',
                  description:
                    'Dành thời gian tĩnh lặng để viết nhật ký biết ơn hoặc sám hối, giúp bạn nhìn nhận lại bản thân với sự trung thực.',
                },
                {
                  icon: Target,
                  title: 'Mục tiêu & Thống kê',
                  description:
                    'Đặt mục tiêu thực hành cho tuần, tháng, năm và theo dõi hành trình của bạn qua biểu đồ trực quan, lịch tháng.',
                },
                {
                  icon: Quote,
                  title: 'Gợi ý & Cảm hứng',
                  description:
                    'Nhận những câu nói truyền cảm hứng ngẫu nhiên và các gợi ý việc tốt để luôn có ý tưởng gieo mầm thiện.',
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="group border-border bg-card hover:border-primary/30 flex flex-col rounded-3xl border p-8 shadow-sm transition-all hover:shadow-md">
                  <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-foreground mb-3 text-xl font-bold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground flex-1 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Installation Section */}
        <section id="cai-dat" className="py-24">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="text-center">
              <h2 className="font-headline text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                Cài web app trên iPhone và Android trong 1 phút
              </h2>
              <p className="text-muted-foreground mx-auto mt-4 max-w-3xl text-lg">
                Bạn không cần tải từ App Store hay CH Play. Chỉ cần mở trình
                duyệt, đăng nhập, rồi thêm vào màn hình chính để dùng như một
                app.
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {[
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
              ].map((item) => (
                <div
                  key={item.title}
                  className="border-border bg-card rounded-3xl border p-8 shadow-sm">
                  <div className="bg-primary/10 text-primary mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-foreground text-2xl font-bold">
                    {item.title}
                  </h3>
                  <ol className="text-muted-foreground mt-6 space-y-3">
                    {item.steps.map((step, index) => (
                      <li key={step} className="flex items-start gap-3">
                        <span className="bg-primary/10 text-primary mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>

            <div className="border-border bg-surface-container mt-8 rounded-2xl border p-6 md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-3">
                  <Cloud className="text-primary mt-1 h-5 w-5 shrink-0" />
                  <p className="text-muted-foreground">
                    Dữ liệu được lưu theo tài khoản, nên bạn có thể dùng nhiều
                    thiết bị mà tiến trình vẫn đồng bộ.
                  </p>
                </div>
                <Link
                  href={buildWebAppCtaUrl('install_try_free')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold">
                  Dùng thử miễn phí
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-24">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="grid gap-16 md:grid-cols-2 md:items-center">
              <div className="relative order-2 md:order-1">
                <div className="bg-secondary/20 absolute -inset-4 rounded-3xl blur-2xl" />
                <div className="border-border relative aspect-square overflow-hidden rounded-3xl border bg-white p-8 shadow-sm">
                  <div className="flex h-full flex-col justify-between">
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
                    ].map((val, idx) => (
                      <div
                        key={idx}
                        className="bg-surface-container hover:bg-surface-container-high flex items-start gap-4 rounded-2xl p-4 transition-colors">
                        <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                          <val.icon className="h-5 w-5" />
                        </div>
                        <p className="text-foreground mt-2 font-medium">
                          {val.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <h2 className="font-headline text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                  Giá trị cốt lõi của chúng tôi
                </h2>
                <div className="text-muted-foreground mt-6 space-y-6 text-lg leading-relaxed">
                  <p>
                    3000 Việc Thiện <strong>không phải</strong> là một mạng xã
                    hội ganh đua, không có bảng xếp hạng, và không có hệ thống
                    tính điểm đạo đức.
                  </p>
                  <p>
                    Đó là một không gian kỹ thuật số riêng tư và bình yên. Chúng
                    tôi chống lại việc game hóa quá mức (gamification) hay việc
                    giữ chân người dùng bằng cảm giác tội lỗi.
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

        {/* FAQ Section */}
        <FaqSection />

        {/* CTA Section */}
        <section className="bg-primary text-primary-foreground relative overflow-hidden py-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_0%,transparent_100%)] opacity-10" />
          <div className="relative container mx-auto max-w-4xl px-6 text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Bạn đã sẵn sàng gieo hạt giống thiện hôm nay?
            </h2>
            <p className="text-primary-foreground/80 mt-6 text-lg md:text-xl">
              Hàng ngàn người đã bắt đầu. Hãy tham gia cùng chúng tôi để tạo nên
              một thế giới ấm áp hơn.
            </p>
            <div className="mt-10">
              <Link
                href={buildWebAppCtaUrl('bottom_create_account', 'login')}
                className="text-primary hover:bg-surface-container inline-flex h-14 items-center justify-center rounded-full bg-white px-8 text-base font-bold shadow-lg transition-all hover:scale-105">
                Tạo tài khoản miễn phí
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-border bg-surface-container-lowest border-t py-12">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <div className="mb-6 flex items-center gap-2">
                <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-lg">
                  <Heart className="h-5 w-5 fill-current" />
                </div>
                <span className="font-headline text-foreground text-xl font-bold">
                  3000 Việc Thiện
                </span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Nền tảng miễn phí giúp bạn xây dựng thói quen làm việc tốt, nuôi
                dưỡng lòng biết ơn và sự bình yên trong tâm hồn.
              </p>
              <div className="text-foreground text-sm font-medium">
                Liên hệ:{' '}
                <a
                  href="mailto:tungxuan.work10@gmail.com"
                  className="text-primary hover:underline">
                  tungxuan.work10@gmail.com
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 md:justify-items-end">
              <div>
                <h4 className="text-foreground mb-4 font-bold">Sản phẩm</h4>
                <ul className="text-muted-foreground space-y-3 text-sm">
                  <li>
                    <Link
                      href="#tinh-nang"
                      className="hover:text-primary transition-colors">
                      Tính năng
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#y-nghia"
                      className="hover:text-primary transition-colors">
                      Ý nghĩa
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#faq"
                      className="hover:text-primary transition-colors">
                      Hỏi đáp
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={appLoginUrl}
                      className="hover:text-primary transition-colors">
                      Đăng nhập
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-foreground mb-4 font-bold">Pháp lý</h4>
                <ul className="text-muted-foreground space-y-3 text-sm">
                  <li>
                    <Link
                      href="/terms"
                      className="hover:text-primary transition-colors">
                      Điều khoản sử dụng
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="hover:text-primary transition-colors">
                      Chính sách bảo mật
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-border text-muted-foreground mt-12 border-t pt-8 text-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} 3000 Việc Thiện. Mọi quyền được
              bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
