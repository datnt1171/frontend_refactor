import { getDataDetail, getFinishingSheet, getBlueprints, getSheetBlueprints  } from '@/lib/api/server'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText } from 'lucide-react'
import BlueprintCreateButton from './components/AddSheetBluePrintForm'
import { getTranslations } from 'next-intl/server'
import { formatDateToUTC7 } from '@/lib/utils/date'

export default async function BlueprintsPage({ 
  params 
}: { 
  params: Promise<{ id: string, sheet_id: string }> 
}) {
  const { id, sheet_id } = await params
  const taskDataDetail = await getDataDetail(id)
  const finishingSheet = await getFinishingSheet(id, sheet_id)
  const blueprints = await getBlueprints(taskDataDetail.name_of_customer)
  const paginatedSheetBlueprints = await getSheetBlueprints(id, sheet_id)
  const sheetBlueprints = paginatedSheetBlueprints.results
  const t = await getTranslations()

  // Helper function to get blueprint name by ID
  const getBlueprintName = (blueprintId: string) => {
    const blueprint = blueprints.find(bp => bp.id === blueprintId)
    return blueprint?.name || blueprintId
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{finishingSheet.finishing_code} {t('blueprint.blueprint')}</h1>
        </div>
        
        <BlueprintCreateButton
          TaskId={id}
          SheetId={sheet_id}
          Blueprints={blueprints}
        />
      </div>

      {sheetBlueprints.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('common.noDataFound')}</h3>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sheetBlueprints.map((sheetBlueprint) => (
            <Card key={sheetBlueprint.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">
                      {getBlueprintName(sheetBlueprint.blueprint)}
                    </CardTitle>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                {sheetBlueprint.description && (
                  <CardDescription>{sheetBlueprint.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex justify-between">
                    <span>{t('common.createdBy')}:</span>
                    <span className="font-medium">{sheetBlueprint.created_by.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('common.createdAt')}:</span>
                    <span className="font-medium">
                      {formatDateToUTC7(sheetBlueprint.created_at)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('common.updatedBy')}:</span>
                    <span className="font-medium">{sheetBlueprint.updated_by.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('common.updatedAt')}:</span>
                    <span className="font-medium">
                      {formatDateToUTC7(sheetBlueprint.updated_at)}
                    </span>
                  </div>
                </div>
                <div className="flex">
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`/task-management/tasks/${id}/sheets/${sheet_id}/blueprints/${sheetBlueprint.id}`}>
                      {t('common.viewDetails')}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}