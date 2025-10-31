'use client'

import { useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { updateFactory } from '@/lib/api/client/api'
import type { FactoryDetail, FactoryUpdate } from '@/types'
import { useRouter } from '@/i18n/navigation'
import { StatusBadge } from "@/components/ui/StatusBadge"
import { OnsiteBadge } from "@/components/ui/OnsiteBadge"
import { useTranslations } from 'next-intl'

interface FactoryEditFormProps {
  factory: FactoryDetail
}

export function FactoryEditForm({ factory }: FactoryEditFormProps) {
  const t = useTranslations()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    is_active: factory.is_active,
    has_onsite: factory.has_onsite
  })

  const router = useRouter()
  
  const handleCancel = () => {
    setIsOpen(false)
    setFormData({
      is_active: factory.is_active,
      has_onsite: factory.has_onsite
    })
  }

  const handleSave = async () => {
    setIsLoading(true)
    
    try {
      const updateData: FactoryUpdate = {
        is_active: formData.is_active,
        has_onsite: formData.has_onsite
      }

      await updateFactory(factory.factory_code, updateData)
      alert(t('taskManagement.taskDetail.actionPerformedSuccessfully'))
      setIsOpen(false)
      
    } catch (err: any) {
      console.error("Error performing action:", err)
      alert(err.response?.data?.error || t('taskManagement.taskDetail.failedToPerformAction'))
    } finally {
      setIsLoading(false)
      router.push(`/crm/factories/${factory.factory_code}`)
    }
  }

  const handleIsActiveChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      is_active: value === 'true'
    }))
  }

  const handleHasOnsiteChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      has_onsite: value === 'true'
    }))
  }

  return (
    <>
      {/* Display section */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            {t('crm.factories.factoryId')}
          </label>
          <p className="mt-1">{factory.factory_code}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            {t('crm.factories.factoryName')}
          </label>
          <p className="mt-1">{factory.factory_name}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            {t('crm.factories.status')}
          </label>
          <div className="mt-1">
            <StatusBadge 
              isActive={factory.is_active} 
              activeText={t('filter.active')}
              inactiveText={t('filter.inactive')}
            />
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            {t('crm.factories.onsite')}
          </label>
          <div className="mt-1">
            <OnsiteBadge 
              hasOnsite={factory.has_onsite}
              yesText={t('common.yes')}
              noText={t('common.no')}
            />
          </div>
        </div>
      </div>
      
      {/* Edit button and modal */}
      <div className="flex space-x-2 mt-6">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              {t('common.edit')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{t('common.edit')}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('crm.factories.factoryId')}
                </label>
                <p className="mt-1 text-muted-foreground">{factory.factory_code}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('crm.factories.factoryName')}
                </label>
                <p className="mt-1 text-muted-foreground">{factory.factory_name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('crm.factories.status')}
                </label>
                <div className="mt-1">
                  <Select 
                    value={formData.is_active.toString()} 
                    onValueChange={handleIsActiveChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className="text-xs">
                            {t('common.active')}
                          </Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="false">
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive" className="text-xs">
                            {t('common.inactive')}
                          </Badge>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {t('crm.factories.onsite')}
                </label>
                <div className="mt-1">
                  <Select 
                    value={formData.has_onsite.toString()} 
                    onValueChange={handleHasOnsiteChange}
                    disabled={isLoading}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className="text-xs">
                            {t('common.yes')}
                          </Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="false">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {t('common.no')}
                          </Badge>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleSave} 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? t('common.processing') : t('common.save')}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1"
              >
                {t('common.cancel')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}