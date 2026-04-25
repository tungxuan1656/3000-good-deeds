import { HelpCircle } from 'lucide-react'

const faqs = [
  {
    q: '"Việc tốt" có cần phải là điều gì đó lớn lao không?',
    a: 'Hoàn toàn không. Một nụ cười thân thiện, dắt tay người già qua đường, lắng nghe một người bạn đang buồn, hay thậm chí là tự tha thứ cho bản thân cũng là những việc tốt vô giá. Chúng tôi tin vào sức mạnh của những điều nhỏ bé.'
  },
  {
    q: 'Ai có thể xem được nhật ký việc thiện của tôi?',
    a: 'Dữ liệu của bạn là hoàn toàn riêng tư. Không ai khác có thể xem được ngoài chính bạn. Chúng tôi không xây dựng tính năng chia sẻ cộng đồng hay bảng xếp hạng để bảo vệ tuyệt đối không gian tĩnh lặng của bạn.'
  },
  {
    q: 'Tại sao ứng dụng lại miễn phí vĩnh viễn?',
    a: 'Bởi vì lòng tốt nên được lan tỏa mà không có bất kỳ rào cản nào. Chúng tôi phát triển và duy trì dự án này từ niềm vui được cống hiến cho cộng đồng.'
  },
  {
    q: 'Tôi có thể sử dụng ứng dụng trên điện thoại không?',
    a: 'Có. Giao diện của 3000 Việc Thiện được tối ưu hóa đặc biệt cho trải nghiệm trên điện thoại thông minh (mobile-first), giúp bạn dễ dàng ghi nhận việc tốt mọi lúc mọi nơi.'
  },
  {
    q: 'Sổ tay quán chiếu (Reflection) dùng để làm gì?',
    a: 'Sổ tay quán chiếu là nơi bạn dành ra vài phút cuối ngày hoặc cuối tuần để viết về những điều bạn biết ơn (Gratitude) hoặc những điều bạn muốn sửa đổi, sám hối (Repentance). Điều này giúp bạn thấu hiểu bản thân sâu sắc hơn.'
  },
  {
    q: 'Liễu Phàm Tứ Huấn có liên quan gì đến dự án này?',
    a: 'Cuốn sách "Liễu Phàm Tứ Huấn" chính là nguồn cảm hứng cốt lõi cho dự án. Viên Liễu Phàm đã thay đổi vận mệnh của mình bằng cách tích lũy đủ 3000 việc thiện. Chúng tôi mong muốn mang triết lý nhân quả và cải mệnh đó vào thời hiện đại thông qua công cụ này.'
  },
  {
    q: 'Tôi có bị áp lực khi đặt mục tiêu số lượng việc tốt không?',
    a: 'Không hề. Mục tiêu chỉ là một con số để bạn tự tạo động lực cho bản thân, không phải KPI để đánh giá con người bạn. Bạn có thể tự do đặt mục tiêu phù hợp với nhịp sống của riêng mình.'
  }
]

export function FaqSection() {
  return (
    <section id="faq" className="bg-surface-container py-24">
      <div className="container mx-auto max-w-3xl px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-6">
            <HelpCircle className="h-6 w-6" />
          </div>
          <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Câu hỏi thường gặp
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Giải đáp những thắc mắc phổ biến về hành trình 3000 Việc Thiện.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-border transition-all hover:shadow-md hover:border-primary/30">
              <h3 className="text-lg font-bold text-foreground mb-3">{faq.q}</h3>
              <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
