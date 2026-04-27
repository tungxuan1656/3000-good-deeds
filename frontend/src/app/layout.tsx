import '../index.css'

import type { Metadata } from 'next'
import { Be_Vietnam_Pro, Noto_Serif } from 'next/font/google'

import { AppProviders } from '@/components/providers/app-providers'
import { SITE_URL } from '@/lib/site-config'

const bodyFont = Be_Vietnam_Pro({
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
})

const headingFont = Noto_Serif({
  variable: '--font-heading',
  weight: ['400', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: '3000 Việc Thiện | Theo dõi việc tốt mỗi ngày',
    template: '%s | 3000 Việc Thiện',
  },
  description:
    '3000 Việc Thiện là nền tảng theo dõi việc tốt mỗi ngày, miễn phí vĩnh viễn. Bắt đầu hành trình tử tế ngay trên điện thoại hoặc máy tính.',
  keywords: [
    'việc thiện mỗi ngày',
    'theo dõi việc tốt',
    'app việc thiện miễn phí',
    'thói quen làm việc tốt',
    '3000 việc thiện',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: '3000 Việc Thiện | Theo dõi việc tốt mỗi ngày',
    description:
      'Nền tảng miễn phí vĩnh viễn giúp bạn xây dựng thói quen làm việc tốt và lan tỏa tác động tích cực.',
    url: '/',
    siteName: '3000 Việc Thiện',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/appicon.png',
        width: 512,
        height: 512,
        alt: '3000 Việc Thiện',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '3000 Việc Thiện | Theo dõi việc tốt mỗi ngày',
    description:
      'Nền tảng miễn phí vĩnh viễn giúp bạn xây dựng thói quen làm việc tốt mỗi ngày.',
    images: ['/appicon.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      className={`${bodyFont.variable} ${headingFont.variable} h-full antialiased`}
      lang='vi'>
      <body className='flex min-h-full flex-col'>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
