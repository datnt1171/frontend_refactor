// "use client"

// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { ArrowLeft, Send, Loader2 } from "lucide-react"
// import { useTranslations } from 'next-intl'
// import type { ProcessDetail, UserList, ProcessField } from "@/types/api"

// interface FormReviewProps {
//   process: ProcessDetail
//   users: UserList[]
//   formValues: Record<string, any>
//   isSubmitting: boolean
//   onBack: () => void
//   onSubmit: () => void
// }

// export function FormReview({
//   process,
//   users,
//   formValues,
//   isSubmitting,
//   onBack,
//   onSubmit
// }: FormReviewProps) {
//   const t = useTranslations('taskManagement.createTask')

//   const displayFieldValue = (field: ProcessField) => {
//     const value = formValues[field.id]
    
//     if (!value) {
//       return (
//         <span className="text-muted-foreground italic">
//           {t('noValueProvided')}
//         </span>
//       )
//     }
    
//     if (field.field_type === "assignee") {
//       const user = users.find(u => u.id.toString() === value)
//       return user ? `${user.last_name} ${user.first_name} (${user.username})` : value
//     }
    
//     if (field.field_type === "file" && value instanceof File) {
//       return value.name
//     }
    
//     return value
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>{t('reviewTask')}</CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         {process.fields.map(field => (
//           <div key={field.id} className="space-y-2">
//             <Label>
//               {field.name}
//               {field.required && <span className="text-red-500 ml-1">*</span>}
//             </Label>
//             <div className="p-3 bg-muted rounded-md">
//               {displayFieldValue(field)}
//             </div>
//           </div>
//         ))}
//       </CardContent>
//       <CardFooter className="flex justify-between">
//         <Button 
//           variant="outline" 
//           onClick={onBack} 
//           disabled={isSubmitting}
//         >
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           {t('backToEdit')}
//         </Button>
//         <Button onClick={onSubmit} disabled={isSubmitting}>
//           {isSubmitting ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               {t('submitting')}
//             </>
//           ) : (
//             <>
//               <Send className="mr-2 h-4 w-4" />
//               {t('submitTask')}
//             </>
//           )}
//         </Button>
//       </CardFooter>
//     </Card>
//   )
// }