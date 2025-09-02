"use client"

import { useState } from "react"
import { useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { performTaskAction } from "@/lib/api/client/api"
import { getActionColor } from "@/lib/utils/format"
import { useTranslations } from 'next-intl'
import type { TaskDetail } from "@/types/api"
import { ACCEPTED_FILE_TYPES } from "@/constants/navigation"
import { compressImage } from "@/lib/utils/imageCompression"

interface TaskActionsProps {
  task: TaskDetail
}

export default function TaskActions({ task }: TaskActionsProps) {
  const router = useRouter()
  const [actionComment, setActionComment] = useState<string>("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [actionFile, setActionFile] = useState<File | null>(null)
  const [fileProcessing, setFileProcessing] = useState(false)
  const commonT = useTranslations('common')
  const t = useTranslations('taskManagement.taskDetail')

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    
    if (!file) {
      setActionFile(null)
      return
    }

    setFileProcessing(true)
    
    try {
      // Compress image if it's an image file
      const processedFile = await compressImage(file, {
        maxWidth: 1280,
        maxHeight: 720,
        quality: 0.7,
        maxSizeKB: 200
      })
      setActionFile(processedFile)
    } catch (error) {
      console.error('File processing failed:', error)
      // Fall back to original file if compression fails
      setActionFile(file)
    } finally {
      setFileProcessing(false)
    }
  }

  const handleActionClick = async (actionId: string) => {
    setActionLoading(actionId)
    try {
      const payload = {
        action_id: actionId,
        comment: actionComment || undefined,
        file: actionFile || undefined,
      }
      await performTaskAction(task.id, payload)
      alert(t('actionPerformedSuccessfully'))
      setActionComment("")
      setActionFile(null)
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) fileInput.value = ""
      
      router.refresh() // Refresh the page to show updated data
    } catch (err: any) {
      console.error("Error performing action:", err)
      alert(err.response?.data?.error || t('failedToPerformAction'))
    } finally {
      setActionLoading(null)
    }
  }

  const isDisabled = actionLoading !== null || fileProcessing

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('availableActions')}</CardTitle>
      </CardHeader>
      <CardContent>
        {task.available_actions.length > 0 ? (
          <>
            <div className="relative mb-2">
              <Input
                type="file"
                // accept={ACCEPTED_FILE_TYPES}
                onChange={handleFileChange}
                disabled={isDisabled}
              />
            </div>
            <textarea
              className="w-full p-2 border rounded-md mb-2"
              placeholder={t('addCommentOptional')}
              value={actionComment}
              onChange={(e) => setActionComment(e.target.value)}
              disabled={isDisabled}
            />
            {task.available_actions.map((action) => (
              <Button
                key={action.id}
                className={`w-full justify-center font-bold mb-2 ${getActionColor(action.action_type)}`}
                variant="outline"
                onClick={() => handleActionClick(action.id)}
                disabled={isDisabled}
              >
                {actionLoading === action.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {commonT('processing')}
                  </>
                ) : (
                  action.name
                )}
              </Button>
            ))}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">{t('noActionsAvailable')}</p>
        )}
      </CardContent>
    </Card>
  )
}