import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { CardSection, HeaderSection } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { PATHS } from '@/lib/constants'

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

const PrivacyPolicyPage = () => {
  return (
    <div className='bg-background min-h-screen px-4 py-8 sm:px-6 lg:px-8'>
      <div className='mx-auto flex w-full max-w-3xl flex-col gap-4'>
        <HeaderSection
          action={
            <Link to={PATHS.LOGIN}>
              <Button
                className='h-10 rounded-full border border-black/5 bg-white hover:bg-white/80'
                variant='secondary'>
                Quay về đăng nhập
              </Button>
            </Link>
          }
          description='Chúng tôi coi quyền riêng tư là tối thượng. Trang này giải thích rõ dữ liệu nào được thu thập, dùng vào việc gì, và bạn có thể kiểm soát ra sao.'
          subtitle='Pháp lý'
          title='Chính sách riêng tư'
        />

        <CardSection className='gap-4'>
          <div>
            <p className='text-muted-foreground text-sm leading-relaxed'>
              <span className='font-semibold'>3000 Việc Thiện</span> được thiết kế như một “không
              gian số yên tĩnh, an toàn và riêng tư”. Mặc định, các ghi nhận của bạn là{' '}
              <span className='font-semibold'>riêng tư</span>.
            </p>
            <UpdatedAt />
          </div>

          <Section title='1) Tóm tắt dễ hiểu (TL;DR)'>
            <ul className='list-disc pl-5'>
              <li>Chúng tôi không bán dữ liệu và không thu thập hành vi để chạy quảng cáo.</li>
              <li>
                Dữ liệu ghi nhận (việc thiện, nhật ký…) được dùng để cung cấp chức năng cho bạn.
              </li>
              <li>
                Thông báo chỉ gửi khi bạn bật nhắc nhở (opt-in) và bạn có thể tắt bất cứ lúc nào.
              </li>
              <li>Bạn có quyền xem, chỉnh sửa, và yêu cầu xoá dữ liệu/tài khoản của mình.</li>
            </ul>
          </Section>

          <Section title='2) Dữ liệu chúng tôi thu thập'>
            <p>
              Để Ứng dụng hoạt động, chúng tôi có thể xử lý một số nhóm dữ liệu sau (tuỳ cách bạn sử
              dụng tính năng):
            </p>
            <ul className='list-disc pl-5'>
              <li>
                <span className='font-semibold'>Thông tin tài khoản</span>: dữ liệu cơ bản từ Google
                khi bạn đăng nhập (ví dụ: tên hiển thị, email, ảnh đại diện), cùng các thông tin hồ
                sơ bạn tự nhập (nếu có).
              </li>
              <li>
                <span className='font-semibold'>Nội dung bạn ghi nhận</span>: việc thiện
                (thân/khẩu/ý), ghi chú, thời điểm thực hiện; các nội dung nhật ký/quán chiếu mà bạn
                chủ động viết.
              </li>
              <li>
                <span className='font-semibold'>Cài đặt</span>: múi giờ, tuỳ chọn nhắc nhở, và các
                cấu hình trải nghiệm khác.
              </li>
              <li>
                <span className='font-semibold'>Dữ liệu kỹ thuật tối thiểu</span>: thông tin cần
                thiết để vận hành phiên đăng nhập, bảo mật, chống lỗi và đồng bộ (ví dụ: token đăng
                nhập, thời điểm tạo/cập nhật bản ghi).
              </li>
              <li>
                <span className='font-semibold'>Dữ liệu thông báo đẩy</span> (nếu bạn bật nhắc nhở):
                thông tin subscription (endpoint/keys) để gửi “nhắc nhẹ”.
              </li>
            </ul>
          </Section>

          <Section title='3) Chúng tôi dùng dữ liệu để làm gì'>
            <ul className='list-disc pl-5'>
              <li>Xác thực đăng nhập và duy trì phiên sử dụng.</li>
              <li>Lưu trữ và hiển thị lại các ghi nhận để bạn quán chiếu.</li>
              <li>Tạo thống kê/nhìn lại thói quen (ở mức phục vụ bạn, không phải để đánh giá).</li>
              <li>Gửi nhắc nhở khi bạn chủ động bật.</li>
              <li>Bảo vệ hệ thống trước truy cập bất thường và khắc phục lỗi.</li>
            </ul>
          </Section>

          <Section title='4) Dữ liệu được chia sẻ với ai'>
            <p>
              Chúng tôi chỉ chia sẻ dữ liệu ở mức cần thiết để cung cấp dịch vụ. Các nhóm bên thứ ba
              có thể liên quan gồm:
            </p>
            <ul className='list-disc pl-5'>
              <li>
                <span className='font-semibold'>Google</span>: phục vụ đăng nhập (OAuth).
              </li>
              <li>
                <span className='font-semibold'>Nhà cung cấp hạ tầng</span>: nơi chạy backend/lưu
                trữ cơ sở dữ liệu và phân phối frontend.
              </li>
              <li>
                <span className='font-semibold'>Dịch vụ Push theo nền tảng</span>: trình duyệt/thiết
                bị có thể dùng các dịch vụ push của hệ điều hành để chuyển thông báo.
              </li>
            </ul>
            <p>
              Chúng tôi <span className='font-semibold'>không</span> bán dữ liệu của bạn.
            </p>
          </Section>

          <Section title='5) Lưu trữ cục bộ (trên thiết bị của bạn)'>
            <p>
              Để trải nghiệm mượt và offline-friendly (PWA), Ứng dụng có thể lưu một số dữ liệu trên
              trình duyệt của bạn:
            </p>
            <ul className='list-disc pl-5'>
              <li>Token đăng nhập (để duy trì phiên).</li>
              <li>Một phần dữ liệu đệm (cache) để tải nhanh hơn.</li>
              <li>Tệp cache tĩnh do PWA/service worker quản lý (ảnh/icon/tài nguyên giao diện).</li>
            </ul>
            <p>
              Bạn có thể xoá dữ liệu cục bộ bằng cách xoá dữ liệu trang web trong cài đặt trình
              duyệt.
            </p>
          </Section>

          <Section title='6) Quyền kiểm soát của bạn'>
            <ul className='list-disc pl-5'>
              <li>
                <span className='font-semibold'>Tắt nhắc nhở</span>: bạn có thể tắt bất cứ lúc nào
                trong cài đặt.
              </li>
              <li>
                <span className='font-semibold'>Chỉnh sửa nội dung</span>: tuỳ theo từng tính năng,
                bạn có thể chỉnh sửa hoặc xoá các ghi nhận trong Ứng dụng.
              </li>
              <li>
                <span className='font-semibold'>Yêu cầu xoá tài khoản/dữ liệu</span>: nếu bạn muốn
                xoá toàn bộ dữ liệu, bạn có thể gửi yêu cầu qua kênh hỗ trợ được công bố trong Ứng
                dụng/website. Chúng tôi ưu tiên làm việc này rõ ràng và dứt điểm.
              </li>
              <li>
                <span className='font-semibold'>Xuất dữ liệu</span>: chúng tôi hướng tới việc cho
                phép bạn xuất dữ liệu ở định dạng dễ đọc; nếu tính năng chưa có sẵn trong Ứng dụng
                tại thời điểm bạn đọc, bạn có thể yêu cầu hỗ trợ.
              </li>
            </ul>
          </Section>

          <Section title='7) Bảo mật'>
            <p>
              Chúng tôi áp dụng các biện pháp hợp lý để bảo vệ dữ liệu (ví dụ: cơ chế xác thực, giới
              hạn truy cập, phân tách môi trường). Tuy vậy, không hệ thống nào an toàn tuyệt đối;
              nếu có rủi ro hoặc sự cố, chúng tôi sẽ cố gắng xử lý minh bạch và kịp thời.
            </p>
          </Section>

          <Section title='8) Lưu trữ & thời hạn giữ dữ liệu'>
            <p>
              Chúng tôi giữ dữ liệu trong thời gian cần thiết để cung cấp dịch vụ cho bạn, hoặc cho
              đến khi bạn xoá/yêu cầu xoá. Một số bản ghi kỹ thuật có thể được giữ ngắn hạn để phục
              vụ bảo mật và vận hành.
            </p>
          </Section>

          <Section title='9) Trẻ em'>
            <p>
              Ứng dụng hướng đến người dùng có khả năng tự chịu trách nhiệm về việc ghi nhận và nội
              dung của mình. Nếu bạn là phụ huynh/người giám hộ và có lo ngại, vui lòng liên hệ để
              được hỗ trợ.
            </p>
          </Section>

          <Section title='10) Thay đổi chính sách'>
            <p>
              Khi có thay đổi quan trọng, chúng tôi sẽ cố gắng thông báo trong Ứng dụng. Việc bạn
              tiếp tục sử dụng sau khi cập nhật đồng nghĩa bạn đã đọc và hiểu các thay đổi.
            </p>
          </Section>

          <Section title='11) Liên hệ'>
            <p>
              Nếu bạn có câu hỏi về quyền riêng tư, hoặc muốn yêu cầu xuất/xoá dữ liệu, vui lòng
              liên hệ qua kênh hỗ trợ được công bố trong Ứng dụng/website.
            </p>
          </Section>

          <div className='pt-2'>
            <p className='text-muted-foreground text-xs leading-relaxed'>
              Trang pháp lý liên quan:{' '}
              <Link className='text-foreground underline underline-offset-4' to={PATHS.TERMS}>
                Điều khoản sử dụng
              </Link>
              .
            </p>
          </div>
        </CardSection>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
