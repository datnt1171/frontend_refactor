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
import { Plus } from 'lucide-react'
import { createStop } from '@/lib/api/client/fleet'

interface CreateStopFormProps {
  tripId: string
  stopsCount: number
  lastStopOdometer: number
}

export function CreateStopForm({ 
  tripId, 
  stopsCount, 
  lastStopOdometer,
}: CreateStopFormProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    location: '',
    odometer: '',
    toll_station: '',
  })

  const handleSubmit = async () => {
    const odometer = Number(formData.odometer)
    
    if (!formData.location) {
      alert('Location is required')
      return
    }
    
    if (!formData.odometer) {
      alert('Odometer is required')
      return
    }
    
    if (odometer <= lastStopOdometer) {
      alert(`Odometer must be greater than ${lastStopOdometer}`)
      return
    }

    setIsSubmitting(true)
    try {
      await createStop({
        trip: tripId,
        order: stopsCount + 1,
        location: formData.location,
        odometer,
        toll_station: formData.toll_station || '',
      })
      setIsOpen(false)
      setFormData({ location: '', odometer: '', toll_station: '' })
      router.refresh()
      alert('Stop created successfully')
    } catch (error) {
      alert('Failed to create stop')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-full" size="lg">
        <Plus className="h-5 w-5 mr-2" />
        Add Stop
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Stop</DialogTitle>
            <DialogDescription>
              Create a new stop for this trip
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-location">Location *</Label>
              <Input
                id="create-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-odometer">
                Odometer (km) * {lastStopOdometer > 0 && `(must be > ${lastStopOdometer})`}
              </Label>
              <Input
                id="create-odometer"
                type="number"
                value={formData.odometer}
                onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-toll">Toll Station</Label>
              <Input
                id="create-toll"
                value={formData.toll_station}
                onChange={(e) => setFormData({ ...formData, toll_station: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}