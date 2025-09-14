import { getDataDetail } from "@/lib/api/server/reports"
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
import { TaskDataDetail } from "@/types"
import { formatDateToUTC7 } from "@/lib/utils/date"
import { getStatusColor } from "@/lib/utils/format"
import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"

export default async function TaskDataDetailPage() {
  const t = await getTranslations()
  const data = await getDataDetail()

  const groupedData = data
    .sort((a, b) => {
      if (a.name_of_customer !== b.name_of_customer) {
        return a.name_of_customer.localeCompare(b.name_of_customer)
      }
      return a.sample_type.localeCompare(b.sample_type)
    })
    .reduce((acc: { [key: string]: TaskDataDetail[] }, task) => {
      const groupKey = task.name_of_customer
      if (!acc[groupKey]) {
        acc[groupKey] = []
      }
      acc[groupKey].push(task)
      return acc
    }, {})

  // Calculate totals for each group
  const groupTotals = Object.entries(groupedData).map(([groupKey, tasks]) => {
    const total = tasks.reduce((sum, task) => {
      const qty = parseInt(task.quantity_requirement) || 0
      return sum + qty
    }, 0)
    return { groupKey, total }
  })

  return (
    <div className="container mx-auto py-6">
      <Card>
        {/* <CardHeader>
          <CardTitle>Task Data Detail</CardTitle>
          <CardDescription>
            Overview of all task details ({data.length} tasks)
          </CardDescription>
        </CardHeader> */}
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('crm.factories.factoryName')}</TableHead>
                  <TableHead>{t('sample.sampleType')}</TableHead>
                  <TableHead>{t('sample.finishingCode')}</TableHead>
                  <TableHead>{t('sample.quantityRequirement')}</TableHead>
                  <TableHead>{t('taskManagement.common.status')}</TableHead>
                  <TableHead>{t('common.createdAt')}</TableHead>
                  <TableHead>{t('sample.deadlineRequest')}</TableHead>
                  <TableHead>{t('crm.retailer.retailer')}</TableHead>
                  <TableHead>{t('sample.customersColorName')}</TableHead>
                  <TableHead>{t('sample.typeOfSubstrate')}</TableHead>
                  <TableHead>{t('common.id')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(groupedData).map(([groupKey, tasks]) => {
                  const groupTotal = groupTotals.find(g => g.groupKey === groupKey)?.total || 0
                  
                  return (
                    <React.Fragment key={groupKey}>
                      {tasks.map((task, index) => (
                        <TableRow key={task.task_id}>
                          <TableCell>{task.name_of_customer}</TableCell>
                          <TableCell>{task.sample_type}</TableCell>
                          <TableCell>{task.finishing_code}</TableCell>
                          <TableCell>{task.quantity_requirement}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(task.state_type)}>
                              {task.state}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDateToUTC7(task.created_at)}</TableCell>
                          <TableCell>{formatDateToUTC7(task.deadline_request)}</TableCell>
                          <TableCell>{task.retailer}</TableCell>
                          <TableCell>{task.customer_color_name}</TableCell>
                          <TableCell>{task.type_of_substrate}</TableCell>
                          <TableCell>
                            <Link 
                              href={`/task-management/tasks/${task.task_id}`} 
                              className="font-bold hover:underline">
                              {task.title}
                            </Link>           
                          </TableCell>
                        </TableRow>
                      ))}
                      {/* Subtotal row */}
                      {tasks[0] && (
                        <TableRow className="bg-gray-50 font-semibold border-t-2">
                          <TableCell colSpan={3}>
                            {tasks[0].name_of_customer}
                          </TableCell>
                          <TableCell>
                            {groupTotal}
                          </TableCell>
                        </TableRow>
                      )}
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