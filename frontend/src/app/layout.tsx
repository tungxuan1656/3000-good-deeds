import '../index.css'

import type { Metadata, Viewport } from 'next'
import { Be_Vietnam_Pro, Noto_Serif } from 'next/font/google'

import { AppProviders } from '@/components/providers/app-providers'
import { SITE_URL } from '@/lib/site-config'

const beVietnamPro = Be_Vietnam_Pro({
  variable: '--font-be-vietnam-pro',
  subsets: ['latin', 'vietnamese'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

const notoSerif = Noto_Serif({
  variable: '--font-noto-serif',
  subsets: ['latin', 'vietnamese'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: '3000 Việc Thiện',
  referrer: 'origin-when-cross-origin',
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
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/appicon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: '48x48' },
    ],
    apple: [
      {
        url: '/apple-touch-icon-180x180.png',
        sizes: '180x180',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '3000 Việc Thiện',
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
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: '3000 Việc Thiện',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '3000 Việc Thiện | Theo dõi việc tốt mỗi ngày',
    description:
      'Nền tảng miễn phí vĩnh viễn giúp bạn xây dựng thói quen làm việc tốt mỗi ngày.',
    images: ['/twitter-image'],
  },
  other: {
    HandheldFriendly: 'true',
    'mobile-web-app-capable': 'yes',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      className={`${beVietnamPro.variable} ${notoSerif.variable} h-full antialiased`}
      lang='vi'>
      <body suppressHydrationWarning className='flex min-h-full flex-col'>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
