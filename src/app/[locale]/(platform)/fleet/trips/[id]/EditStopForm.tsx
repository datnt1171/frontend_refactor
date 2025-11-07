'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pencil } from 'lucide-react'
import type { Stop } from '@/types'
import { updateStop } from '@/lib/api/client/fleet'


interface EditStopFormProps {
  stop: Stop
  prevStopOdometer: number
}

export function EditStopForm({
  stop,
  prevStopOdometer,
}: EditStopFormProps) {
  const router = useRouter()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    location: stop.location,
    odometer: stop.odometer.toString(),
    toll_station: stop.toll_station || '',
  })

  const handleEdit = () => {
    setFormData({
      location: stop.location,
      odometer: stop.odometer.toString(),
      toll_station: stop.toll_station || '',
    })
    setIsEditOpen(true)
  }

  const handleUpdate = async () => {
    const odometer = Number(formData.odometer)
    
    if (!formData.location) {
      alert('Location is required')
      return
    }
    
    if (!formData.odometer) {
      alert('Odometer is required')
      return
    }
    
    if (prevStopOdometer > 0 && odometer <= prevStopOdometer) {
      alert(`Odometer must be greater than ${prevStopOdometer}`)
      return
    }

    setIsSubmitting(true)
    try {
      await updateStop(stop.id, {
        location: formData.location,
        odometer,
        toll_station: formData.toll_station || undefined,
      })
      setIsEditOpen(false)
      alert('Stop updated successfully')
      router.refresh()
    } catch (error) {
      alert('Failed to update stop')
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
        onClick={handleEdit}
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Stop</DialogTitle>
            <DialogDescription>
              Update stop information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location *</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-odometer">
                Odometer (km) * {prevStopOdometer > 0 && `(must be > ${prevStopOdometer})`}
              </Label>
              <Input
                id="edit-odometer"
                type="number"
                value={formData.odometer}
                onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-toll">Toll Station</Label>
              <Input
                id="edit-toll"
                value={formData.toll_station}
                onChange={(e) => setFormData({ ...formData, toll_station: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}