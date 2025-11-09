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
import { Plus } from 'lucide-react'
import { createStop } from '@/lib/api/client/fleet'
import ReactSelect from 'react-select'
import { useTranslations } from 'next-intl'

interface CreateStopFormProps {
  tripId: string
  stopsCount: number
  lastStopOdometer: number
  factoryOptions: Array<{ value: string; label: string }>
}

export function CreateStopForm({ 
  tripId, 
  stopsCount, 
  lastStopOdometer,
  factoryOptions,
}: CreateStopFormProps) {

  const t = useTranslations()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    location: '',
    customLocation: '',
    odometer: '',
    toll_station: '',
  })

  const handleSubmit = async () => {
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
    
    if (odometer <= lastStopOdometer) {
      alert(`Odo > ${lastStopOdometer}`)
      return
    }

    setIsSubmitting(true)
    try {
      await createStop({
        trip: tripId,
        order: stopsCount + 1,
        location: finalLocation,
        odometer,
        toll_station: formData.toll_station || '',
      })

      setIsOpen(false)
      setFormData({ location: '', customLocation: '', odometer: '', toll_station: '' })
      alert(t('common.CreateSuccessfully'))

      router.refresh()
    } catch (error) {
      alert(t('common.CreateFailed'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="w-full" size="lg">
        <Plus className="h-5 w-5 mr-2" />
        {t('fleet.stop.addStop')}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('fleet.stop.addStop')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-location">
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
                noOptionsMessage={() => t('common.noDataFound')}
                isDisabled={false}
                isSearchable={true}
                isClearable={true}
              />
              
              {/* Show input field when "Other" option (99999) is selected */}
              {formData.location === '99999' && (
                <div className="space-y-2">
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
              <Label htmlFor="create-odometer">
                {t('fleet.stop.odometer')} (km) 
                <span className="text-red-500">*</span>
                {lastStopOdometer > 0 && ` > ${lastStopOdometer}`}
              </Label>
              <Input
                id="create-odometer"
                type="number"
                value={formData.odometer}
                onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-toll">{t('fleet.stop.tollStation')}</Label>
              <Input
                id="create-toll"
                value={formData.toll_station}
                onChange={(e) => setFormData({ ...formData, toll_station: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? t('common.processing') : t('fleet.stop.addStop')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}