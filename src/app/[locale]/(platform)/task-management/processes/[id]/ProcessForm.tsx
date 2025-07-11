// "use client"

// import { useState } from "react"
// import { useRouter } from "@/i18n/navigation"
// import { useTranslations } from 'next-intl'
// import { createTask } from "@/lib/api"
// import type { ProcessDetail, UserList } from "@/types/api"
// import { ProcessFormHeader } from "./ProcessFormHeader"
// import { ProcessFormContent } from "./ProcessFormContent"
// import { FormReview } from "./FormReview"

// interface ProcessFormClientProps {
//   process: ProcessDetail
//   users: UserList[]
// }

// export function ProcessFormClient({ 
//   process, 
//   users
// }: ProcessFormClientProps) {
//   const router = useRouter()
//   const t = useTranslations('taskManagement.createTask')
  
//   const [formValues, setFormValues] = useState<Record<string, any>>({})
//   const [showReview, setShowReview] = useState(false)
//   const [isSubmitting, setIsSubmitting] = useState(false)

//   const handleInputChange = (fieldId: string, value: any) => {
//     setFormValues(prev => ({
//       ...prev,
//       [fieldId]: value,
//     }))
//   }

//   const validateForm = () => {
//     const missingFields = process.fields
//       .filter(field => field.required && !formValues[field.id])
//       .map(field => field.name)
    
//     if (missingFields.length) {
//       alert(t('pleaseFillRequiredFields', { 
//         fields: missingFields.join(", ") 
//       }))
//       return false
//     }
//     return true
//   }

//   const handleReview = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (validateForm()) {
//       setShowReview(true)
//     }
//   }

//   const handleSubmit = async () => {
//     setIsSubmitting(true)

//     try {
//       const formData = new FormData()
//       formData.append("process", String(process.id))

//       process.fields.forEach((field, index) => {
//         formData.append(`fields[${index}][field_id]`, String(field.id))

//         const value = formValues[field.id]

//         if (field.field_type === "file" && value instanceof File) {
//           console.log(`Appending file for field ${field.id}:`, {
//             name: value.name,
//             type: value.type,
//             size: value.size
//           })
//           formData.append(`fields[${index}][file]`, value)
//         } else {
//           console.log(`Appending value for field ${field.id}:`, value)
//           formData.append(`fields[${index}][value]`, value ?? "")
//         }
//       })

//       const response = await createTask(formData)
//       console.log("Task created successfully:", response.data)
//       alert(t('taskCreatedSuccessfully'))
//       router.push("/task-management/tasks/sent")
//     } catch (err: any) {
//       console.error("Error creating task:", err)
      
//       // Enhanced error message extraction matching your route.ts error structure
//       let errorMessage = t('failedToCreateTask') // Default fallback
      
//       if (err.response?.data) {
//         // Your route.ts returns { success: false, error: "message" }
//         if (err.response.data.error) {
//           errorMessage = err.response.data.error
//         }
//         // Fallback to other possible error structures
//         else if (typeof err.response.data === 'string') {
//           errorMessage = err.response.data
//         }
//         // Handle case where error data is the message itself
//         else if (err.response.data.message) {
//           errorMessage = err.response.data.message
//         }
//       }
//       // Handle network errors or other errors
//       else if (err.message) {
//         errorMessage = err.message
//       }
      
//       console.error("Extracted error message:", errorMessage)
//       alert(errorMessage)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <ProcessFormHeader processName={process.name} />
      
//       {showReview ? (
//         <FormReview
//           process={process}
//           users={users}
//           formValues={formValues}
//           isSubmitting={isSubmitting}
//           onBack={() => setShowReview(false)}
//           onSubmit={handleSubmit}
//         />
//       ) : (
//         <ProcessFormContent
//           process={process}
//           users={users}
//           formValues={formValues}
//           onInputChange={handleInputChange}
//           onReview={handleReview}
//         />
//       )}
//     </div>
//   )
// }