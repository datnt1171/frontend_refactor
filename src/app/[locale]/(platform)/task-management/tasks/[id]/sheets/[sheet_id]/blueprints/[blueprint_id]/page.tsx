import { getSheetBlueprint } from '@/lib/api/server'
import { getTranslations } from 'next-intl/server'
import BlueprintPreview from './BlueprintPreview'

export default async function BlueprintsPage({ 
  params 
}: { 
  params: Promise<{ id: string, sheet_id: string, blueprint_id: string }> 
}) {
  const { id, sheet_id, blueprint_id } = await params
  const sheetBlueprint = await getSheetBlueprint(id, sheet_id, blueprint_id)
  const t = await getTranslations()

  return (
    <BlueprintPreview
        sheetBlueprint={sheetBlueprint}
        language="en" // Change to 'vi' or 'zh_hant' as needed
        onRefresh={loadSheetBlueprint}
      />
  )
}