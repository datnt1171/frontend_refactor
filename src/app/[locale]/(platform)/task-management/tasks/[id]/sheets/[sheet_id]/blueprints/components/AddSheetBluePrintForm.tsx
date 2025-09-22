'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPlus, Loader2 } from 'lucide-react'
import { createSheetBlueprint } from '@/lib/api/client/api'
import { useTranslations } from 'next-intl'
import type { Blueprint } from '@/types'


interface SheetBlueprintCreateButtonProps {
  TaskId: string
  SheetId: string
  Blueprints: Blueprint[]
}

export default function SheetBlueprintCreateButton({ TaskId, SheetId, Blueprints }: SheetBlueprintCreateButtonProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations()

  const router = useRouter()

  const resetForm = () => {
    const form = document.getElementById('sheet-blueprint-form') as HTMLFormElement
    if (form) form.reset()
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget)
    const blueprintId = formData.get('blueprint_id') as string
    
    if (!blueprintId) {
      alert(t('common.noFileProvided'))
      return
    }

    setIsLoading(true)

    const sheetBlueprintData = {
      finishing_sheet: SheetId,
      blueprint: blueprintId,
      description: formData.get('description') as string || ""
    }

    try {
      await createSheetBlueprint(TaskId, SheetId, sheetBlueprintData)
      setOpen(false)
      resetForm()
      router.refresh()
      alert(t('common.actionPerformedSuccessfully'))
    } catch (error) {
      alert(t('common.failedToPerformAction'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <MapPlus className="mr-2 h-4 w-4" />
          {t('blueprint.add')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('blueprint.add')}</DialogTitle>
        </DialogHeader>
        
        <form id="sheet-blueprint-form" onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Sheet ID (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="finishing_sheet">{t('sample.finishingCode')}</Label>
            <Input 
              id="finishing_sheet" 
              value={SheetId} 
              disabled 
              className="bg-gray-50"
            />
          </div>

          {/* Blueprint Selection */}
          <div className="space-y-2">
            <Label htmlFor="blueprint_id">{t('blueprint.blueprint')} <span className="text-red-500">*</span></Label>
            <Select name="blueprint_id" required disabled={isLoading}>
              <SelectTrigger>
                <SelectValue placeholder={t('blueprint.name')} />
              </SelectTrigger>
              <SelectContent>
                {Blueprints.map((blueprint) => (
                  <SelectItem key={blueprint.id} value={blueprint.id}>
                    {blueprint.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="description">{t('common.description')}</Label>
            <Textarea 
              id="description"
              name="description"
              rows={3}
              placeholder={t('common.description')}
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
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.processing')}
                </>
              ) : (
                t('common.save')
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}