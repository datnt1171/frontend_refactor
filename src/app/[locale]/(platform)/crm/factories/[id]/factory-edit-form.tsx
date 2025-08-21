'use client'

import { useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateFactory } from '@/lib/api/client/api'
import type { Factory, FactoryUpdate } from '@/types'

interface FactoryEditFormProps {
  factory: Factory
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
    processing: string
  }
}

export function FactoryEditForm({ factory, translations }: FactoryEditFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    is_active: factory.is_active,
    has_onsite: factory.has_onsite
  })

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
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

      const response = await updateFactory(factory.factory_code, updateData)
      
      if (response.ok) {
        setIsEditing(false)
        // Optionally refresh the page or update local state
        window.location.reload()
      } else {
        throw new Error(response.data?.message || 'Failed to update factory')
      }
    } catch (error) {
      console.error('Error updating factory:', error)
    } finally {
      setIsLoading(false)
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

  if (!isEditing) {
    return (
      <>
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
        
        <div className="flex space-x-2 mt-6">
          <Button onClick={handleEdit}>
            {translations.edit}
          </Button>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="space-y-4">
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
      
      <div className="flex space-x-2 mt-6">
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
        >
          {isLoading ? translations.processing : translations.save}
        </Button>
        <Button 
          variant="outline" 
          onClick={handleCancel}
          disabled={isLoading}
        >
          {translations.cancel}
        </Button>
      </div>
    </>
  )
}