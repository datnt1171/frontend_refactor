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
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import { RightSidebarProvider } from "@/contexts/FilterContext"
import type { PageFilterConfig } from "@/types"
import { getFactoryOptions, getStateTypeOptions, getRetailerOptions, getUserOptions } from "@/lib/utils/filter"



interface PageProps {
  searchParams: Promise<{
    search?: string,
    page?: string
    page_size?: string
  }>
}

export default async function TaskDataDetailPage({searchParams}: PageProps) {
  const FilterConfig: PageFilterConfig = {
  showResetButton: true,
  defaultValues: {
    state_type__in: [
      'pending_approve', 'analyze', 'working',
      'pending_review', 'start', 'closed'
    ]
  },
  filters: [
    {
      id: 'state_type__in',
      type: 'multiselect',
      label: 'State Filter',
      options: getStateTypeOptions()
    },
    {
      id: 'name_of_customer__in',
      type: 'multiselect',
      label: 'Factory Filter',
      options: await getFactoryOptions()
    },
    {
      id: 'retailer__in',
      type: 'multiselect',
      label: 'Retailer Filter',
      options: await getRetailerOptions()
    },
    {
      id: 'sampler__in',
      type: 'multiselect',
      label: 'User Filter',
      options: await getUserOptions()
    },
  ]
}
  const params = await searchParams
  const t = await getTranslations()
  const data = await getDataDetail(params)

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
    <RightSidebarProvider>
      <SidebarProvider>
        <div className="flex flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <div className="sticky top-14 z-10 bg-background px-2">
              <div className="flex items-center gap-2 lg:hidden">
                <SidebarTrigger />
                <span className="text-sm font-medium">Filter</span>
              </div>
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
                          <TableCell className="font-bold">
                                <Link href={`/task-management/tasks/${task.task_id}`} className="hover:underline">
                                  {task.title.startsWith('SP')
                                    ? `${task.finishing_code}${task.customer_color_name ? ` - ${task.customer_color_name}` : ''}`
                                    : task.title
                                  }
                                </Link>
                              </TableCell>
                          <TableCell>{task.quantity_requirement}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(task.state_type)}>
                              {task.state}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDateToUTC7(task.created_at, 'date')}</TableCell>
                          <TableCell>{formatDateToUTC7(task.deadline_request, 'date')}</TableCell>
                          <TableCell>{task.retailer}</TableCell>
                          <TableCell>{task.customer_color_name}</TableCell>
                          <TableCell>{task.type_of_substrate}</TableCell>
                          <TableCell>
                            {task.title}
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
    </div>
              </div>
              <SidebarRight filterConfig={FilterConfig} />
            </div>
          </SidebarProvider>
        </RightSidebarProvider>
  )
}