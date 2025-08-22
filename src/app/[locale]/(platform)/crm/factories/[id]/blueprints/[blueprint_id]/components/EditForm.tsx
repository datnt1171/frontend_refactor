'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Edit, Loader2 } from 'lucide-react'
import { updateBlueprint } from '@/lib/api/client/api'
// import { useToast } from '@/hooks/use-toast'

interface BlueprintEditButtonProps {
  factoryId: string
  blueprintId: string
  blueprint: {
    name: string
    type: string
    description?: string | null
  }
}

export default function BlueprintEditButton({ 
  factoryId, 
  blueprintId, 
  blueprint 
}: BlueprintEditButtonProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
//   const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const blueprintData = {
      name: formData.get('name') as string,
      type: formData.get('type') as "PALLET" | "HANGING" | "ROLLER" | null,
      description: formData.get('description') as string || null,
    }

    try {
      const result = await updateBlueprint(factoryId, blueprintId, blueprintData)
      
      if (result.success) {
        // toast({
        //   title: "Success",
        //   description: "Blueprint updated successfully!",
        // })
        setOpen(false)
        router.refresh() // Refresh the server component data
      } else {
        // toast({
        //   title: "Error",
        //   description: result.error || "Failed to update blueprint",
        //   variant: "destructive"
        // })
      }
    } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: "An unexpected error occurred",
    //     variant: "destructive"
    //   })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Blueprint</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name <span className="text-red-500">*</span></Label>
            <Input 
              id="name" 
              name="name"
              defaultValue={blueprint.name}
              placeholder="Enter blueprint name"
              required
              disabled={isLoading}
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Type <span className="text-red-500">*</span></Label>
            <Select name="type" required disabled={isLoading} defaultValue={blueprint.type}>
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
              defaultValue={blueprint.description || ''}
              placeholder="Optional description"
              rows={3}
              disabled={isLoading}
            />
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
                  Updating...
                </>
              ) : (
                'Update Blueprint'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}