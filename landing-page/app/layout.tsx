import './globals.css'

import type { Metadata } from 'next'
import { Be_Vietnam_Pro, Sora } from 'next/font/google'

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  'https://3000-viec-thien-landing.vercel.app'

const bodyFont = Be_Vietnam_Pro({
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
})

const headingFont = Sora({
  variable: '--font-heading',
  weight: ['600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
        url: '/images/og-cover-3000-viec-thien.webp',
        width: 1200,
        height: 630,
        alt: '3000 Việc Thiện - Theo dõi việc tốt mỗi ngày, miễn phí vĩnh viễn',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '3000 Việc Thiện | Theo dõi việc tốt mỗi ngày',
    description:
      'Nền tảng miễn phí vĩnh viễn giúp bạn xây dựng thói quen làm việc tốt mỗi ngày.',
    images: ['/images/og-cover-3000-viec-thien.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="vi"
      className={`${bodyFont.variable} ${headingFont.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}
