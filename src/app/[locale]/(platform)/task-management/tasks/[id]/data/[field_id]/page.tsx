import { 
  getUsers, 
  getFactories, 
  getRetailers, 
  getTaskData } from '@/lib/api/server'
import { TaskDataEditor } from './FieldEdit'
import { notFound } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Clock } from 'lucide-react'
import { formatDateToUTC7 } from "@/lib/utils/date"
import { getTranslations } from "next-intl/server"

interface PageProps {
  params: Promise<{
    id: string
    field_id: string
    locale: string
  }>
}

export default async function TaskDataPage({ params }: PageProps) {
  const { id: taskId, field_id: fieldId } = await params

  try {
    const taskData = await getTaskData(taskId, fieldId)
    const t = await getTranslations('taskManagement.taskDetail')
    const field = taskData.field

    // Check what data we need based on field type
    const needsUsers = field.field_type === "assignee"
    const needsFactories = field.field_type === "factory" 
    const needsRetailers = field.field_type === "retailer"

    // Fetch required data conditionally
    const [users, factories, retailers] = await Promise.all([
      needsUsers ? getUsers().then(res => res.results) : Promise.resolve([]),
      needsFactories ? getFactories({
        is_active: true,
        has_onsite: true,
        limit: 100
      }).then(res => res.results) : Promise.resolve([]),
      needsRetailers ? getRetailers().then(res => res.results) : Promise.resolve([])
    ])

    // Map values based on field type
    let mappedValue = taskData.value
    
    if (taskData.value) {
      if (needsUsers) {
        const user = users.find(u => u.id === taskData.value)
        mappedValue = user ? user.username : taskData.value
      } else if (needsFactories) {
        const factory = factories.find(f => f.factory_code === taskData.value)
        mappedValue = factory ? factory.factory_name : taskData.value
      } else if (needsRetailers) {
        const retailer = retailers.find(r => r.id === taskData.value)
        mappedValue = retailer ? retailer.name : taskData.value
      }
    }

    // Map history values
    const mappedHistory = taskData.history.map(entry => {
      let mappedHistoryValue = entry.value
      
      if (entry.value) {
        if (needsUsers) {
          const user = users.find(u => u.id === entry.value)
          mappedHistoryValue = user ? user.username : entry.value
        } else if (needsFactories) {
          const factory = factories.find(f => f.factory_code === entry.value)
          mappedHistoryValue = factory ? factory.factory_name : entry.value
        } else if (needsRetailers) {
          const retailer = retailers.find(r => r.id === entry.value)
          mappedHistoryValue = retailer ? retailer.name : entry.value
        }
      }
      
      return {
        ...entry,
        value: mappedHistoryValue
      }
    })

    // Create mapped taskData
    const mappedTaskData = {
      ...taskData,
      value: mappedValue,
      history: mappedHistory
    }

    return (
      <div className="container mx-auto py-6 space-y-6">
        <TaskDataEditor
          taskData={mappedTaskData}
          field={field}
          users={users}
          factories={factories}
          retailers={retailers}
          taskId={taskId}
          fieldId={fieldId}
        />
        
        {/* Files/History Card */}
        <Card>
          <CardHeader>
            <CardTitle>
              {field.field_type === 'file' ? 'Files' : 'History'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {field.field_type === 'file' ? (
                mappedTaskData.files.length > 0 ? (
                  mappedTaskData.files.map((file, index) => (
                    <div key={index} className="flex items-start">
                      <div className="mr-2 mt-0.5">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{file.original_filename || 'Unknown file'}</span>
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          <a 
                            href={file.uploaded_file} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="underline"
                          >
                            {file.uploaded_file.split('/').pop()}
                          </a>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateToUTC7(file.uploaded_at)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground">
                    <p>{t('noActivityRecorded')}</p>
                  </div>
                )
              ) : (
                mappedTaskData.history.length > 0 ? (
                  mappedTaskData.history.map((entry, index) => (
                    <div key={index} className="flex items-start">
                      <div className="mr-2 mt-0.5">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{entry.updated_by}: {entry.value}</span>{" "}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateToUTC7(entry.updated_at)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground">
                     <p>{t('noActivityRecorded')}</p>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error('Error loading task data:', error)
    return notFound()
  }
}