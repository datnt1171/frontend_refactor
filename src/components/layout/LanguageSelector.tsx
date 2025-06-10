"use client"

import { useLocale, useTranslations } from 'next-intl'
import { usePathname, useRouter } from "@/i18n/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { languages } from "@/constants/navigation"

export function LanguageSelector() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations()

  const handleLanguageChange = (newLocale: string) => {
    router.push(pathname, { locale: newLocale })
  }

  // Find current language for display
  const currentLanguage = languages.find(lang => lang.code === locale)

  return (
    <div className="w-32">
      <Select value={locale} onValueChange={handleLanguageChange}>
        <SelectTrigger className="h-8">
          <SelectValue>
            {currentLanguage && (
              <div className="flex items-center">
                <span className="mr-2">{currentLanguage.flag}</span>
                {t(currentLanguage.nameKey)}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              <div className="flex items-center">
                <span className="mr-2">{language.flag}</span>
                {t(language.nameKey)}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}