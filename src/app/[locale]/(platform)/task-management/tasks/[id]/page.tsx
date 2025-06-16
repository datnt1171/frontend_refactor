"use client"

import { use, useState, useEffect } from "react"
import { useRouter, Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, User, Loader2, Clock } from "lucide-react"
import { getTaskById, performTaskAction } from "@/lib/api"
import { getStatusColor, getActionColor } from "@/lib/utils/format"
import { useTranslations } from 'next-intl'
import { Input } from "@/components/ui/input"
import type { TaskDetail } from "@/types/api"


export default function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [task, setTask] = useState<TaskDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionComment, setActionComment] = useState<string>("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [actionFile, setActionFile] = useState<File | null>(null)
  const t = useTranslations('dashboard')
  useEffect(() => {
    fetchTaskData()
  }, [id])

  const fetchTaskData = async () => {
    setIsLoading(true)
    try {
      const response = await getTaskById(id)
      setTask(response)
    } catch (err: any) {
      console.error("Error fetching task:", err)
      setError(err.response?.data?.error || t('taskDetail.failedToLoadTaskDetails'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleActionClick = async (actionId: string) => {
    if (!task) return;
    setActionLoading(actionId);
    try {
      const payload = {
        action_id: actionId,
        comment: actionComment || undefined,
        file: actionFile || undefined,
      };
      await performTaskAction(task.id, payload);
      alert(t('taskDetail.actionPerformedSuccessfully'));
      setActionComment("");
      setActionFile(null);
      fetchTaskData();
    } catch (err: any) {
      console.error("Error performing action:", err);
      alert(err.response?.data?.error || t('taskDetail.failedToPerformAction'));
    } finally {
      setActionLoading(null);
    }
  };

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t('taskDetail.loadingTaskDetails')}</p>
        </div>
      )
    }

  if (error || !task) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">{t('taskDetail.taskNotFound')}</h3>
        <p className="text-muted-foreground mt-2">{error || t('taskDetail.requestedTaskDoesNotExist')}</p>
        <Link href="/task-management/dashboard">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('taskDetail.backToDashboard')}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
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
              <CardTitle>{t('taskDetail.taskDetails')}</CardTitle>
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
                        <span className="text-muted-foreground italic">{t('taskDetail.noFileUploaded')}</span>
                      )
                    ) : (
                      data.value || <span className="text-muted-foreground italic">{t('taskDetail.noResponseProvided')}</span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('taskDetail.activityHistory')}</CardTitle>
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
                        <p className="text-xs text-muted-foreground">{t('taskDetail.comment')}: {log.comment}</p>
                      )}
                      {/* Show file link if present */}
                      {log.file && (
                        <p className="text-xs text-blue-600 mt-1">
                          <a href={log.file} target="_blank" rel="noopener noreferrer" className="underline">
                            {log.file.split('/').pop()}
                          </a>
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                ))}

                {(!task.action_logs || task.action_logs.length === 0) && (
                  <div className="text-center text-muted-foreground">
                    <p>{t('taskDetail.noActivityRecorded')}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('taskDetail.taskInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('taskDetail.createdOn')}</p>
                  <p className="text-sm text-muted-foreground">{new Date(task.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('taskDetail.createdBy')}</p>
                  <p className="text-sm text-muted-foreground">{task.created_by.username}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('taskDetail.availableActions')}</CardTitle>
            </CardHeader>
            <CardContent>
              { task.available_actions.length > 0 ? (
                <>
                  {/* File uploader */}
                  <Input
                    type="file"
                    className="mb-2"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                    onChange={e => {
                      const file = e.target.files?.[0] || null;
                      if (file) {
                        const allowedTypes = [
                          "image/jpeg", "image/png", "application/pdf",
                          "application/msword", // .doc
                          "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
                          "application/vnd.ms-excel", // .xls
                          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // .xlsx
                        ];
                        if (!allowedTypes.includes(file.type)) {
                          alert("Invalid file type. Please select a valid file.");
                          e.target.value = ""; // Reset file input
                          setActionFile(null);
                          return;
                        }
                      }
                      setActionFile(file);
                    }}
                    disabled={actionLoading !== null}
                  />
                  <textarea
                    className="w-full p-2 border rounded-md mb-2"
                    placeholder={t('taskDetail.addCommentOptional')}
                    value={actionComment}
                    onChange={(e) => setActionComment(e.target.value)}
                  />
                  {task.available_actions.map((action) => (
                    <Button
                      key={action.id}
                      className={`w-full justify-start mb-2 ${getActionColor(action.action_type)}`}
                      variant="outline"
                      onClick={() => handleActionClick(action.id)}
                      disabled={actionLoading !== null}
                    >
                      {actionLoading === action.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('taskDetail.processing')}
                        </>
                      ) : (
                        action.name
                      )}
                    </Button>
                  ))}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">{t('taskDetail.noActionsAvailable')}</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
