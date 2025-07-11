// "use client"

// import { useState } from "react"
// import { useRouter } from "@/i18n/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Loader2 } from "lucide-react"
// import { performTaskAction } from "@/lib/api"
// import { getActionColor } from "@/lib/utils/format"
// import { useTranslations } from 'next-intl'
// import type { TaskDetail } from "@/types/api"
// import { ACCEPTED_FILE_TYPES } from "@/constants/navigation"

// interface TaskActionsProps {
//   task: TaskDetail
// }

// export default function TaskActions({ task }: TaskActionsProps) {
//   const router = useRouter()
//   const [actionComment, setActionComment] = useState<string>("")
//   const [actionLoading, setActionLoading] = useState<string | null>(null)
//   const [actionFile, setActionFile] = useState<File | null>(null)
//   const commonT = useTranslations('common')
//   const t = useTranslations('taskManagement.taskDetail')

//   const handleActionClick = async (actionId: string) => {
//     setActionLoading(actionId)
//     try {
//       const payload = {
//         action_id: actionId,
//         comment: actionComment || undefined,
//         file: actionFile || undefined,
//       }
//       await performTaskAction(task.id, payload)
//       alert(t('actionPerformedSuccessfully'))
//       setActionComment("")
//       setActionFile(null)
//       router.refresh() // Refresh the page to show updated data
//     } catch (err: any) {
//       console.error("Error performing action:", err)
//       alert(err.response?.data?.error || t('failedToPerformAction'))
//     } finally {
//       setActionLoading(null)
//     }
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>{t('availableActions')}</CardTitle>
//       </CardHeader>
//       <CardContent>
//         {task.available_actions.length > 0 ? (
//           <>
//             <Input
//               type="file"
//               className="mb-2"
//               // accept={ACCEPTED_FILE_TYPES}
//               onChange={e => {
//                 const file = e.target.files?.[0] || null
//                 if (file) {
//                   const allowedTypes = [
//                     "image/jpeg", "image/png", "application/pdf",
//                     "application/msword",
//                     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//                     "application/vnd.ms-excel",
//                     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//                   ]
//                   if (!allowedTypes.includes(file.type)) {
//                     alert(commonT('invalidFile'))
//                     e.target.value = ""
//                     setActionFile(null)
//                     return
//                   }
//                 }
//                 setActionFile(file)
//               }}
//               disabled={actionLoading !== null}
//             />
//             <textarea
//               className="w-full p-2 border rounded-md mb-2"
//               placeholder={t('addCommentOptional')}
//               value={actionComment}
//               onChange={(e) => setActionComment(e.target.value)}
//             />
//             {task.available_actions.map((action) => (
//               <Button
//                 key={action.id}
//                 className={`w-full justify-center font-bold mb-2 ${getActionColor(action.action_type)}`}
//                 variant="outline"
//                 onClick={() => handleActionClick(action.id)}
//                 disabled={actionLoading !== null}
//               >
//                 {actionLoading === action.id ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     {commonT('processing')}
//                   </>
//                 ) : (
//                   action.name
//                 )}
//               </Button>
//             ))}
//           </>
//         ) : (
//           <p className="text-sm text-muted-foreground">{t('noActionsAvailable')}</p>
//         )}
//       </CardContent>
//     </Card>
//   )
// }