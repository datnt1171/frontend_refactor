"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FormField } from '@/app/[locale]/(platform)/task-management/processes/[id]\FormField'
import { updateTaskData } from '@/lib/api/server'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import type { TaskData, ProcessField, UserList, Factory, Retailer } from '@/types'

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
  const t = useTranslations('taskManagement')
  const commonT = useTranslations('common')
  
  const [value, setValue] = useState(taskData.value)
  const [file, setFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleValueChange = (newValue: any) => {
    if (field.field_type === 'file') {
      setFile(newValue)
    } else {
      setValue(newValue)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let updateData: FormData | Record<string, any>

      if (field.field_type === 'file' && file) {
        // For file uploads, use FormData
        updateData = new FormData()
        updateData.append('file', file)
        if (value) {
          updateData.append('value', value)
        }
      } else {
        // For other field types, use JSON
        updateData = { value }
      }

      await updateTaskData(taskId, fieldId, updateData)
      
      toast.success(commonT('success'), {
        description: 'Task data updated successfully'
      })
      
      router.back()
    } catch (error) {
      console.error('Error updating task data:', error)
      toast.error(commonT('error'), {
        description: 'Failed to update task data'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {t('editField')}: {field.field_name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                htmlFor={`field-${field.id}`}
                className="block text-sm font-medium mb-2"
              >
                {field.field_name}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              <FormField
                field={field}
                users={users}
                factories={factories}
                retailers={retailers}
                value={field.field_type === 'file' ? file : value}
                onChange={handleValueChange}
                disabled={isSubmitting}
              />
              
              {field.field_type === 'file' && taskData.file && !file && (
                <div className="mt-2 text-sm text-gray-600">
                  Current file: {taskData.file}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? commonT('saving') : commonT('save')}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                {commonT('cancel')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}