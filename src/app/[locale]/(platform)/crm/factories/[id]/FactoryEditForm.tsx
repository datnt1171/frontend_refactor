'use client'

import { useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { updateFactory } from '@/lib/api/client/api'
import type { FactoryDetail, FactoryUpdate } from '@/types'
import { useRouter } from '@/i18n/navigation'

interface FactoryEditFormProps {
  factory: FactoryDetail
  translations: {
    factoryId: string
    factoryName: string
    status: string
    onsite: string
    active: string
    inactive: string
    yes: string
    no: string
    edit: string
    save: string
    cancel: string
    processing: string,
    failedToLoadTaskDetails: string,
    actionPerformedSuccessfully: string
  }
}

export function FactoryEditForm({ factory, translations }: FactoryEditFormProps) {
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
      alert(translations.actionPerformedSuccessfully)
      setIsOpen(false)
      
    } catch (err: any) {
      console.error("Error performing action:", err)
      alert(err.response?.data?.error || translations.failedToLoadTaskDetails)
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
            {translations.factoryId}
          </label>
          <p className="mt-1">{factory.factory_code}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            {translations.factoryName}
          </label>
          <p className="mt-1">{factory.factory_name}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            {translations.status}
          </label>
          <div className="mt-1">
            <Badge variant={factory.is_active ? "default" : "destructive"}>
              {factory.is_active ? translations.active : translations.inactive}
            </Badge>
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium text-muted-foreground">
            {translations.onsite}
          </label>
          <div className="mt-1">
            <Badge variant={factory.has_onsite ? "secondary" : "outline"}>
              {factory.has_onsite ? translations.yes : translations.no}
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Edit button and modal */}
      <div className="flex space-x-2 mt-6">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              {translations.edit}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Factory</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {translations.factoryId}
                </label>
                <p className="mt-1 text-muted-foreground">{factory.factory_code}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {translations.factoryName}
                </label>
                <p className="mt-1 text-muted-foreground">{factory.factory_name}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {translations.status}
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
                            {translations.active}
                          </Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="false">
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive" className="text-xs">
                            {translations.inactive}
                          </Badge>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {translations.onsite}
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
                          <Badge variant="secondary" className="text-xs">
                            {translations.yes}
                          </Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="false">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {translations.no}
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
                {isLoading ? translations.processing : translations.save}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1"
              >
                {translations.cancel}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}