import { getBlueprints } from '@/lib/api/server/blueprints'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText } from 'lucide-react'
import BlueprintCreateButton from './components/AddBluePrintForm'

export default async function BlueprintsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const blueprints = await getBlueprints(id)

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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{id}'s Blueprints</h1>
        </div>
        
        <BlueprintCreateButton factoryId={id} />
      </div>

      {blueprints.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No blueprints found</h3>
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
                    <span>Factory:</span>
                    <span className="font-medium">{blueprint.factory}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>File:</span>
                    <span className="font-medium">{blueprint.filename}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span className="font-medium">{formatFileSize(blueprint.file_size)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span className="font-medium">
                      {new Date(blueprint.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex">
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`/crm/factories/${id}/blueprints/${blueprint.id}`}>
                      View
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