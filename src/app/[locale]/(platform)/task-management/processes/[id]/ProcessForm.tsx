"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { useTranslations } from 'next-intl'
import { createTask } from "@/lib/api/client/api"
import type { ProcessDetail, UserList, Factory, Retailer, UserDetail } from "@/types"
import { ProcessFormHeader } from "./ProcessFormHeader"
import { ProcessFormContent } from "./ProcessFormContent"
import { FormReview } from "./FormReview"
import { getVisibleFields } from "@/lib/utils/field"

interface ProcessFormClientProps {
  process: ProcessDetail
  users: UserList[]
  factories: Factory[]
  retailers: Retailer[]
  currentUser: UserDetail
}

export function ProcessFormClient({ 
  process, 
  users,
  factories,
  retailers,
  currentUser
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
    // Get only visible fields based on current form values
    const visibleFields = getVisibleFields(process.fields, formValues, currentUser.department.name)
    
    // Check only visible required fields
    const missingFields = visibleFields
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

      // Handle both "file" and "multifile" types uniformly
      if ((field.field_type === "file" || field.field_type === "multifile") && value) {
        // Always treat as array
        const filesArray = Array.isArray(value) ? value : [value]
        
        filesArray.forEach((file) => {
          if (file instanceof File) {
            // Send all files with same key (backend will use getlist())
            formData.append(`fields[${index}][files]`, file)
          }
        })
      } else {
        formData.append(`fields[${index}][value]`, value ?? "")
      }
    })

    const response = await createTask(formData)
    
    if (response.success) {
      alert(t('taskCreatedSuccessfully'))
      router.push("/task-management/tasks/sent")
    } else {
      throw new Error(response.error)
    }
  } catch (err: any) {
    console.error("Error creating task:", err)
    alert(err.message || t('failedToCreateTask'))
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
          factories={factories}
          retailers={retailers}
          formValues={formValues}
          isSubmitting={isSubmitting}
          onBack={() => setShowReview(false)}
          onSubmit={handleSubmit}
        />
      ) : (
        <ProcessFormContent
          process={process}
          users={users}
          factories={factories}
          retailers={retailers}
          formValues={formValues}
          currentUser={currentUser}
          onInputChange={handleInputChange}
          onReview={handleReview}
        />
      )}
    </div>
  )
}