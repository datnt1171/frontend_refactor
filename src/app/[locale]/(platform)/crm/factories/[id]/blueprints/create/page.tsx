// app/crm/factories/[id]/blueprints/create.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Upload, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { createBlueprint } from '@/lib/api/client/api'

interface CreateBlueprintPageProps {
  factoryId: string
  factoryName?: string
}

export default function CreateBlueprintPage({ factoryId, factoryName }: CreateBlueprintPageProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError(null)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.name.toLowerCase().endsWith('.svg')) {
        setError('Please select an SVG file')
        return
      }
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!formData.name || !formData.type || !file) {
      setError('Please fill in all required fields and select a file')
      return
    }

    setIsSubmitting(true)

    try {
      const blueprintData = {
        factory : factoryId,
        name: formData.name,
        type: formData.type,
        description: formData.description,
        file: file,
      }

      const result = await createBlueprint(blueprintData)

      if (result.success) {
        router.push(`/crm/factories/${factoryId}/blueprints`)
      } else {
        setError(result.error || 'Failed to create blueprint')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/crm/factories/${factoryId}/blueprints`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blueprints
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Blueprint</h1>
          <p className="text-muted-foreground">
            Upload a new production line blueprint for {factoryName || factoryId}
          </p>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Blueprint Details</CardTitle>
          <CardDescription>
            Fill in the blueprint information and upload the SVG file
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
              <Label htmlFor="factory">Factory</Label>
              <Input
                id="factory"
                value={factoryName || factoryId}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Blueprint Name *</Label>
              <Input
                id="name"
                placeholder="Enter blueprint name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Production Line Type *</Label>
              <Select
                value={formData.type}
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
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">SVG File *</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <div className="space-y-2">
                    <Label htmlFor="file" className="cursor-pointer">
                      <span className="text-sm font-medium text-primary hover:underline">
                        Click to upload SVG file
                      </span>
                      <Input
                        id="file"
                        type="file"
                        accept=".svg"
                        className="hidden"
                        onChange={handleFileChange}
                        required
                      />
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      SVG files only
                    </p>
                    {file && (
                      <p className="text-sm font-medium text-green-600">
                        Selected: {file.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? 'Creating...' : 'Create Blueprint'}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href={`/crm/factories/${factoryId}/blueprints`}>Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}