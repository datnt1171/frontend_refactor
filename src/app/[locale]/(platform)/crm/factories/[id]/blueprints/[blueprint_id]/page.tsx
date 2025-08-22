import { getBlueprint } from '@/lib/api/server/blueprints'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download } from 'lucide-react'
import { Label } from '@/components/ui/label'
import BackButton from '@/components/ui/BackButton'
import BlueprintEditButton from './components/EditForm'
import BlueprintDeleteButton from './components/DeleteButton'

export default async function BlueprintDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string, blueprint_id: string }> 
}) {
  const { id, blueprint_id } = await params
  const blueprint = await getBlueprint(id, blueprint_id)

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'PALLET': return 'bg-blue-100 text-blue-800'
      case 'HANGING': return 'bg-green-100 text-green-800'
      case 'ROLLER': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <BackButton />
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{blueprint.name}</h1>
          <p className="text-muted-foreground">Blueprint Details</p>
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
              <Label className="text-sm font-medium text-muted-foreground">Factory ID</Label>
              <p className="text-sm">{id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Blueprint ID</Label>
              <p className="text-sm">{blueprint_id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Type</Label>
              <p className="text-sm">{blueprint.type}</p>
            </div>
            {blueprint.file_size && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">File Size</Label>
                <p className="text-sm">{formatFileSize(blueprint.file_size)}</p>
              </div>
            )}
          </div>
          
          {blueprint.description && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Description</Label>
              <p className="text-sm mt-1">{blueprint.description}</p>
            </div>
          )}

          {/* SVG Preview if available */}
          {blueprint.file_path && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Preview</Label>
              <div className="mt-2 border rounded-lg p-4 bg-gray-50">
                <img 
                  src={blueprint.file_path} 
                  alt={`${blueprint.name} preview`}
                  className="max-w-full h-auto max-h-96 mx-auto"
                />
              </div>
            </div>
          )}

          {/* Download button if file URL is available */}
          {blueprint.file_path && (
            <div className="pt-4">
              <Button asChild variant="outline">
                <a href={blueprint.file_path} download={`${blueprint.name}.svg`}>
                  <Download className="h-4 w-4 mr-2" />
                  Download SVG
                </a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}