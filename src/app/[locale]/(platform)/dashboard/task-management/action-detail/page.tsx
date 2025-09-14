import { getActionDetail } from "@/lib/api/server/reports"
import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDuration, formatDateToUTC7 } from "@/lib/utils/date"
import { getActionColor, getStatusColor } from "@/lib/utils/format"
import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"

export default async function TaskActionDetailPage() {
  const t = await getTranslations()
  const data = await getActionDetail()

  // Group data by task_id
  const groupedData = data
    .sort((a, b) => {
      if (a.task_id !== b.task_id) {
        return a.task_id.localeCompare(b.task_id)
      }
      // Sort by action_created_at within each task group
      return new Date(a.action_created_at).getTime() - new Date(b.action_created_at).getTime()
    })
    .reduce((acc: { [key: string]: typeof data }, action) => {
      if (!acc[action.task_id]) {
        acc[action.task_id] = []
      }
      acc[action.task_id]!.push(action)
      return acc
    }, {})

  // Calculate total duration for each task_id
  const taskTotals = Object.entries(groupedData).map(([taskId, actions]) => {
    const totalDuration = actions.reduce((sum, action) => {
      const duration = typeof action.duration === 'string' 
        ? parseFloat(action.duration) 
        : action.duration
      return sum + (isNaN(duration) ? 0 : duration)
    }, 0)
    return { taskId, totalDuration }
  })

  return (
    <div className="container mx-auto py-6">
      <Card>
        {/* <CardHeader>
          <CardTitle>Task Action Detail</CardTitle>
          <CardDescription>
            History of all task actions ({data.length} actions)
          </CardDescription>
        </CardHeader> */}
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common.id')}</TableHead>
                  <TableHead>{t('taskManagement.common.status')}</TableHead>
                  <TableHead>{t('taskManagement.action.action')}</TableHead>
                  <TableHead>{t('taskManagement.action.actionBy')}</TableHead>
                  <TableHead>{t('taskManagement.action.actionAt')}</TableHead>
                  <TableHead>{t('taskManagement.action.duration')}</TableHead>
                  <TableHead>{t('common.comment')}</TableHead>
                  <TableHead>{t('common.createdBy')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(groupedData).map(([taskId, actions]) => {
                  const taskTotal = taskTotals.find(t => t.taskId === taskId)?.totalDuration || 0
                  
                  return (
                    <React.Fragment key={taskId}>
                      {actions.map((action, index) => (
                        <TableRow key={`${action.task_id}-${index}`}>
                          {/* Show Task Title only on first row of each group */}
                          {index === 0 && (
                            <TableCell 
                              className="border-r" 
                              rowSpan={actions.length}
                            >
                              <Link href={`/task-management/tasks/${action.task_id}`} className="font-bold hover:underline">
                                {action.title}
                              </Link>
                            </TableCell>
                          )}
                          
                          {/* Show State only on first row of each group */}
                          {index === 0 && (
                            <TableCell className="border-r" rowSpan={actions.length}>
                              <Badge variant="outline" className={getStatusColor(action.state_type)}>
                                {action.state}
                              </Badge>
                            </TableCell>
                          )}
                          
                          <TableCell>
                            <Badge variant="outline" className={getActionColor(action.action_type)}>
                              {action.action}
                            </Badge>
                          </TableCell>
                          <TableCell>{action.action_created_by}</TableCell>
                          <TableCell>{formatDateToUTC7(action.action_created_at)}</TableCell>
                          <TableCell>
                            {formatDuration(action.duration)}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate" title={action.comment}>
                              {action.comment}
                            </div>
                          </TableCell>
                          <TableCell>{action.created_by}</TableCell>
                        </TableRow>
                      ))}
                      {/* Subtotal row for each task_id */}
                      <TableRow className="bg-gray-50 font-semibold border-t-2">
                        <TableCell colSpan={5} className="text-right">
                          {t('taskManagement.action.duration')} ({actions[0]!.title}):
                        </TableCell>
                        <TableCell className="font-bold">
                          {formatDuration(taskTotal)}
                        </TableCell>
                        <TableCell colSpan={2}></TableCell>
                      </TableRow>
                    </React.Fragment>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}