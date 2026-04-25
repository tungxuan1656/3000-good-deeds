import type { Metadata } from 'next'
import { Be_Vietnam_Pro, Sora } from 'next/font/google'
import './globals.css'

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
  title: '3000 Việc Thiện',
  description: 'Landing page giới thiệu dự án 3000 Việc Thiện.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='vi'
      className={`${bodyFont.variable} ${headingFont.variable} h-full antialiased`}>
      <body className='min-h-full flex flex-col'>{children}</body>
    </html>
  )
}

