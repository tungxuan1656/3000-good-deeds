import { HelpCircle } from 'lucide-react'

const faqs = [
  {
    q: '3000 Việc Thiện có mất phí không?',
    a: 'Không. Nền tảng miễn phí vĩnh viễn cho các tính năng cốt lõi như ghi nhận việc tốt, theo dõi tiến trình và sổ tay quán chiếu.',
  },
  {
    q: 'Tôi có cần cài app từ App Store hoặc CH Play không?',
    a: 'Không bắt buộc. Bạn có thể dùng trực tiếp trên trình duyệt, hoặc thêm vào màn hình chính để trải nghiệm như một ứng dụng.',
  },
  {
    q: 'Dữ liệu tiến trình có đồng bộ trên thiết bị khác không?',
    a: 'Có. Khi đăng nhập cùng một tài khoản, dữ liệu của bạn được đồng bộ để tiếp tục hành trình trên điện thoại hoặc máy tính.',
  },
  {
    q: 'Tôi có thể chia sẻ hành trình việc thiện của mình không?',
    a: 'Hiện tại chúng tôi ưu tiên không gian riêng tư, nên chưa tập trung vào chia sẻ công khai. Bạn toàn quyền giữ hành trình của mình cho riêng bản thân.',
  },
  {
    q: '"Việc tốt" có cần phải là điều gì đó lớn lao không?',
    a: 'Hoàn toàn không. Một nụ cười thân thiện, dắt tay người già qua đường, lắng nghe một người bạn đang buồn, hay thậm chí là tự tha thứ cho bản thân cũng là những việc tốt vô giá. Chúng tôi tin vào sức mạnh của những điều nhỏ bé.',
  },
  {
    q: 'Ai có thể xem được nhật ký việc thiện của tôi?',
    a: 'Dữ liệu của bạn là hoàn toàn riêng tư. Không ai khác có thể xem được ngoài chính bạn. Chúng tôi không xây dựng tính năng chia sẻ cộng đồng hay bảng xếp hạng để bảo vệ tuyệt đối không gian tĩnh lặng của bạn.',
  },
  {
    q: 'Tôi có thể sử dụng ứng dụng trên điện thoại không?',
    a: 'Có. Giao diện của 3000 Việc Thiện được tối ưu hóa đặc biệt cho trải nghiệm trên điện thoại thông minh (mobile-first), giúp bạn dễ dàng ghi nhận việc tốt mọi lúc mọi nơi.',
  },
  {
    q: 'Sổ tay quán chiếu (Reflection) dùng để làm gì?',
    a: 'Sổ tay quán chiếu là nơi bạn dành ra vài phút cuối ngày hoặc cuối tuần để viết về những điều bạn biết ơn (Gratitude) hoặc những điều bạn muốn sửa đổi, sám hối (Repentance). Điều này giúp bạn thấu hiểu bản thân sâu sắc hơn.',
  },
  {
    q: 'Liễu Phàm Tứ Huấn có liên quan gì đến dự án này?',
    a: 'Cuốn sách "Liễu Phàm Tứ Huấn" chính là nguồn cảm hứng cốt lõi cho dự án. Viên Liễu Phàm đã thay đổi vận mệnh của mình bằng cách tích lũy đủ 3000 việc thiện. Chúng tôi mong muốn mang triết lý nhân quả và cải mệnh đó vào thời hiện đại thông qua công cụ này.',
  },
  {
    q: 'Tôi có bị áp lực khi đặt mục tiêu số lượng việc tốt không?',
    a: 'Không hề. Mục tiêu chỉ là một con số để bạn tự tạo động lực cho bản thân, không phải KPI để đánh giá con người bạn. Bạn có thể tự do đặt mục tiêu phù hợp với nhịp sống của riêng mình.',
  },
]

export function FaqSection() {
  return (
    <section className='bg-surface-container py-24' id='faq'>
      <div className='container mx-auto max-w-3xl px-6'>
        <div className='mb-16 text-center'>
          <div className='bg-primary/10 text-primary mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl'>
            <HelpCircle className='h-6 w-6' />
          </div>
          <h2 className='font-headline text-foreground text-3xl font-bold tracking-tight sm:text-4xl'>
            Câu hỏi thường gặp
          </h2>
          <p className='text-muted-foreground mt-4 text-lg'>
            Giải đáp những thắc mắc phổ biến về hành trình 3000 Việc Thiện.
          </p>
        </div>

        <div className='space-y-6'>
          {faqs.map((faq) => (
            <div
              key={faq.q}
              className='border-border hover:border-primary/30 rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-md'>
              <h3 className='text-foreground mb-3 text-lg font-bold'>
                {faq.q}
              </h3>
              <p className='text-muted-foreground leading-relaxed'>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
