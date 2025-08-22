'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteBlueprint } from '@/lib/api/client/api'
// import { useToast } from '@/hooks/use-toast'

interface BlueprintDeleteButtonProps {
  factoryId: string
  blueprintId: string
  blueprintName: string
}

export default function BlueprintDeleteButton({ 
  factoryId, 
  blueprintId, 
  blueprintName 
}: BlueprintDeleteButtonProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
//   const { toast } = useToast()
  const router = useRouter()

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      const result = await deleteBlueprint(factoryId, blueprintId)
      
      if (result.success) {
        // toast({
        //   title: "Success",
        //   description: "Blueprint deleted successfully!",
        // })
        setOpen(false)
        // Navigate back to blueprints list after successful deletion
      } else {
        // toast({
        //   title: "Error",
        //   description: result.error || "Failed to delete blueprint",
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
      router.push(`/crm/factories/${factoryId}/blueprints/`)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the blueprint{' '}
            <span className="font-semibold">"{blueprintName}"</span> and remove all associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Blueprint'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}