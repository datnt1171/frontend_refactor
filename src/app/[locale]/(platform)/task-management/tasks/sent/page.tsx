import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Plus } from "lucide-react"
import { getSentTasks } from "@/lib/api/server"
import { getStatusColor } from "@/lib/utils/format"
import { getTranslations, getLocale } from "next-intl/server"
import { formatDateToUTC7 } from "@/lib/utils/date"
import { DataPagination } from "@/components/dashboard/Pagination"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarRightMobileTrigger } from '@/components/dashboard/SidebarRightMobileTrigger';
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import type { PageFilterConfig } from "@/types"
import { getStateTypeOptions, getProcessPrefixOptions, redirectWithDefaults } from "@/lib/utils/filter"

interface SentTaskPageProps {
  searchParams: Promise<{
    search?: string,
    page?: string
    page_size?: string
  }>
}


export default async function SentTasksPage({searchParams}: SentTaskPageProps) {

  const params = await searchParams
  const locale = await getLocale()
  const commonT = await getTranslations('common')
  const t = await getTranslations('taskManagement.sentTask')

  const defaultParams = {
    page_size: '50',
    page: '1'
  }

  redirectWithDefaults({
    currentParams: params,
    defaultParams,
    pathname: '/task-management/tasks/sent',
    locale
  });

  const FilterConfig: PageFilterConfig = {
    showResetButton: true,
    isPaginated: true,

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

  const response = await getSentTasks(params)
  const tasks = response.results

  return (
    <SidebarProvider>
      <SidebarInset className="flex flex-col min-w-0">
        <SidebarRightMobileTrigger />

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
              <p className="text-muted-foreground mt-2">{t('description')}</p>
            </div>
            <Link href="/task-management/processes">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('createNewTask')}
              </Button>
            </Link>
          </div>
            <Card>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{commonT('id')}</TableHead>
                      <TableHead>{t('status')}</TableHead>
                      <TableHead>{t('formType')}</TableHead>
                      <TableHead>{t('recipient')}</TableHead>
                      <TableHead>{t('sentDate')}</TableHead>
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
                        <TableCell>{task.title}</TableCell>
                        <TableCell>{task.recipient}</TableCell>
                        <TableCell>{ formatDateToUTC7(task.created_at) }</TableCell>
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
                              <DropdownMenuItem>{t('sendReminder')}</DropdownMenuItem>
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
                    <p className="text-muted-foreground mt-2">{t('tryAdjustingSearchOrCreateTask')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
        </div>
        <DataPagination
          totalCount={response.count}
        />
      </SidebarInset>
      
      <SidebarRight filterConfig={FilterConfig} />
    </SidebarProvider>
  )
}
