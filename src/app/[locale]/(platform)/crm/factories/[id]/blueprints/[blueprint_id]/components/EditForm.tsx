'use client'

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Edit, Loader2 } from 'lucide-react'
import { updateBlueprint } from '@/lib/api/client/api'
import { useTranslations } from 'next-intl'
import type { ProductionLineType } from '@/types'

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
  const router = useRouter()
  const t = useTranslations()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const blueprintData = {
      name: formData.get('name') as string,
      type: formData.get('type') as ProductionLineType,
      description: formData.get('description') as string || null,
    }

    try {
      await updateBlueprint(factoryId, blueprintId, blueprintData)
      alert(t('common.actionPerformedSuccessfully'))
      setOpen(false)
    } catch (error) {
      alert(t('common.failedToPerformAction'))
    } finally {
      setIsLoading(false)
      setOpen(false)
      router.push(`/crm/factories/${factoryId}/blueprints/${blueprintId}`)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit className="h-4 w-4 mr-2" />
          {t('common.edit')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('common.edit')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">{t('blueprint.name')} <span className="text-red-500">*</span></Label>
            <Input 
              id="name" 
              name="name"
              defaultValue={blueprint.name}
              required
              disabled={isLoading}
            />
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label htmlFor="type">{t('blueprint.type')} <span className="text-red-500">*</span></Label>
            <Select name="type" required disabled={isLoading} defaultValue={blueprint.type}>
              <SelectTrigger>
                <SelectValue placeholder="Select blueprint type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PALLET">{t('blueprint.pallet')}</SelectItem>
                <SelectItem value="HANGING">{t('blueprint.hanging')}</SelectItem>
                <SelectItem value="ROLLER">{t('blueprint.roller')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">{t('common.description')}</Label>
            <Textarea 
              id="description"
              name="description"
              defaultValue={blueprint.description || ''}
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