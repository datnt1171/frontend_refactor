'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Trash2 } from 'lucide-react'

import { deleteStop } from '@/lib/api/client/fleet'

interface DeleteStopButtonProps {
  stopId: string
}

export function DeleteStopButton({ stopId }: DeleteStopButtonProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDelete = async () => {
    setIsSubmitting(true)
    try {
      await deleteStop(stopId)
      setIsOpen(false)
      alert('Stop deleted successfully')
      router.refresh()
    } catch (error) {
      alert('Failed to delete stop')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8"
        onClick={() => setIsOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Stop</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this stop? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}