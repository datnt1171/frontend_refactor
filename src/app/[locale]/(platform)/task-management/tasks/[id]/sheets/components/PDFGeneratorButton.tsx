'use client'
import { useState } from 'react'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { 
  generateSimpleFormPDF, 
  generateVFRFormPDF, 
  generateKaiserPDF,
  generateKhangshenPDF,
  generateReturnGoldPDF,
} from '@/lib/pdf-generator'
import type { FinishingSheet, TaskDataDetail } from '@/types'

interface PDFGeneratorButtonProps {
  sheet: FinishingSheet
  taskDataDetail: TaskDataDetail
  disabled?: boolean
}

const LANGUAGES = [
  { key: 'en', label: 'English' },
  { key: 'vi', label: 'Tiếng Việt' },
  { key: 'zh_hant', label: '繁體中文' },
] as const

type LangKey = typeof LANGUAGES[number]['key']

const FORMATS = [
  { key: 'vietlien',   label: 'Viet Lien' },
  { key: 'vfr', label: 'VFR' },
  { key: 'kaiser',   label: 'Kaiser' },
  { key: 'khangshen', label: 'Khang Shen' },
  { key: 'returngold', label: 'RETURN GOLD' },
] as const

type FormatKey = typeof FORMATS[number]['key']

export default function PDFGeneratorButton({
  sheet,
  taskDataDetail,
  disabled,
}: PDFGeneratorButtonProps) {
  const [open, setOpen] = useState(false)
  const [languages, setLanguages] = useState<Record<LangKey, boolean>>({
    en: false,
    vi: true,
    zh_hant: true,
  })
  const [format, setFormat] = useState<FormatKey>('vietlien')

  const toggleLang = (key: LangKey) =>
    setLanguages(prev => ({ ...prev, [key]: !prev[key] }))

  const handleGenerate = async () => {
    const config = { languages }
    switch (format) {
      case 'vietlien':
        generateSimpleFormPDF(sheet, taskDataDetail, config)
        break
      case 'vfr':
        generateVFRFormPDF(sheet, taskDataDetail, config)
        break
      case 'kaiser':
        await generateKaiserPDF(sheet, taskDataDetail, config)
        break
      case 'khangshen':
        await generateKhangshenPDF(sheet, taskDataDetail, config)
        break
      case 'returngold':
        await generateReturnGoldPDF(sheet, taskDataDetail, config)
        break

    }
    setOpen(false)
  }

  const noLanguageSelected = !Object.values(languages).some(Boolean)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 text-xs" disabled={disabled}>
          <FileText className="h-3 w-3 mr-1" />
          Generate PDF
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-56 p-3 space-y-3" align="end">
        {/* Languages */}
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Languages
          </p>
          {LANGUAGES.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={languages[key]}
                onCheckedChange={() => toggleLang(key)}
                className="h-3.5 w-3.5"
              />
              <span className="text-xs">{label}</span>
            </label>
          ))}
        </div>

        <div className="border-t pt-2 space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Format
          </p>
          {FORMATS.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="pdf-format"
                value={key}
                checked={format === key}
                onChange={() => setFormat(key)}
                className="h-3.5 w-3.5 accent-primary"
              />
              <span className="text-xs">{label}</span>
            </label>
          ))}
        </div>

        <Button
          size="sm"
          className="w-full h-7 text-xs"
          onClick={handleGenerate}
          disabled={noLanguageSelected}
        >
          Generate
        </Button>
      </PopoverContent>
    </Popover>
  )
}