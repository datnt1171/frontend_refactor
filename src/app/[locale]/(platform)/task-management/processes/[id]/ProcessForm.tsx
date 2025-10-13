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
import { uploadTaskFilesInBackground } from "@/lib/api/client/api"

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
    // Step 1: Prepare data WITHOUT files
    const formData = new FormData()
    formData.append("process", process.id)

    const fileFieldsToUpload: Array<{fieldId: string, files: File[]}> = []

    process.fields.forEach((field, index) => {
      formData.append(`fields[${index}][field_id]`, field.id)
      const value = formValues[field.id]

      if ((field.field_type === "file" || field.field_type === "multifile") && value) {
        // Store files for later upload
        const filesArray = Array.isArray(value) ? value : [value]
        fileFieldsToUpload.push({
          fieldId: field.id,
          files: filesArray.filter(f => f instanceof File) as File[]
        })
      } else {
        formData.append(`fields[${index}][value]`, value ?? "")
      }
    })

    // Step 2: Create task
    const response = await createTask(formData)

    if (!response.success) {
      throw new Error(response.error)
    }

    const taskId = response.data.id

    // Step 3: Show success immediately
    alert(t('taskCreatedSuccessfully'))
    
    // Step 4: Upload files in background
    if (fileFieldsToUpload.length > 0) {
      uploadTaskFilesInBackground(taskId, fileFieldsToUpload)
    }
    switch (response.data.process_prefix) {
      case "SP":
        router.push("/task-management/tasks/sent?page_size=15&page=1&process__prefix=SP");
        break;
      case "DR":
        router.push("/task-management/tasks/sent?page_size=15&page=1&process__prefix=DR");
        break;
      case "TA":
        router.push("/task-management/tasks/sent?page_size=15&page=1&process__prefix=TA");
        break;
      default:
        router.push("/task-management/tasks/sent");
        break;
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