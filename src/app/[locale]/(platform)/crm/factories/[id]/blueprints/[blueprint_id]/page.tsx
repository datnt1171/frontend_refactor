import { getBlueprint } from '@/lib/api/server/blueprints'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download } from 'lucide-react'
import { Label } from '@/components/ui/label'
import BackButton from '@/components/ui/BackButton'
import BlueprintEditButton from './components/EditForm'
import BlueprintDeleteButton from './components/DeleteButton'
import { getTranslations } from 'next-intl/server'
import { getTypeColor, formatFileSize } from '@/lib/utils/format'

export default async function BlueprintDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string, blueprint_id: string }> 
}) {
  const { id, blueprint_id } = await params
  const blueprint = await getBlueprint(id, blueprint_id)
  const t = await getTranslations()

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <BackButton />
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{blueprint.name}</h1>
        </div>
        <div className="flex gap-2">
          <BlueprintEditButton 
            factoryId={id}
            blueprintId={blueprint_id}
            blueprint={{
              name: blueprint.name,
              type: blueprint.type,
              description: blueprint.description
            }}
          />
          <BlueprintDeleteButton 
            factoryId={id}
            blueprintId={blueprint_id}
            blueprintName={blueprint.name}
          />
        </div>
      </div>

      {/* Blueprint Details Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{blueprint.name}</CardTitle>
            <Badge className={getTypeColor(blueprint.type)}>
              {blueprint.type}
            </Badge>
          </div>
          {blueprint.description && (
            <CardDescription>{blueprint.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">{t('crm.factories.factoryId')}</Label>
              <p className="text-sm">{id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">{t('common.id')}</Label>
              <p className="text-sm">{blueprint_id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">{t('blueprint.type')}</Label>
              <p className="text-sm">{blueprint.type}</p>
            </div>
            {blueprint.file_size && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">{t('common.fileSize')}</Label>
                <p className="text-sm">{formatFileSize(blueprint.file_size)}</p>
              </div>
            )}
          </div>
          
          {blueprint.description && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">{t('common.description')}</Label>
              <p className="text-sm mt-1">{blueprint.description}</p>
            </div>
          )}

          {/* SVG Preview if available */}
          {blueprint.file_url && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">{t('common.preview')}</Label>
              <div className="mt-2 border rounded-lg p-4 bg-gray-50">
                <img 
                  src={blueprint.file_url} 
                  alt={`${blueprint.name} preview`}
                  className="max-w-full h-auto max-h-96 mx-auto"
                />
              </div>
            </div>
          )}

          {/* Download button if file URL is available */}
          {blueprint.file_url && (
            <div className="pt-4">
              <Button asChild variant="outline">
                <a href={blueprint.file_url} download={`${blueprint.name}.svg`}>
                  <Download className="h-4 w-4 mr-2" />
                  {t('common.download')}
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}