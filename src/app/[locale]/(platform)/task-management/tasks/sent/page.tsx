import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Plus } from "lucide-react"
import { getSentTasks } from "@/lib/api/server"
import { getStatusColor } from "@/lib/utils/format"
import { getTranslations } from "next-intl/server"
import { formatDateToUTC7 } from "@/lib/utils/date"

export default async function SentTasksPage() {
  const t = await getTranslations('dashboard')
  const response = await getSentTasks()
  const tasks = response.results

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('sentTask.sentTasks')}</h1>
          <p className="text-muted-foreground mt-2">{t('sentTask.sentTasksDescription')}</p>
        </div>
        <Link href="/task-management/processes">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('sentTask.createNewTask')}
          </Button>
        </Link>
      </div>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>{t('sentTask.yourSentTasks')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('sentTask.id')}</TableHead>
                  <TableHead>{t('sentTask.recipient')}</TableHead>
                  <TableHead>{t('sentTask.formType')}</TableHead>
                  <TableHead>{t('sentTask.sentDate')}</TableHead>
                  <TableHead>{t('sentTask.status')}</TableHead>
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
                    <TableCell>{task.recipient}</TableCell>
                    <TableCell>{task.process}</TableCell>
                    <TableCell>{ formatDateToUTC7(task.created_at) }</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(task.state_type)}>
                        {task.state}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">{t('sentTask.openMenu')}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link href={`/task-management/tasks/${task.id}`}>{t('sentTask.viewDetails')}</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>{t('sentTask.sendReminder')}</DropdownMenuItem>
                          <DropdownMenuItem>{t('sentTask.duplicate')}</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-lg font-medium">{t('sentTask.noTasksFound')}</h3>
                <p className="text-muted-foreground mt-2">{t('sentTask.tryAdjustingSearchOrCreateTask')}</p>
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  )
}
