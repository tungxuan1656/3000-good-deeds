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
      'Bước 1: Mở trang web trên trình duyệt Chrome trên điện thoại Android.',
      'Bước 2: Nhấn vào biểu tượng menu 3 chấm (⋮) ở góc trên bên phải.',
      'Bước 3: Chọn "Cài đặt ứng dụng" (Install app) hoặc "Thêm vào màn hình chính" (Add to Home Screen).',
      'Bước 4: Xác nhận cài đặt. Biểu tượng ứng dụng sẽ xuất hiện trên màn hình chính và trong ngăn ứng dụng.',
    ]
  }

  if (os === 'ios') {
    return [
      'Bước 1: Mở trang web trên trình duyệt Safari (không sử dụng trình duyệt khác) trên iPhone/iPad.',
      'Bước 2: Nhấn vào nút Chia sẻ (hình vuông có mũi tên hướng lên) ở thanh công cụ.',
      'Bước 3: Chọn "Thêm vào Màn hình chính" (Add to Home Screen).',
      'Bước 4: Nhấn "Thêm" để xác nhận. Biểu tượng ứng dụng sẽ xuất hiện trên màn hình chính.',
    ]
  }

  return []
}
