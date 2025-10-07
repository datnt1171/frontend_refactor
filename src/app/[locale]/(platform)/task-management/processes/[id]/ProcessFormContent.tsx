"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Eye } from "lucide-react"
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import type { ProcessDetail, UserList, Factory, Retailer, UserDetail } from "@/types"
import { FormField } from "./FormField"
import { getVisibleFields } from "@/lib/utils/field"

interface ProcessFormContentProps {
  process: ProcessDetail
  users: UserList[]
  factories: Factory[]
  retailers: Retailer[]
  formValues: Record<string, any>
  currentUser: UserDetail
  onInputChange: (fieldId: string, value: any) => void
  onReview: (e: React.FormEvent) => void
}

export function ProcessFormContent({
  process,
  users,
  factories,
  retailers,
  formValues,
  currentUser,
  onInputChange,
  onReview
}: ProcessFormContentProps) {
  const t = useTranslations('taskManagement.createTask')
  
  // Memoize visible fields to prevent unnecessary re-renders
  const visibleFields = useMemo(() => {
    return getVisibleFields(process.fields, formValues, currentUser.department.name)
  }, [process.fields, formValues])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('createTask')}</CardTitle>
      </CardHeader>
      <form onSubmit={onReview}>
        <CardContent className="space-y-4">
          {visibleFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={`field-${field.id}`}>
                {field.name}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {field.description && (
                <p className="text-sm text-muted-foreground">{field.description}</p>
              )}
              <FormField
                field={field}
                users={users}
                factories={factories}
                retailers={retailers}
                value={formValues[field.id]}
                onChange={(value) => onInputChange(field.id, value)}
                disabled={false}
              />
            </div>
          ))}
        </CardContent>
        <CardFooter className="pt-4">
          <Button type="submit">
            <Eye className="mr-2 h-4 w-4" />
            {t('review')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}