import { t } from '@/lib/i18n'

export type MobileOs = 'android' | 'ios' | 'other'

export const getMobileOs = (): MobileOs => {
  if (typeof navigator === 'undefined') return 'other'

  const ua = navigator.userAgent.toLowerCase()
  if (ua.includes('android')) return 'android'
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'ios'

  return 'other'
}

export const isPwaInstalled = () => {
  if (typeof window === 'undefined') return false

  const displayModeStandalone = window.matchMedia('(display-mode: standalone)').matches
  const iosStandalone = Boolean(
    (window.navigator as Navigator & { standalone?: boolean }).standalone,
  )
  const androidTwa = document.referrer.startsWith('android-app://')

  return displayModeStandalone || iosStandalone || androidTwa
}

export const shouldShowPwaInstallGuide = (isMobile: boolean) => {
  const os = getMobileOs()

  return isMobile && (os === 'android' || os === 'ios') && !isPwaInstalled()
}

export const getPwaInstallGuideSteps = (os: MobileOs): string[] => {
  if (os === 'android') {
    return [
      t('pwa.installGuide.android.step1'),
      t('pwa.installGuide.android.step2'),
      t('pwa.installGuide.android.step3'),
      t('pwa.installGuide.android.step4'),
    ]
  }

  if (os === 'ios') {
    return [
      t('pwa.installGuide.ios.step1'),
      t('pwa.installGuide.ios.step2'),
      t('pwa.installGuide.ios.step3'),
      t('pwa.installGuide.ios.step4'),
    ]
  }

  return []
}
