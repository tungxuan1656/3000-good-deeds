import Image from 'next/image'
import Link from 'next/link'
import { Heart, Sprout, Sun, Users, Star, ArrowRight, CheckCircle2, Shield } from 'lucide-react'

import { SITE_URL } from '@/lib/site-config'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-primary/20">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Heart className="h-5 w-5 fill-current" />
            </div>
            <span className="font-headline text-xl font-bold tracking-tight">3000 Việc Thiện</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#ve-chung-toi" className="hover:text-foreground transition-colors">Về chúng tôi</Link>
            <Link href="#y-nghia" className="hover:text-foreground transition-colors">Ý nghĩa</Link>
            <Link href="#tinh-nang" className="hover:text-foreground transition-colors">Tính năng</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link
              href={`${SITE_URL}/login`}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              href={`${SITE_URL}/register`}
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
            >
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
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                <Sprout className="h-4 w-4" />
                <span>Gieo mầm thiện, gặt bình an</span>
              </div>
              <h1 className="font-headline text-5xl font-bold tracking-tight text-foreground sm:text-6xl/tight md:text-7xl/tight">
                Hành Trình Gieo Hạt <br />
                <span className="text-primary">Giống Thiện</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                Mỗi hành động nhỏ bé hôm nay là một đóa hoa nở rộ ngày mai. 3000 Việc Thiện là nơi tĩnh lặng để bạn theo dõi, nuôi dưỡng lòng trắc ẩn và lan tỏa những điều tốt đẹp mỗi ngày.
              </p>
              
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href={`${SITE_URL}/register`}
                  className="group flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                >
                  Bắt đầu hành trình
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="#y-nghia"
                  className="flex items-center justify-center rounded-full bg-surface-container px-8 py-4 text-base font-medium text-foreground hover:bg-surface-container-high transition-colors"
                >
                  Tìm hiểu thêm
                </Link>
              </div>
              
              <div className="mt-12 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Miễn phí vĩnh viễn</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-primary" />
                  <span>Bảo mật dữ liệu</span>
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
                <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Tích tiểu thành đại,<br />nước chảy đá mòn
                </h2>
                <div className="mt-6 space-y-6 text-lg leading-relaxed text-muted-foreground">
                  <p>
                    Làm việc thiện không cần phải là những điều to lớn. Đó có thể là một nụ cười trao đi, một lời động viên đúng lúc, hay đơn giản là nhặt một mẩu rác trên đường.
                  </p>
                  <p>
                    Chúng tôi tin rằng, khi bạn chú tâm ghi nhận những điều tốt đẹp mình làm mỗi ngày, tâm hồn bạn sẽ trở nên thanh thản hơn, và thế giới xung quanh cũng vì thế mà rực rỡ hơn.
                  </p>
                </div>
                <div className="mt-8">
                  <div className="inline-flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/30 text-accent-foreground">
                      <Sun className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Sống chánh niệm</p>
                      <p className="text-sm text-muted-foreground">Trân trọng từng khoảnh khắc</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-2xl" />
                <div className="relative aspect-square overflow-hidden rounded-3xl bg-secondary/30 p-8 flex items-center justify-center shadow-inner">
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                        <Heart className={`h-8 w-8 mb-4 ${i % 2 === 0 ? 'text-primary' : 'text-accent-foreground'}`} />
                        <div className="h-2 w-20 rounded-full bg-surface-container-high mb-2" />
                        <div className="h-2 w-12 rounded-full bg-surface-container" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="tinh-nang" className="py-24">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="text-center mb-16">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Người bạn đồng hành tận tâm
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Giao diện tối giản, tập trung vào trải nghiệm của bạn.
              </p>
            </div>
            
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: Sprout,
                  title: 'Ghi chú nhanh chóng',
                  description: 'Ghi lại những việc tốt mỗi ngày một cách đơn giản, giúp bạn dễ dàng duy trì thói quen.'
                },
                {
                  icon: Star,
                  title: 'Nhìn lại chặng đường',
                  description: 'Biểu đồ trực quan giúp bạn xem lại sự tiến bộ của bản thân qua từng tuần, từng tháng.'
                },
                {
                  icon: Users,
                  title: 'Cộng đồng tích cực',
                  description: 'Lan tỏa năng lượng tích cực và nhận cảm hứng từ những người cùng chung chí hướng.'
                }
              ].map((feature, i) => (
                <div key={i} className="group rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md hover:border-primary/30">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 overflow-hidden bg-primary text-primary-foreground">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,255,255,1)_0%,transparent_100%)]" />
          <div className="container relative mx-auto max-w-4xl px-6 text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Bạn đã sẵn sàng gieo hạt giống thiện hôm nay?
            </h2>
            <p className="mt-6 text-lg text-primary-foreground/80 md:text-xl">
              Hàng ngàn người đã bắt đầu. Hãy tham gia cùng chúng tôi để tạo nên một thế giới ấm áp hơn.
            </p>
            <div className="mt-10">
              <Link
                href={`${SITE_URL}/register`}
                className="inline-flex h-14 items-center justify-center rounded-full bg-white px-8 text-base font-bold text-primary shadow-lg hover:bg-surface-container transition-all hover:scale-105"
              >
                Tạo tài khoản miễn phí
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface-container-lowest py-12">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Heart className="h-5 w-5 fill-current" />
                </div>
                <span className="font-headline text-xl font-bold text-foreground">3000 Việc Thiện</span>
              </div>
              <p className="text-muted-foreground max-w-sm mb-6">
                Nền tảng miễn phí giúp bạn xây dựng thói quen làm việc tốt, nuôi dưỡng lòng biết ơn và sự bình yên trong tâm hồn.
              </p>
              <div className="text-sm text-foreground font-medium">
                Liên hệ: <a href="mailto:tungxuan.work10@gmail.com" className="text-primary hover:underline">tungxuan.work10@gmail.com</a>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-8 md:justify-items-end">
              <div>
                <h4 className="font-bold text-foreground mb-4">Sản phẩm</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link href="#tinh-nang" className="hover:text-primary transition-colors">Tính năng</Link></li>
                  <li><Link href="#y-nghia" className="hover:text-primary transition-colors">Ý nghĩa</Link></li>
                  <li><Link href={`${SITE_URL}/login`} className="hover:text-primary transition-colors">Đăng nhập</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-4">Pháp lý</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link href="/terms" className="hover:text-primary transition-colors">Điều khoản sử dụng</Link></li>
                  <li><Link href="/privacy" className="hover:text-primary transition-colors">Chính sách bảo mật</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} 3000 Việc Thiện. Mọi quyền được bảo lưu.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
