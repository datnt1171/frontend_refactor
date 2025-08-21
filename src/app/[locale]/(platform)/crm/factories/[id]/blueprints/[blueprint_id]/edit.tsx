// app/crm/blueprints/[blueprint_id]/edit.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { updateBlueprint, BlueprintUpdate } from '@/lib/api/client/api'
import { Blueprint } from '@/lib/api/server/blueprints'

interface EditBlueprintPageProps {
  blueprint: Blueprint
  blueprintId: string
}

export default function EditBlueprintPage({ blueprint, blueprintId }: EditBlueprintPageProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<BlueprintUpdate>({
    name: blueprint.name,
    type: blueprint.type,
    description: blueprint.description || '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    // Check if form has changes
    const changed = 
      formData.name !== blueprint.name ||
      formData.type !== blueprint.type ||
      formData.description !== (blueprint.description || '')
    
    setHasChanges(changed)
  }, [formData, blueprint])

  const handleInputChange = (field: keyof BlueprintUpdate, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name || !formData.type) {
      setError('Name and type are required')
      return
    }

    if (!hasChanges) {
      setError('No changes to save')
      return
    }

    setIsSubmitting(true)

    try {
      // Only send changed fields
      const updateData: BlueprintUpdate = {}
      if (formData.name !== blueprint.name) updateData.name = formData.name
      if (formData.type !== blueprint.type) updateData.type = formData.type
      if (formData.description !== (blueprint.description || '')) updateData.description = formData.description

      const result = await updateBlueprint(blueprintId, updateData)

      if (result.success) {
        router.push(`/crm/blueprints/${blueprintId}`)
      } else {
        setError(result.error || 'Failed to update blueprint')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setFormData({
      name: blueprint.name,
      type: blueprint.type,
      description: blueprint.description || '',
    })
    setError(null)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/crm/blueprints/${blueprintId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blueprint
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Blueprint</h1>
          <p className="text-muted-foreground">Update blueprint information</p>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Blueprint Details</CardTitle>
          <CardDescription>
            Update the blueprint information (file cannot be changed)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="factory">Factory Code</Label>
              <Input
                id="factory"
                value={blueprint.factory}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">Factory cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Blueprint Name *</Label>
              <Input
                id="name"
                placeholder="Enter blueprint name"
                value={formData.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Production Line Type *</Label>
              <Select
                value={formData.type || ''}
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select production line type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PALLET">Pallet</SelectItem>
                  <SelectItem value="HANGING">Hanging</SelectItem>
                  <SelectItem value="ROLLER">Roller</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter blueprint description (optional)"
                rows={3}
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Current File</Label>
              <div className="border rounded-lg p-4 bg-muted/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{blueprint.filename}</p>
                    <p className="text-sm text-muted-foreground">
                      {(blueprint.file_size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <div className="text-muted-foreground">📄</div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  File cannot be changed. Create a new blueprint to upload a different file.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting || !hasChanges} className="flex-1">
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleReset}
                disabled={!hasChanges}
              >
                Reset
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href={`/crm/blueprints/${blueprintId}`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}