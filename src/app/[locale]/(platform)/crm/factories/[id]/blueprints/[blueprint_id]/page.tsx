// app/crm/blueprints/[blueprint_id]/page.tsx
import { getBlueprint } from '@/lib/api/server/blueprints'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Download, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { DeleteBlueprintButton } from './delete-button'

interface BlueprintDetailPageProps {
  params: {
    blueprint_id: string
  }
}

export default async function BlueprintDetailPage({ params }: BlueprintDetailPageProps) {
  const blueprint = await getBlueprint(params.blueprint_id)

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
        <Button variant="ghost" size="sm" asChild>
          <Link href="/crm/blueprints">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blueprints
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{blueprint.name}</h1>
          <p className="text-muted-foreground">Blueprint Details</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/crm/blueprints/${blueprint.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <DeleteBlueprintButton blueprintId={blueprint.id} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Blueprint Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
              <CardDescription>Blueprint details and metadata</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                <p className="text-sm font-medium">{blueprint.name}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Factory</Label>
                <p className="text-sm font-medium">{blueprint.factory}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                <div className="mt-1">
                  <Badge className={getTypeColor(blueprint.type)}>
                    {blueprint.type}
                  </Badge>
                </div>
              </div>
              
              {blueprint.description && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                  <p className="text-sm">{blueprint.description}</p>
                </div>
              )}
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Filename</Label>
                <p className="text-sm font-medium">{blueprint.filename}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">File Size</Label>
                <p className="text-sm">{formatFileSize(blueprint.file_size)}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                <p className="text-sm">{new Date(blueprint.created_at).toLocaleString()}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                <p className="text-sm">{new Date(blueprint.updated_at).toLocaleString()}</p>
              </div>

              <Button className="w-full mt-4" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download SVG
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* SVG Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>SVG blueprint preview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-muted/50 min-h-96 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <div className="text-6xl mb-4">📐</div>
                  <p>SVG preview will be displayed here</p>
                  <p className="text-sm mt-2">File: {blueprint.filename}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}