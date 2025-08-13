"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  const t = useTranslations('taskManagement.taskDetail')
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
        // File uploads
        updateData = new FormData()
        updateData.append('file', file)
        if (value) {
          updateData.append('value', value)
        }
      } else {
        // Other field types
        updateData = { value }
      }

      await updateTaskData(taskId, fieldId, updateData)
      
      alert(t('EditSuccessfully'))
      
      router.push(`/task-management/tasks/${taskId}`)
    } catch (error) {
      alert(t('EditFailed'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>
            <BackButton />
            {commonT('edit')}: {field.name}
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
                value={field.field_type === 'file' ? file : value}
                onChange={handleValueChange}
                disabled={isSubmitting}
              />
              
              {field.field_type === 'file' && taskData.file && !file && (
                <div className="mt-2 text-sm text-gray-600">
                  {taskData.file}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? commonT('processing') : commonT('save')}
              </Button>
              
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}