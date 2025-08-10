import { 
  getUsers, 
  getFactories, 
  getRetailers, 
  getTaskData } from '@/lib/api/server'
import { TaskDataEditor } from './FieldEdit'
import { notFound } from 'next/navigation'

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

    return (
      <TaskDataEditor
        taskData={taskData}
        field={field}
        users={users}
        factories={factories}
        retailers={retailers}
        taskId={taskId}
        fieldId={fieldId}
      />
    )
  } catch (error) {
    console.error('Error loading task data:', error)
    return notFound()
  }
}