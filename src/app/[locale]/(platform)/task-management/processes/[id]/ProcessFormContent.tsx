// "use client"

// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Eye } from "lucide-react"
// import { useTranslations } from 'next-intl'
// import type { ProcessDetail, UserList } from "@/types/api"
// import { FormField } from "./FormField"

// interface ProcessFormContentProps {
//   process: ProcessDetail
//   users: UserList[]
//   formValues: Record<string, any>
//   onInputChange: (fieldId: string, value: any) => void
//   onReview: (e: React.FormEvent) => void
// }

// export function ProcessFormContent({
//   process,
//   users,
//   formValues,
//   onInputChange,
//   onReview
// }: ProcessFormContentProps) {
//   const t = useTranslations('taskManagement.createTask')

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>{t('createTask')}</CardTitle>
//       </CardHeader>
//       <form onSubmit={onReview}>
//         <CardContent className="space-y-4">
//           {process.fields.map((field) => (
//             <div key={field.id} className="space-y-2">
//               <Label htmlFor={`field-${field.id}`}>
//                 {field.name}
//                 {field.required && <span className="text-red-500 ml-1">*</span>}
//               </Label>
//               <FormField
//                 field={field}
//                 users={users}
//                 value={formValues[field.id]}
//                 onChange={(value) => onInputChange(field.id, value)}
//                 disabled={false}
//               />
//             </div>
//           ))}
//         </CardContent>
//         <CardFooter>
//           <Button type="submit">
//             <Eye className="mr-2 h-4 w-4" />
//             {t('review')}
//           </Button>
//         </CardFooter>
//       </form>
//     </Card>
//   )
// }