import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal } from "lucide-react"

import { getStatusColor } from "@/lib/utils/format"
import { formatDateToUTC7 } from "@/lib/utils/date"

import type { ReceivedTask } from "@/types/api"
import { getReceivedTasks } from "@/lib/api/server"
import { getTranslations } from "next-intl/server"

export default async function ReceivedTasksPage() {
  const commonT = await getTranslations('common')
  const commonTaskT = await getTranslations('taskManagement.common')
  const t = await getTranslations('taskManagement.receivedTask')
  
  const response = await getReceivedTasks()
  const tasks: ReceivedTask[] = response.results


  return (
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
                  <TableHead>{t('from')}</TableHead>
                  <TableHead>{commonTaskT('formType')}</TableHead>
                  <TableHead>{commonTaskT('status')}</TableHead>
                  <TableHead>{commonT('createdAt')}</TableHead>
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
                    <TableCell>{task.created_by}</TableCell>
                    <TableCell>{task.process}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(task.state_type)}>
                        {task.state}
                      </Badge>
                    </TableCell>
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
  )
}
