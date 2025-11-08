'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Pencil } from 'lucide-react'
import type { Stop } from '@/types'
import { updateStop } from '@/lib/api/client/fleet'
import ReactSelect from 'react-select';
import { useTranslations } from 'next-intl'


interface EditStopFormProps {
  stop: Stop
  prevStopOdometer: number
  factoryOptions: Array<{ value: string; label: string }>;
}

export function EditStopForm({
  stop,
  prevStopOdometer,
  factoryOptions,
}: EditStopFormProps) {

  const t = useTranslations()
  const router = useRouter()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Check if stop.location is a custom location (not in factoryOptions)
  const isCustomLocation = !factoryOptions.some(option => option.value === stop.location)
  
  const [formData, setFormData] = useState({
    location: isCustomLocation ? '99999' : stop.location,
    customLocation: isCustomLocation ? stop.location : '',
    odometer: stop.odometer.toString(),
    toll_station: stop.toll_station || '',
  })

  const handleEdit = () => {
    const isCustom = !factoryOptions.some(option => option.value === stop.location)
    setFormData({
      location: isCustom ? '99999' : stop.location,
      customLocation: isCustom ? stop.location : '',
      odometer: stop.odometer.toString(),
      toll_station: stop.toll_station || '',
    })
    setIsEditOpen(true)
  }

  const handleUpdate = async () => {
    const odometer = Number(formData.odometer)
    
    // Determine the final location value
    const finalLocation = formData.location === '99999' 
      ? formData.customLocation 
      : formData.location
    
    if (!finalLocation) {
      alert('Location is required')
      return
    }
    
    if (!formData.odometer) {
      alert('Odometer is required')
      return
    }
    
    if (prevStopOdometer > 0 && odometer <= prevStopOdometer) {
      alert(`Odo > ${prevStopOdometer}`)
      return
    }

    setIsSubmitting(true)
    try {
      await updateStop(stop.id, {
        location: finalLocation,
        odometer,
        toll_station: formData.toll_station || undefined,
      })
      setIsEditOpen(false)
      alert(t('common.EditSuccessfully'))
      router.refresh()
    } catch (error) {
      alert(t('common.EditFailed'))
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
            <DialogTitle>{t('common.edit')} {t('fleet.stop.stop')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-location">
                {t('filter.selectLocation')} <span className="text-red-500">*</span>
              </Label>
              <ReactSelect
                options={factoryOptions}
                value={factoryOptions.find(option => option.value === formData.location) || null}
                onChange={(selectedOption) => {
                  const newValue = selectedOption?.value || ''
                  setFormData({ ...formData, location: newValue, customLocation: '' })
                }}
                placeholder={t('filter.searchLocationHolder')}
                noOptionsMessage={() => t('common.noData')}
                isDisabled={false}
                isSearchable={true}
                isClearable={true}
              />
              
              {/* Show input field when "Other" option (99999) is selected */}
              {formData.location === '99999' && (
                <div className="mt-2">
                  <Label htmlFor="custom-location">
                    {t('filter.otherLocation')} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="custom-location"
                    value={formData.customLocation}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      customLocation: e.target.value 
                    })}
                    placeholder={t('filter.otherLocationHolder')}
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-odometer">
                {t('fleet.stop.odometer')} (km) 
                <span className="text-red-500">*</span>
                {prevStopOdometer > 0 && ` > ${prevStopOdometer}`}
              </Label>
              <Input
                id="edit-odometer"
                type="number"
                value={formData.odometer}
                onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-toll">{t('fleet.stop.tollStation')}</Label>
              <Input
                id="edit-toll"
                value={formData.toll_station}
                onChange={(e) => setFormData({ ...formData, toll_station: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleUpdate} disabled={isSubmitting}>
              {isSubmitting ? t('common.processing') : t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}