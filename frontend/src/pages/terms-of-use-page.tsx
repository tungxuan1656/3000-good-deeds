// NOTE: Legal copy in this file is intentionally kept in Vietnamese.
// Do not migrate these strings to i18n unless product/legal requirements change.
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { CardSection, HeaderSection, LegalFooter } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { PATHS } from '@/lib/constants'
import { t } from '@/lib/i18n'

const UpdatedAt = () => {
  return (
    <p className='text-muted-foreground mt-2 text-xs leading-relaxed'>
      Ngày cập nhật gần nhất: <span className='font-semibold'>11/02/2026</span>
    </p>
  )
}

type SectionProps = {
  title: string
  children: ReactNode
}

const Section = ({ title, children }: SectionProps) => {
  return (
    <section className='flex flex-col gap-3'>
      <h2 className='text-foreground text-base font-semibold sm:text-lg'>{title}</h2>
      <div className='text-muted-foreground space-y-2 text-sm leading-relaxed'>{children}</div>
    </section>
  )
}

const TermsOfUsePage = () => {
  return (
    <div className='bg-background min-h-screen px-4 py-8 sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-3xl flex-col gap-4'>
        <HeaderSection
          action={
            <Link to={PATHS.LOGIN}>
              <Button
                className='h-10 rounded-full border border-black/5 bg-card hover:bg-card/80'
                variant='secondary'>
                {t('legal.backToLogin')}
              </Button>
            </Link>
          }
          description={t('pages.termsOfUse.header.description')}
          subtitle={t('legal.subtitle')}
          title={t('pages.termsOfUse.header.title')}
        />

        <CardSection className='gap-4'>
          <div>
            <p className='text-muted-foreground text-sm leading-relaxed'>
              Khi bạn truy cập hoặc sử dụng <span className='font-semibold'>3000 Việc Thiện</span>{' '}
              ("Ứng dụng"), bạn đồng ý với các điều khoản dưới đây. Nếu bạn chưa sẵn sàng đồng ý,
              bạn có thể dừng lại bất cứ lúc nào.
            </p>
            <UpdatedAt />
          </div>

          <Section title='1) Mục đích của Ứng dụng'>
            <p>
              Ứng dụng được thiết kế như một{' '}
              <span className='font-semibold'>nhật ký hướng thiện</span>: giúp bạn ghi nhận những
              hành động lành, quán chiếu thân – khẩu – ý, và duy trì thói quen sống tử tế.
            </p>
            <ul className='list-disc pl-5'>
              <li>
                Ứng dụng <span className='font-semibold'>không</span> phải mạng xã hội, không có
                bảng xếp hạng, không khuyến khích khoe thành tích.
              </li>
              <li>
                Ứng dụng <span className='font-semibold'>không</span> chấm điểm đạo đức, không đánh
                giá bạn đúng/sai.
              </li>
              <li>
                Ứng dụng <span className='font-semibold'>không</span> hứa hẹn các kết quả siêu hình
                (ví dụ: phước báu, chuyển nghiệp, chữa bệnh).
              </li>
            </ul>
          </Section>

          <Section title='2) Tài khoản & đăng nhập'>
            <p>
              Bạn đăng nhập bằng Google. Bạn chịu trách nhiệm bảo mật thiết bị và tài khoản Google
              của mình.
            </p>
            <ul className='list-disc pl-5'>
              <li>Không chia sẻ token/phiên đăng nhập với người khác.</li>
              <li>
                Nếu bạn nghi ngờ có truy cập trái phép, bạn nên đăng xuất và đăng nhập lại, hoặc đổi
                mật khẩu Google.
              </li>
            </ul>
          </Section>

          <Section title='3) Quy tắc sử dụng (Acceptable Use)'>
            <p>
              Bạn đồng ý sử dụng Ứng dụng theo cách không gây hại cho người khác và không gây gián
              đoạn hệ thống.
            </p>
            <ul className='list-disc pl-5'>
              <li>Không cố gắng truy cập trái phép, dò quét, phá hoại hoặc tấn công hệ thống.</li>
              <li>Không lạm dụng API/ứng dụng theo cách gây quá tải.</li>
              <li>Không sử dụng Ứng dụng để lưu trữ hoặc lan truyền nội dung bất hợp pháp.</li>
            </ul>
          </Section>

          <Section title='4) Nội dung bạn tạo (Việc thiện, nhật ký, ghi chú)'>
            <p>
              Bạn sở hữu nội dung bạn ghi lại. Ứng dụng chỉ lưu trữ và xử lý nội dung đó nhằm cung
              cấp chức năng cho bạn (hiển thị, thống kê, nhắc nhở… nếu có).
            </p>
            <ul className='list-disc pl-5'>
              <li>
                Mặc định nội dung trong Ứng dụng là <span className='font-semibold'>riêng tư</span>.
              </li>
              <li>
                Bạn hiểu rằng việc nhập các thông tin nhạy cảm (ví dụ: sức khoẻ, bí mật cá nhân) là
                lựa chọn của bạn. Nếu bạn không thoải mái, bạn có thể viết ít đi hoặc viết chung
                hơn.
              </li>
            </ul>
          </Section>

          <Section title='5) Nhắc nhở & thông báo'>
            <p>
              Ứng dụng chỉ nên gửi thông báo khi bạn chủ động bật nhắc nhở. Bạn có thể tắt bất cứ
              lúc nào trong phần cài đặt của Ứng dụng hoặc trong trình duyệt.
            </p>
          </Section>

          <Section title='6) Dịch vụ bên thứ ba'>
            <p>
              Để vận hành, Ứng dụng có thể sử dụng các nhà cung cấp hạ tầng/bên thứ ba (ví dụ:
              Google cho đăng nhập, nền tảng lưu trữ/hạ tầng). Các nhà cung cấp này có thể có điều
              khoản và chính sách riêng.
            </p>
          </Section>

          <Section title='7) Miễn trừ (Disclaimer)'>
            <ul className='list-disc pl-5'>
              <li>
                Ứng dụng là công cụ hỗ trợ thói quen và quán chiếu; không thay thế tư vấn y tế, pháp
                lý, tâm lý hoặc chuyên môn.
              </li>
              <li>
                Chúng tôi cố gắng đảm bảo dịch vụ ổn định, nhưng đôi khi có thể xảy ra gián đoạn,
                lỗi, hoặc mất kết nối.
              </li>
            </ul>
          </Section>

          <Section title='8) Thay đổi dịch vụ & điều khoản'>
            <p>
              Chúng tôi có thể cập nhật tính năng hoặc điều khoản để phù hợp với sự phát triển của
              Ứng dụng. Khi thay đổi quan trọng, chúng tôi sẽ cố gắng thông báo theo cách phù hợp
              trong Ứng dụng.
            </p>
          </Section>

          <Section title='9) Chấm dứt sử dụng'>
            <p>
              Bạn có thể ngừng sử dụng bất cứ lúc nào. Trong một số trường hợp (ví dụ: vi phạm quy
              tắc sử dụng nghiêm trọng), chúng tôi có thể hạn chế truy cập để bảo vệ hệ thống và
              người dùng.
            </p>
          </Section>

          <Section title='10) Liên hệ'>
            <p>
              Nếu bạn có câu hỏi về điều khoản, hoặc cần hỗ trợ về dữ liệu/tài khoản, bạn có thể
              liên hệ chúng tôi qua kênh hỗ trợ được công bố trong Ứng dụng/website.
            </p>
          </Section>
        </CardSection>

        <LegalFooter />
      </div>
    </div>
  )
}

export default TermsOfUsePage
