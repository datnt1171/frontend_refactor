import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Plus } from "lucide-react"
import { getSentTasks } from "@/lib/api/server"
import { getStatusColor } from "@/lib/utils/format"
import { getTranslations } from "next-intl/server"
import { formatDateToUTC7 } from "@/lib/utils/date"
import { DataPagination } from "@/components/dashboard/Pagination"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import { RightSidebarProvider } from "@/contexts/FilterContext"
import type { PageFilterConfig } from "@/types"

const SentTaskFilterConfig: PageFilterConfig = {
  showApplyButton: true,
  showResetButton: true,
  filters: [
    {
      id: 'state__state_type__in',
      type: 'multiselect',
      label: 'State Filter',
      options: [
        { value: 'pending_approve', label: 'Pending Approve' },
        { value: 'analyze', label: 'Analyze' },
        { value: 'working', label: 'Working' },
        { value: 'pending_review', label: 'Pending Review' },
        { value: 'start', label: 'Start' },
        { value: 'denied', label: 'Denied' },
        { value: 'canceled', label: 'Canceled' },
        { value: 'closed', label: 'Closed' }
      ]
    },
    {
      id: 'search',
      type: 'search',
      label: 'Search Process',
      placeholder: 'Search by task'
    }
  ]
}

interface SentTaskPageProps {
  searchParams: Promise<{
    search?: string,
    page?: string
    page_size?: string
  }>
}


export default async function SentTasksPage({searchParams}: SentTaskPageProps) {
  const commonT = await getTranslations('common')
  const t = await getTranslations('taskManagement.sentTask')
  const params = await searchParams
  const response = await getSentTasks(params)
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
                            <TableHead>{t('recipient')}</TableHead>
                            <TableHead>{t('formType')}</TableHead>
                            <TableHead>{t('sentDate')}</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {tasks.map((task) => (
                            <TableRow key={task.id}>
                              <TableCell className="font-medium">
                                <Link href={`/task-management/tasks/${task.id}`} className="hover:underline">
                                  {task.title}
                                </Link>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={getStatusColor(task.state_type)}>
                                  {task.state}
                                </Badge>
                              </TableCell>
                              <TableCell>{task.recipient}</TableCell>
                              <TableCell>{task.process}</TableCell>
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
            </div>
          </div>
          <SidebarRight filterConfig={SentTaskFilterConfig} />
        </div>
      </SidebarProvider>
    </RightSidebarProvider>
    
  )
}
