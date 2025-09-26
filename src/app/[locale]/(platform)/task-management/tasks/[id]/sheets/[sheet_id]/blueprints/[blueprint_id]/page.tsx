import { getSheetBlueprint, getBlueprint, getDataDetail } from '@/lib/api/server'
import { getTranslations } from 'next-intl/server'
import { getLocale } from 'next-intl/server'
import BlueprintViewer from './BlueprintPreview'

export default async function BlueprintsPage({ 
  params 
}: { 
  params: Promise<{ id: string, sheet_id: string, blueprint_id: string }> 
}) {
  const { id, sheet_id, blueprint_id } = await params
  const locale = await getLocale()
  const t = await getTranslations()
  
  // Fetch the sheet blueprint data
  const dataDetail = await getDataDetail(id)
  const sheetBlueprint = await getSheetBlueprint(id, sheet_id, blueprint_id)
  const blueprint = await getBlueprint(dataDetail.factory_code, sheetBlueprint.blueprint)
  // Map Next.js locale to component language format
  const getLanguage = (locale: string): 'en' | 'vi' | 'zh_hant' => {
    switch (locale) {
      case 'vi':
        return 'vi'
      case 'zh':
      case 'zh-TW':
      case 'zh-HK':
        return 'zh_hant'
      default:
        return 'en'
    }
  }
  return (
    <div>
      <BlueprintViewer
        sheetBlueprint={sheetBlueprint}
        blueprint={blueprint}
        language={getLanguage(locale)}
      />
    </div>
  )
}