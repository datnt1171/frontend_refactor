"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from 'next-intl'
import { createTask } from "@/lib/api"
import type { ProcessDetail, UserList } from "@/types/api"
import { ProcessFormHeader } from "./ProcessFormHeader"
import { ProcessFormContent } from "./ProcessFormContent"
import { FormReview } from "./FormReview"

interface ProcessFormClientProps {
  process: ProcessDetail
  users: UserList[]
}

export function ProcessFormClient({ 
  process, 
  users
}: ProcessFormClientProps) {
  const router = useRouter()
  const t = useTranslations('taskManagement.createTask')
  
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [showReview, setShowReview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  const validateForm = () => {
    const missingFields = process.fields
      .filter(field => field.required && !formValues[field.id])
      .map(field => field.name)
    
    if (missingFields.length) {
      alert(t('pleaseFillRequiredFields', { 
        fields: missingFields.join(", ") 
      }))
      return false
    }
    return true
  }

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setShowReview(true)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("process", String(process.id))

      process.fields.forEach((field, index) => {
        formData.append(`fields[${index}][field_id]`, String(field.id))

        const value = formValues[field.id]

        if (field.field_type === "file" && value instanceof File) {
          console.log(`Appending file for field ${field.id}:`, {
            name: value.name,
            type: value.type,
            size: value.size
          })
          formData.append(`fields[${index}][file]`, value)
        } else {
          console.log(`Appending value for field ${field.id}:`, value)
          formData.append(`fields[${index}][value]`, value ?? "")
        }
      })

      await createTask(formData)
      alert(t('taskCreatedSuccessfully'))
      router.push("/task-management/tasks/sent")
    } catch (err: any) {
      console.error("Error creating task:", err.response?.data || err.message)
      alert(err.response?.data?.error || t('failedToCreateTask'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <ProcessFormHeader processName={process.name} />
      
      {showReview ? (
        <FormReview
          process={process}
          users={users}
          formValues={formValues}
          isSubmitting={isSubmitting}
          onBack={() => setShowReview(false)}
          onSubmit={handleSubmit}
        />
      ) : (
        <ProcessFormContent
          process={process}
          users={users}
          formValues={formValues}
          onInputChange={handleInputChange}
          onReview={handleReview}
        />
      )}
    </div>
  )
}