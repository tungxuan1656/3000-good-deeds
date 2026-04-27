import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng | 3000 Việc Thiện',
  description:
    'Điều khoản sử dụng của 3000 Việc Thiện: phạm vi dịch vụ, quyền và trách nhiệm của người dùng khi sử dụng nền tảng.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Điều khoản sử dụng | 3000 Việc Thiện',
    description:
      'Quy định sử dụng nền tảng 3000 Việc Thiện, bao gồm quyền lợi và nghĩa vụ của người dùng.',
    url: '/terms',
    type: 'article',
  },
}

export default function TermsPage() {
  return (
    <main className='bg-background text-foreground min-h-screen py-16'>
      <div className='mx-auto flex w-full max-w-3xl flex-col gap-10 px-6'>
        <header className='space-y-3'>
          <p className='text-muted-foreground text-sm'>Cập nhật: 27/04/2026</p>
          <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>
            Điều khoản sử dụng
          </h1>
          <p className='text-muted-foreground text-lg'>
            Khi sử dụng 3000 Việc Thiện, bạn đồng ý với các điều khoản dưới đây.
            Nếu không đồng ý, vui lòng ngừng sử dụng dịch vụ.
          </p>
        </header>

        <section className='space-y-8'>
          <article className='space-y-3'>
            <h2 className='text-2xl font-semibold'>1. Phạm vi dịch vụ</h2>
            <p className='text-muted-foreground leading-relaxed'>
              3000 Việc Thiện cung cấp công cụ ghi nhận việc tốt, theo dõi tiến
              trình và nhắc nhở cá nhân. Dịch vụ có thể được cải tiến, tạm dừng
              hoặc cập nhật để nâng cao chất lượng trải nghiệm.
            </p>
          </article>

          <article className='space-y-3'>
            <h2 className='text-2xl font-semibold'>
              2. Trách nhiệm người dùng
            </h2>
            <p className='text-muted-foreground leading-relaxed'>
              Bạn chịu trách nhiệm về tính chính xác của thông tin do bạn cung
              cấp, bảo mật tài khoản của mình và không sử dụng nền tảng cho mục
              đích vi phạm pháp luật hoặc gây hại cho người khác.
            </p>
          </article>

          <article className='space-y-3'>
            <h2 className='text-2xl font-semibold'>3. Quyền sở hữu nội dung</h2>
            <p className='text-muted-foreground leading-relaxed'>
              Nội dung nhật ký và dữ liệu bạn tạo ra thuộc quyền của bạn. Bạn
              cấp cho hệ thống quyền xử lý dữ liệu cần thiết để vận hành dịch vụ
              theo chính sách bảo mật.
            </p>
          </article>

          <article className='space-y-3'>
            <h2 className='text-2xl font-semibold'>4. Giới hạn trách nhiệm</h2>
            <p className='text-muted-foreground leading-relaxed'>
              Dịch vụ được cung cấp trên cơ sở nỗ lực tốt nhất. Chúng tôi không
              cam kết dịch vụ không bao giờ gián đoạn, nhưng sẽ ưu tiên khắc
              phục sự cố trong thời gian hợp lý.
            </p>
          </article>

          <article className='space-y-3'>
            <h2 className='text-2xl font-semibold'>5. Thay đổi điều khoản</h2>
            <p className='text-muted-foreground leading-relaxed'>
              Điều khoản có thể được cập nhật theo thời gian. Phiên bản mới sẽ
              có hiệu lực kể từ ngày đăng tải trên trang này.
            </p>
          </article>
        </section>

        <footer className='border-border flex flex-wrap items-center gap-4 border-t pt-6 text-sm'>
          <Link className='text-primary hover:underline' href='/privacy'>
            Xem Chính sách bảo mật
          </Link>
          <Link className='text-primary hover:underline' href='/'>
            Quay về trang chủ
          </Link>
        </footer>
      </div>
    </main>
  )
}
