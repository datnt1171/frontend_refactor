'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Upload, X, FileText, Loader2 } from 'lucide-react'
import { createBlueprint } from '@/lib/api/client/api'

interface BlueprintCreateButtonProps {
  factoryId: string
}

export default function BlueprintCreateButton({ factoryId }: BlueprintCreateButtonProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (file.type !== 'image/svg+xml') {
        
        return
      }
      
      // Validate file size (10MB limit)
      if (file.size > 100 * 1024 * 1024) {
        
        return
      }
      
      setSelectedFile(file)
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
    const fileInput = document.getElementById('file') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const resetForm = () => {
    const form = document.getElementById('blueprint-form') as HTMLFormElement
    if (form) form.reset()
    setSelectedFile(null)
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!selectedFile) {
      
      return
    }

    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const blueprintData = {
      factory: factoryId,
      name: formData.get('name') as string,
      type: formData.get('type') as "PALLET" | "HANGING" | "ROLLER",
      description: formData.get('description') as string || null,
      file: selectedFile
    }

    try {
      const result = await createBlueprint(factoryId, blueprintData)
      console.log(result)
      if (result) {
        
        setOpen(false)
        resetForm()
        router.push(`/crm/factories/${factoryId}/blueprints/`)
      } else {
        
      }
    } catch (error) {
      
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Blueprint
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Blueprint</DialogTitle>
        </DialogHeader>
        
        <form id="blueprint-form" onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Factory (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="factory">Factory</Label>
            <Input 
              id="factory" 
              value={factoryId} 
              disabled 
              className="bg-gray-50"
            />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
            <Input 
              id="name" 
              name="name"
              placeholder="Enter blueprint name"
              required
              disabled={isLoading}
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Type <span className="text-red-500">*</span></Label>
            <Select name="type" required disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder="Select blueprint type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PALLET">Pallet</SelectItem>
                <SelectItem value="HANGING">Hanging</SelectItem>
                <SelectItem value="ROLLER">Roller</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              name="description"
              placeholder="Optional description"
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* SVG File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">SVG File <span className="text-red-500">*</span></Label>
            
            {!selectedFile ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="text-sm text-gray-600 mb-2">
                  Drop your SVG file here, or{' '}
                  <label htmlFor="file" className="text-blue-600 hover:text-blue-500 cursor-pointer font-medium">
                    browse
                  </label>
                </div>
                <p className="text-xs text-gray-500">SVG files only, max 100MB</p>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept=".svg,image/svg+xml"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isLoading}
                />
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearFile}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Blueprint'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}