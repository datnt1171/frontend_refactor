import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal } from "lucide-react"

import { getStatusColor } from "@/lib/utils/format"
import { formatDateToUTC7 } from "@/lib/utils/date"
import { getReceivedTasks } from "@/lib/api/server"
import { getTranslations } from "next-intl/server"
import { DataPagination } from "@/components/dashboard/Pagination"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import { RightSidebarProvider } from "@/contexts/FilterContext"
import type { PageFilterConfig } from "@/types"
import { getStateTypeOptions, getProcessPrefixOptions } from "@/lib/utils/filter"

interface ReceivedTaskPageProps {
  searchParams: Promise<{
    search?: string,
    page?: string
    page_size?: string
  }>
}

export default async function ReceivedTasksPage({searchParams}: ReceivedTaskPageProps) {
  const commonT = await getTranslations('common')
  const commonTaskT = await getTranslations('taskManagement.common')
  const t = await getTranslations('taskManagement.receivedTask')

  const FilterConfig: PageFilterConfig = {
    showResetButton: true,
    filters: [
      {
        id: 'process__prefix',
        type: 'select',
        label: 'Loại phiếu',
        options: getProcessPrefixOptions()
      },
      {
        id: 'state__state_type__in',
        type: 'select',
        label: 'State Filter',
        options: await getStateTypeOptions()
      },
      {
        id: 'search',
        type: 'search',
        label: 'Search task',
        placeholder: 'Search by task'
      }
    ]
  }

  const params = await searchParams
  const response = await getReceivedTasks(params)
  const tasks = response.results


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
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
                  <p className="text-muted-foreground mt-2">{t('description')}</p>
                </div>
                  <Card>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{commonT('id')}</TableHead>
                            <TableHead>{commonTaskT('status')}</TableHead>
                            <TableHead>{t('from')}</TableHead>
                            <TableHead>{commonTaskT('formType')}</TableHead>
                            <TableHead>{commonT('createdAt')}</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tasks.map((task) => (
                            <TableRow key={task.id}>
                              <TableCell className="font-bold">
                                <Link href={`/task-management/tasks/${task.id}`} className="hover:underline">
                                  {task.title.startsWith('SP')
                                    ? `${task.finishing_code}${task.customer_color_name ? ` - ${task.customer_color_name}` : ''}`
                                    : task.title
                                  }
                                </Link>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={getStatusColor(task.state_type)}>
                                  {task.state}
                                </Badge>
                              </TableCell>
                              <TableCell>{task.created_by}</TableCell>
                              <TableCell>{task.title}</TableCell>
                              <TableCell>{formatDateToUTC7(task.created_at)}</TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                      <span className="sr-only">{commonT('openMenu')}</span>
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Link href={`/task-management/tasks/${task.id}`}>{commonT('viewDetails')}</Link>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>

                      {tasks.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <h3 className="text-lg font-medium">{commonT('noDataFound')}</h3>
                          <p className="text-muted-foreground mt-2">{t('noAssignedTasks')}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
              </div>
              <DataPagination
                totalCount={response.count}
              />
            </div>
          </div>
          <SidebarRight filterConfig={FilterConfig} />
        </div>
      </SidebarProvider>
    </RightSidebarProvider>
    
  )
}
