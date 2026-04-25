import { CtaButton } from '@/components/cta-button'
import { FaqItem } from '@/components/faq-item'
import { FeatureCard } from '@/components/feature-card'
import { ImagePlaceholder } from '@/components/image-placeholder'
import { SectionBlock } from '@/components/section-block'
import { SiteHeader } from '@/components/site-header'

export default function Home() {
  const webAppUrl = 'https://3000-viec-thien.web.app/'
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    'https://3000-viec-thien-landing.vercel.app'
  const faqItems = [
    {
      question: '3000 Việc Thiện có mất phí không?',
      answer:
        'Không. Website được định hướng miễn phí vĩnh viễn cho người dùng, không thu phí để sử dụng các chức năng cốt lõi.',
    },
    {
      question: 'Tôi có thể dùng trên điện thoại không?',
      answer:
        'Có. Bạn có thể mở trực tiếp bằng trình duyệt trên iPhone hoặc Android, sau đó lưu ra màn hình chính để dùng nhanh như một web app.',
    },
    {
      question: 'Tôi có cần tải ứng dụng từ App Store hoặc CH Play không?',
      answer:
        'Không bắt buộc. Bạn có thể truy cập trực tiếp bằng trình duyệt và vẫn có trải nghiệm đầy đủ cho nhu cầu theo dõi việc tốt hằng ngày.',
    },
    {
      question: '3000 Việc Thiện phù hợp với ai?',
      answer:
        'Phù hợp với mọi người muốn xây dựng thói quen làm việc tốt, từ cá nhân mới bắt đầu đến nhóm cộng đồng muốn lan tỏa điều tích cực.',
    },
  ]
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '3000 Việc Thiện',
    url: siteUrl,
    inLanguage: 'vi-VN',
  }
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '3000 Việc Thiện',
    url: siteUrl,
    logo: `${siteUrl}/images/og-cover-3000-viec-thien.webp`,
  }
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }
  const showcasePlaceholders = [
    {
      fileName: 'hero-dashboard-mobile.webp',
      alt: 'Ảnh giao diện webapp 3000 Việc Thiện trên iPhone',
      ratio: '4 / 5',
      description:
        'Ảnh màn hình iPhone đang dùng webapp thật, thể hiện rõ khu vực theo dõi hành trình việc thiện.',
    },
    {
      fileName: 'hero-dashboard-desktop.webp',
      alt: 'Ảnh giao diện webapp 3000 Việc Thiện trên máy tính',
      ratio: '16 / 10',
      description:
        'Ảnh desktop hiển thị dashboard tổng quan, giúp người dùng mới hình dung ngay cách sử dụng.',
    },
    {
      fileName: 'feature-tracking-list.webp',
      alt: 'Màn hình danh sách việc thiện đã hoàn thành',
      ratio: '16 / 10',
      description:
        'Ảnh thể hiện danh sách việc thiện theo ngày, nhấn mạnh khả năng theo dõi thói quen rõ ràng.',
    },
    {
      fileName: 'feature-progress-view.webp',
      alt: 'Màn hình theo dõi tiến trình làm việc thiện mỗi ngày',
      ratio: '16 / 10',
      description:
        'Ảnh thống kê tiến trình hoặc chuỗi duy trì để tăng tính thuyết phục về lợi ích dài hạn.',
    },
    {
      fileName: 'social-proof-community.webp',
      alt: 'Ảnh cộng đồng tham gia hoạt động thiện nguyện',
      ratio: '3 / 2',
      description:
        'Ảnh social proof về cộng đồng, giúp tăng niềm tin và ý nghĩa xã hội của dự án.',
    },
  ]
  const installPlaceholders = [
    {
      fileName: 'ios-install-step-1.webp',
      alt: 'Safari iOS mở webapp và hiển thị nút Share',
      ratio: '9 / 19.5',
      description: 'Bước 1 iOS: mở webapp trên Safari và nhấn Share.',
    },
    {
      fileName: 'ios-install-step-2.webp',
      alt: 'Menu iOS hiển thị Add to Home Screen',
      ratio: '9 / 19.5',
      description: 'Bước 2 iOS: chọn Add to Home Screen.',
    },
    {
      fileName: 'ios-install-step-3.webp',
      alt: 'Icon webapp xuất hiện ở màn hình chính iPhone',
      ratio: '9 / 19.5',
      description:
        'Bước 3 iOS: xác nhận icon webapp đã có trên màn hình chính.',
    },
    {
      fileName: 'android-install-step-1.webp',
      alt: 'Chrome Android mở webapp và hiển thị menu cài app',
      ratio: '9 / 19.5',
      description: 'Bước 1 Android: mở webapp bằng Chrome và mở menu cài đặt.',
    },
    {
      fileName: 'android-install-step-2.webp',
      alt: 'Popup Add to Home screen trên Android',
      ratio: '9 / 19.5',
      description: 'Bước 2 Android: chọn Add to Home screen hoặc Install app.',
    },
    {
      fileName: 'android-install-step-3.webp',
      alt: 'Icon webapp xuất hiện trong launcher Android',
      ratio: '9 / 19.5',
      description:
        'Bước 3 Android: xác nhận icon webapp đã xuất hiện trong launcher.',
    },
  ]

  return (
    <div className='min-h-screen bg-background text-slate-900'>
      <SiteHeader webAppUrl={webAppUrl} />

      <main id='top'>
        <section className='relative overflow-hidden'>
          <div className='pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-(--brand-accent)/20 blur-3xl' />
          <div className='pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-(--brand-primary)/15 blur-3xl' />

          <div className='mx-auto w-full max-w-6xl px-6 py-16 md:py-24'>
            <p className='text-xs font-semibold tracking-[0.22em] text-(--brand-primary) uppercase'>
              Nền tảng cộng đồng miễn phí
            </p>
            <h1 className='mt-4 max-w-4xl text-4xl leading-tight font-bold tracking-tight md:text-6xl'>
              3000 Việc Thiện - Theo dõi việc tốt mỗi ngày, miễn phí vĩnh viễn
            </h1>
            <p className='mt-6 max-w-3xl text-base leading-7 text-slate-700 md:text-lg'>
              3000 Việc Thiện là nền tảng giúp bạn xây dựng thói quen làm việc
              tốt mỗi ngày bằng cách ghi nhận các hành động tích cực, theo dõi
              tiến trình và duy trì động lực. Dự án được phát triển để lan tỏa
              tinh thần sẻ chia trong cộng đồng, không thu phí sử dụng và giữ
              cam kết miễn phí vĩnh viễn.
            </p>
            <p className='mt-4 max-w-3xl text-base leading-7 text-slate-700 md:text-lg'>
              Nếu bạn đang tìm một app việc thiện miễn phí, dễ dùng trên điện
              thoại và máy tính, đây là điểm bắt đầu phù hợp để hình thành hành
              trình tử tế bền vững cho chính bạn và những người xung quanh.
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
          description='Nhiều người muốn làm việc tốt nhưng thiếu một hệ thống đơn giản để bắt đầu và duy trì đều đặn. 3000 Việc Thiện ra đời để biến những hành động tử tế nhỏ hằng ngày thành một hành trình rõ ràng, có thể theo dõi và duy trì lâu dài.'
        />

        <SectionBlock
          id='loi-ich'
          title='Lợi ích khi dùng webapp 3000 Việc Thiện'>
          <div className='mt-6 grid gap-6 md:grid-cols-2'>
            <article className='rounded-2xl border border-slate-200 bg-white p-6'>
              <h3 className='text-lg font-semibold tracking-tight text-slate-900'>
                Theo dõi việc tốt rõ ràng, dễ duy trì
              </h3>
              <p className='mt-3 text-base leading-7 text-slate-700'>
                Bạn có thể ghi lại từng hành động tích cực trong ngày để thấy
                tiến trình của mình. Khi nhìn thấy chuỗi việc tốt được duy trì
                liên tục, động lực sẽ tăng lên một cách tự nhiên.
              </p>
            </article>
            <article className='rounded-2xl border border-slate-200 bg-white p-6'>
              <h3 className='text-lg font-semibold tracking-tight text-slate-900'>
                Dùng ngay trên điện thoại, không rào cản
              </h3>
              <p className='mt-3 text-base leading-7 text-slate-700'>
                Không cần cài đặt phức tạp hay trả phí. Bạn mở trình duyệt là
                dùng được, có thể lưu ra màn hình chính như web app để truy cập
                nhanh mỗi ngày.
              </p>
            </article>
            <article className='rounded-2xl border border-slate-200 bg-white p-6'>
              <h3 className='text-lg font-semibold tracking-tight text-slate-900'>
                Miễn phí vĩnh viễn cho cộng đồng
              </h3>
              <p className='mt-3 text-base leading-7 text-slate-700'>
                Dự án được định hướng phục vụ cộng đồng lâu dài, giúp mọi người
                dễ dàng tham gia hành trình việc thiện mà không bị giới hạn bởi
                chi phí.
              </p>
            </article>
            <article className='rounded-2xl border border-slate-200 bg-white p-6'>
              <h3 className='text-lg font-semibold tracking-tight text-slate-900'>
                Phù hợp cho cá nhân và nhóm
              </h3>
              <p className='mt-3 text-base leading-7 text-slate-700'>
                Từ học sinh, sinh viên đến người đi làm đều có thể áp dụng để
                xây thói quen tử tế mỗi ngày và lan tỏa tác động tích cực trong
                môi trường sống.
              </p>
            </article>
          </div>
        </SectionBlock>

        <SectionBlock id='cach-hoat-dong' title='Cách bắt đầu trong 3 bước'>
          <div className='mt-6 grid gap-6 md:grid-cols-3'>
            <FeatureCard
              step='Bước 01'
              title='Mở web app'
              description='Truy cập nền tảng từ trình duyệt trên điện thoại hoặc máy tính để bắt đầu hành trình việc thiện.'
            />
            <FeatureCard
              step='Bước 02'
              title='Ghi nhận việc tốt'
              description='Lưu lại các hành động tích cực trong ngày để thấy bạn đã làm được gì và duy trì thói quen.'
            />
            <FeatureCard
              step='Bước 03'
              title='Duy trì đều đặn'
              description='Tiếp tục thực hiện các việc tốt nhỏ mỗi ngày để tạo ảnh hưởng bền vững cho bản thân và cộng đồng.'
            />
          </div>
        </SectionBlock>

        <SectionBlock
          id='hinh-anh-thuc-te'
          title='Trải nghiệm giao diện webapp qua ảnh thực tế'>
          <p className='max-w-3xl text-base leading-7 text-slate-700'>
            Các khối dưới đây là placeholder đã gắn đúng tỉ lệ để tránh nhảy
            layout. Khi có ảnh thật, chỉ cần thay đúng tên file tương ứng trong
            thư mục ảnh.
          </p>
          <div className='mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
            {showcasePlaceholders.map((item) => (
              <ImagePlaceholder
                key={item.fileName}
                fileName={item.fileName}
                alt={item.alt}
                ratio={item.ratio}
                description={item.description}
              />
            ))}
          </div>
        </SectionBlock>

        <SectionBlock
          id='cai-webapp'
          tone='muted'
          title='Hướng dẫn cài web app trên iOS và Android'>
          <p className='max-w-3xl text-base leading-7 text-slate-700'>
            Bạn có thể cài nhanh 3000 Việc Thiện ra màn hình chính để dùng như
            ứng dụng. Bên dưới là các placeholder cho chuỗi ảnh hướng dẫn từng
            bước.
          </p>
          <div className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6'>
            {installPlaceholders.map((item) => (
              <ImagePlaceholder
                key={item.fileName}
                fileName={item.fileName}
                alt={item.alt}
                ratio={item.ratio}
                description={item.description}
              />
            ))}
          </div>
        </SectionBlock>

        <SectionBlock id='faq' tone='muted' title='Câu hỏi thường gặp'>
          <div className='mt-6 space-y-6'>
            {faqItems.map((item) => (
              <FaqItem
                key={item.question}
                question={item.question}
                answer={item.answer}
              />
            ))}
            <div className='mt-6'>
              <CtaButton href={webAppUrl} label='Mở web app 3000 Việc Thiện' />
            </div>
          </div>
        </SectionBlock>
      </main>

      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <footer className='border-t border-slate-200 bg-white'>
        <div className='mx-auto w-full max-w-6xl px-6 py-8 text-sm text-slate-600'>
          © 3000 Việc Thiện
        </div>
      </footer>
    </div>
  )
}

