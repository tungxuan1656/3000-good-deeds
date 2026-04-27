import type { Metadata } from 'next'

import { LANDING_FAQS } from '@/components/faq-section'
import { SITE_URL } from '@/lib/site-config'
import LandingPage from '@/screens/landing-page'

const LANDING_TITLE =
  '3000 Việc Thiện | Theo dõi việc tốt mỗi ngày, miễn phí vĩnh viễn'

const LANDING_DESCRIPTION =
  '3000 Việc Thiện giúp bạn ghi nhận việc tốt mỗi ngày, nuôi dưỡng lòng biết ơn và duy trì thói quen tử tế bền vững trên điện thoại hoặc máy tính.'

const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'tungxuan.work10@gmail.com'

export const metadata: Metadata = {
  title: LANDING_TITLE,
  description: LANDING_DESCRIPTION,
  alternates: {
    canonical: '/',
    languages: {
      vi: '/',
      'vi-VN': '/',
    },
  },
  keywords: [
    '3000 việc thiện',
    'việc thiện mỗi ngày',
    'theo dõi việc tốt',
    'thói quen tử tế',
    'app việc thiện miễn phí',
    'liễu phàm tứ huấn',
  ],
  openGraph: {
    title: LANDING_TITLE,
    description: LANDING_DESCRIPTION,
    url: '/',
    type: 'website',
    locale: 'vi_VN',
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
    title: LANDING_TITLE,
    description: LANDING_DESCRIPTION,
    images: ['/twitter-image'],
  },
}

export default function MarketingPage() {
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: '3000 Việc Thiện',
      url: SITE_URL,
      logo: `${SITE_URL}/appicon.png`,
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: SUPPORT_EMAIL,
          availableLanguage: ['vi'],
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: '3000 Việc Thiện',
      url: SITE_URL,
      inLanguage: 'vi-VN',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: '3000 Việc Thiện',
      applicationCategory: 'LifestyleApplication',
      operatingSystem: 'Web',
      inLanguage: 'vi-VN',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'VND',
      },
      description: LANDING_DESCRIPTION,
      url: SITE_URL,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: LANDING_FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    },
  ]

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
        type='application/ld+json'
      />
      <LandingPage />
    </>
  )
}
