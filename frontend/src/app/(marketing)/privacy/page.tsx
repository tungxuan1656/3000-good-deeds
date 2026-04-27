import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Chính sách bảo mật | 3000 Việc Thiện',
  description:
    'Chính sách bảo mật của 3000 Việc Thiện: cách thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân của người dùng.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Chính sách bảo mật | 3000 Việc Thiện',
    description:
      'Cam kết bảo vệ dữ liệu cá nhân và quyền riêng tư của người dùng 3000 Việc Thiện.',
    url: '/privacy',
    type: 'article',
  },
}

export default function PrivacyPage() {
  return (
    <main className='bg-background text-foreground min-h-screen py-16'>
      <div className='mx-auto flex w-full max-w-3xl flex-col gap-10 px-6'>
        <header className='space-y-3'>
          <p className='text-muted-foreground text-sm'>Cập nhật: 27/04/2026</p>
          <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>
            Chính sách bảo mật
          </h1>
          <p className='text-muted-foreground text-lg'>
            Tài liệu này mô tả cách 3000 Việc Thiện thu thập, sử dụng và bảo vệ
            dữ liệu của bạn khi sử dụng dịch vụ.
          </p>
        </header>

        <section className='space-y-8'>
          <article className='space-y-3'>
            <h2 className='text-2xl font-semibold'>1. Dữ liệu được thu thập</h2>
            <p className='text-muted-foreground leading-relaxed'>
              Chúng tôi thu thập thông tin cần thiết để cung cấp dịch vụ, bao
              gồm dữ liệu tài khoản, nội dung bạn chủ động nhập và thông tin kỹ
              thuật cơ bản phục vụ vận hành hệ thống.
            </p>
          </article>

          <article className='space-y-3'>
            <h2 className='text-2xl font-semibold'>2. Mục đích sử dụng</h2>
            <p className='text-muted-foreground leading-relaxed'>
              Dữ liệu được sử dụng để duy trì tài khoản, đồng bộ tiến trình, gửi
              nhắc nhở khi bạn bật tính năng và cải thiện chất lượng sản phẩm.
            </p>
          </article>

          <article className='space-y-3'>
            <h2 className='text-2xl font-semibold'>3. Bảo mật dữ liệu</h2>
            <p className='text-muted-foreground leading-relaxed'>
              Chúng tôi áp dụng biện pháp kỹ thuật và quy trình nội bộ nhằm hạn
              chế truy cập trái phép, mất mát hoặc lạm dụng dữ liệu cá nhân.
            </p>
          </article>

          <article className='space-y-3'>
            <h2 className='text-2xl font-semibold'>4. Quyền của người dùng</h2>
            <p className='text-muted-foreground leading-relaxed'>
              Bạn có quyền truy cập, cập nhật hoặc yêu cầu xóa dữ liệu của mình
              theo cơ chế hỗ trợ hiện có trong ứng dụng hoặc qua email hỗ trợ.
            </p>
          </article>

          <article className='space-y-3'>
            <h2 className='text-2xl font-semibold'>5. Liên hệ</h2>
            <p className='text-muted-foreground leading-relaxed'>
              Nếu có câu hỏi liên quan đến bảo mật và quyền riêng tư, vui lòng
              liên hệ email: tungxuan.work10@gmail.com.
            </p>
          </article>
        </section>

        <footer className='border-border flex flex-wrap items-center gap-4 border-t pt-6 text-sm'>
          <Link className='text-primary hover:underline' href='/terms'>
            Xem Điều khoản sử dụng
          </Link>
          <Link className='text-primary hover:underline' href='/'>
            Quay về trang chủ
          </Link>
        </footer>
      </div>
    </main>
  )
}
