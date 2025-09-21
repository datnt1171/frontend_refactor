import { getDataDetail, getFinishingSheet, getBlueprints  } from '@/lib/api/server'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText } from 'lucide-react'
import BlueprintCreateButton from './components/AddBluePrintForm'
import { getTypeColor, formatFileSize } from '@/lib/utils/format'
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
  const t = await getTranslations()

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{id} {t('blueprint.blueprint')}</h1>
        </div>
        
        <BlueprintCreateButton factoryId={id} />
      </div>

      {blueprints.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('common.noDataFound')}</h3>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blueprints.map((blueprint) => (
            <Card key={blueprint.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{blueprint.name}</CardTitle>
                    <Badge className={getTypeColor(blueprint.type)}>
                      {blueprint.type}
                    </Badge>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                {blueprint.description && (
                  <CardDescription>{blueprint.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex justify-between">
                    <span>{t('crm.factories.factoryId')}:</span>
                    <span className="font-medium">{blueprint.factory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('common.file')}:</span>
                    <span className="font-medium">{blueprint.filename}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('common.fileSize')}:</span>
                    <span className="font-medium">{formatFileSize(blueprint.file_size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('common.createdAt')}:</span>
                    <span className="font-medium">
                      {formatDateToUTC7(blueprint.created_at)}
                    </span>
                  </div>
                </div>
                <div className="flex">
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`/crm/factories/${id}/blueprints/${blueprint.id}`}>
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