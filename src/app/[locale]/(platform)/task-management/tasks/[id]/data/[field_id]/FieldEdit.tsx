"use client"

import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormField } from '@/app/[locale]/(platform)/task-management/processes/[id]/FormField'
import { updateTaskData } from '@/lib/api/client/api'
import { useTranslations } from 'next-intl'
import type { TaskData, ProcessField, UserList, Factory, Retailer } from '@/types'
import BackButton from '@/components/ui/BackButton'

interface TaskDataEditorProps {
  taskData: TaskData
  field: ProcessField
  users: UserList[]
  factories: Factory[]
  retailers: Retailer[]
  taskId: string
  fieldId: string
}

export function TaskDataEditor({
  taskData,
  field,
  users,
  factories,
  retailers,
  taskId,
  fieldId
}: TaskDataEditorProps) {
  const router = useRouter()
  const t = useTranslations()
  
  const [value, setValue] = useState(() => {
    // Parse multiselect string to array
    if (field.field_type === 'multiselect' && typeof taskData.value === 'string') {
      try {
        return JSON.parse(taskData.value)
      } catch {
        return []
      }
    }
    return taskData.value
  })
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleValueChange = (newValue: any) => {
    if (field.field_type === 'file' || field.field_type === 'multifile') {
      // Always handle as array
      const filesArray = Array.isArray(newValue) ? newValue : [newValue]
      setFiles(filesArray)
    } else {
      setValue(newValue)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let updateData: FormData | Record<string, any>

      if ((field.field_type === 'file' || field.field_type === 'multifile') && files.length > 0) {
        // File uploads - always send as FormData with multiple files
        updateData = new FormData()
        
        // Append all files with the same key
        files.forEach((file) => {
          updateData.append('files', file)
        })
        if (value) {
          updateData.append('value', value)
        }
      } else {
        // Convert array to comma-separated string for multiselect
        const submitValue = field.field_type === 'multiselect' && Array.isArray(value)
          ? value.join(',')
          : value
        updateData = { value: submitValue }
      }

      await updateTaskData(taskId, fieldId, updateData)
      alert(t('taskManagement.taskDetail.EditSuccessfully'))
      router.push(`/task-management/tasks/${taskId}`)
    } catch (error) {
      alert(t('taskManagement.taskDetail.EditFailed'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, idx) => idx !== index))
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <BackButton />
            {t('common.edit')}: {field.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor={`field-${field.id}`}
                className="block text-sm font-medium mb-2"
              >
                {field.name}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              <FormField
                field={field}
                users={users}
                factories={factories}
                retailers={retailers}
                value={(field.field_type === 'file' || field.field_type === 'multifile') ? files : value}
                onChange={handleValueChange}
                disabled={isSubmitting}
              />
              
              {/* Show newly selected files */}
              {(field.field_type === 'file' || field.field_type === 'multifile') && files.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm font-medium text-gray-700">{t('taskManagement.taskDetail.newFilesSelected')}:</p>
                  {files.map((file, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-2 bg-blue-50 rounded text-sm"
                    >
                        {file.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                        disabled={isSubmitting}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? t('common.processing') : t('common.save')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}