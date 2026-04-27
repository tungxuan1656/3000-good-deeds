import type { ParseKeys } from 'i18next'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import translationVI from './locales/vi.json'

const localesResource = {
  vi: { translation: translationVI },
}

const getAppLanguage = () => {
  if (typeof window === 'undefined') {
    return 'vi'
  }

  return localStorage.getItem('appLanguage') || 'vi'
}

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: typeof localesResource.vi
    returnNull: false
  }
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: localesResource,
    lng: getAppLanguage(),
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  })

export default i18n

/** Shorthand translate — use directly instead of hook (page reloads on language change). */
export const t = (
  key: ParseKeys<'translation'>,
  options?: Record<string, unknown>,
) => i18n.t(key, options as never) as unknown as string

/** Change language and reload the page (language changes are rare). */
export const changeLanguage = (lang: string) => {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem('appLanguage', lang)
  window.location.reload()
}
