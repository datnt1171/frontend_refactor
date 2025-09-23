'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Trash2, Loader2 } from 'lucide-react'
import { deleteFinishingSheet } from '@/lib/api/client/api'
import { useTranslations } from 'next-intl'

interface BlueprintDeleteButtonProps {
  taskId: string
  sheetId: string
  finishingCode: string
}

export default function DeleteFinishingButton({ 
  taskId, 
  sheetId, 
  finishingCode 
}: BlueprintDeleteButtonProps) {
  const commonT = useTranslations('common')
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      await deleteFinishingSheet(taskId, sheetId)
      alert(commonT('actionPerformedSuccessfully'))
    } catch (error) {
      alert(commonT('failedToPerformAction'))
    } finally {
      setIsLoading(false)
      router.push(`/task-management/tasks/${taskId}/sheets`)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          {commonT('delete')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{commonT('deleteAlertTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {commonT('deleteAlertDescription', { name: finishingCode })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>{commonT('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {commonT('processing')}
              </>
            ) : (
              commonT('delete')
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}