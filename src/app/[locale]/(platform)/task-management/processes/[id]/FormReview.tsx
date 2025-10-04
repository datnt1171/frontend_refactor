"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Send, Loader2 } from "lucide-react"
import { useTranslations } from 'next-intl'
import type { ProcessDetail, UserList, ProcessField, Factory, Retailer } from "@/types"

interface FormReviewProps {
  process: ProcessDetail
  users: UserList[]
  factories: Factory[]
  retailers: Retailer[]
  formValues: Record<string, any>
  isSubmitting: boolean
  onBack: () => void
  onSubmit: () => void
}

export function FormReview({
  process,
  users,
  factories,
  retailers,
  formValues,
  isSubmitting,
  onBack,
  onSubmit
}: FormReviewProps) {
  const t = useTranslations('taskManagement.createTask')

  const displayFieldValue = (field: ProcessField) => {
    const value = formValues[field.id]
    
    if (!value) {
      return (
        <span className="text-muted-foreground italic">
          {t('noValueProvided')}
        </span>
      )
    }
    
    if (field.field_type === "assignee") {
      const user = users.find(u => u.id.toString() === value)
      return user ? `${user.last_name} ${user.first_name} (${user.username})` : value
    }

    if (field.field_type === "factory") {
      const factory = factories.find(u => u.factory_code.toString() === value)
      return factory ? `${factory.factory_name} (${factory.factory_code})` : value
    }

    if (field.field_type === "retailer") {
      const retailer = retailers.find(u => u.id.toString() === value)
      return retailer ? `${retailer.name}` : value
    }
    
    if (field.field_type === "file" || field.field_type === "multifile") {
      const files = Array.isArray(value) ? value : [value]
      
      if (files.length === 1) {
        return `📎 ${files[0].name} (${(files[0].size / 1024).toFixed(2)} KB)`
      }
      
      return (
        <div className="space-y-1">
          {files.map((file, idx) => (
            <div key={idx}>
              📎 {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </div>
          ))}
        </div>
      )
    }
    
    return value
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('reviewTask')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {process.fields.map(field => (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.name}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="p-3 bg-muted rounded-md">
              {displayFieldValue(field)}
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onBack} 
          disabled={isSubmitting}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('backToEdit')}
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('submitting')}
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              {t('submitTask')}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}