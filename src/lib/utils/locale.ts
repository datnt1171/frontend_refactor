export const getCurrentLocale = (): string => {
  if (typeof window !== "undefined") {
    const pathname = window.location.pathname
    const segments = pathname.split('/')
    const potentialLocale = segments[1]
    const supportedLocales = ['en', 'vi', 'zh-hant']
    if (supportedLocales.includes(potentialLocale)) {
      return potentialLocale
    }
    return localStorage.getItem('locale') || 'en'
  }
  return 'en'
}

export const getAcceptLanguage = (locale: string): string => {
  const localeMap: { [key: string]: string } = {
    'en': 'en-US,en;q=0.9',
    'vi': 'vi-VN,vi;q=0.9,en;q=0.8',
    'zh-hant': 'zh-TW,zh;q=0.9,en;q=0.8'
  }
  return localeMap[locale] || 'en-US,en;q=0.9'
}