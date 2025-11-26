import { getTask, getCurrentUser } from "@/lib/api/server"
import { getTranslations } from "next-intl/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Clock, Edit, FileSpreadsheet } from "lucide-react"
import { getStatusColor } from "@/lib/utils/format"
import { formatDateToUTC7 } from "@/lib/utils/date"
import TaskActions from "./TaskAction"
import BackButton from "@/components/ui/BackButton"
import { Link } from "@/i18n/navigation"
import { cookies } from 'next/headers'

export default async function Page({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  

  const [task, t, currentUser] = await Promise.all([
    getTask(id),
    getTranslations(),
    getCurrentUser()
  ])
  const cookieStore = await cookies()
  const userRole = cookieStore.get('role')?.value

  const canEdit = currentUser.id === task.created_by.id || userRole === 'assistant'

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <BackButton />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{task.title}</h1>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="outline">{task.process.name}</Badge>
            <Badge variant="outline" className={getStatusColor(task.state.state_type)}>
              {task.state.name}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('taskManagement.taskDetail.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {task.data.map((data) => (
                <div key={data.field.id as string} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">{data.field.name as string}</label>
                    {canEdit && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        asChild
                        className="h-8 px-2"
                      >
                        <Link href={`/task-management/tasks/${id}/data/${data.field.id}`}>
                          <Edit className="h-3 w-3 mr-1" />
                          {t('common.edit')}
                        </Link>
                      </Button>
                    )}
                  </div>
                  <div className="p-3 bg-muted rounded-md space-y-1">
                  {data.field.field_type === "file" || data.field.field_type === "multifile" ? (
                    data.files && data.files[0] ? (
                      <p>
                        <a 
                          href={data.files[0].uploaded_file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {data.files[0].original_filename}
                        </a>
                      </p>
                    ) : (
                        <span className="text-muted-foreground italic">{t('taskManagement.taskDetail.noFileUploaded')}</span>
                      )
                    ) : (
                      data.value || <span className="text-muted-foreground italic">{t('taskManagement.taskDetail.noResponseProvided')}</span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('taskManagement.taskDetail.activityHistory')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {task.action_logs.map((log) => (
                  <div key={log.id} className="flex items-start">
                    <div className="mr-2 mt-0.5">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{log.user.username}</span>{" "}
                        <span className="text-muted-foreground">{log.action.description || log.action.name}</span>
                      </p>
                      {log.comment && (
                        <p className="text-xs text-muted-foreground">{t('taskManagement.taskDetail.comment')}: {log.comment}</p>
                      )}
                      {log.file && (
                        <p className="text-xs text-blue-600 mt-1">
                          <a href={log.file} target="_blank" rel="noopener noreferrer" className="underline">
                            {log.file.split('/').pop()}
                          </a>
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">{formatDateToUTC7(log.created_at)}</p>
                    </div>
                  </div>
                ))}

                {(!task.action_logs || task.action_logs.length === 0) && (
                  <div className="text-center text-muted-foreground">
                    <p>{t('taskManagement.taskDetail.noActivityRecorded')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('taskManagement.taskDetail.taskInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('common.createdAt')}</p>
                  <p className="text-sm text-muted-foreground">{formatDateToUTC7(task.created_at)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('common.createdBy')}</p>
                  <p className="text-sm text-muted-foreground">{task.created_by.username}</p>
                </div>
              </div>
              <Button asChild>
                <Link href={`/task-management/tasks/${id}/sheets`}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  {t('finishingSheet.finishingSheet')}
                </Link>
              </Button>
            </CardContent>
          </Card>

          <TaskActions task={task} />
        </div>
      </div>
    </div>
  )
}