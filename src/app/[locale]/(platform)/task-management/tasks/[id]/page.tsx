import { getTask } from "@/lib/api/server"
import { getTranslations } from "next-intl/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Clock } from "lucide-react"
import { getStatusColor } from "@/lib/utils/format"
import { formatDateToUTC7 } from "@/lib/utils/date"
import TaskActions from "./TaskAction"
import BackButton from "@/components/ui/BackButton"

export default async function TaskDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  
  // Fetch data and translations on server
  const [task, t, commonT] = await Promise.all([
    getTask(id),
    getTranslations('taskManagement.taskDetail'),
    getTranslations('common')
  ])

  if (!task) {
    return <div>Task not found</div>
  }

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
              <CardTitle>{t('Title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {task.data.map((data) => (
                <div key={data.field.id as string} className="space-y-2">
                  <label className="text-sm font-medium">{data.field.name as string}</label>
                  <div className="p-3 bg-muted rounded-md space-y-1">
                    {data.field.field_type === "file" ? (
                      data.files && data.files.length > 0 ? (
                        data.files.map((file, index) => (
                          <p key={index}>
                            <a
                              href={file.uploaded_file}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline"
                            >
                              {file.original_filename}
                            </a>
                          </p>
                        ))
                      ) : (
                        <span className="text-muted-foreground italic">{t('noFileUploaded')}</span>
                      )
                    ) : (
                      data.value || <span className="text-muted-foreground italic">{t('noResponseProvided')}</span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('activityHistory')}</CardTitle>
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
                        <p className="text-xs text-muted-foreground">{t('comment')}: {log.comment}</p>
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
                    <p>{t('noActivityRecorded')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('taskInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{commonT('createdAt')}</p>
                  <p className="text-sm text-muted-foreground">{formatDateToUTC7(task.created_at)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{commonT('createdBy')}</p>
                  <p className="text-sm text-muted-foreground">{task.created_by.username}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client component for actions */}
          <TaskActions task={task} />
        </div>
      </div>
    </div>
  )
}