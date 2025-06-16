"use client"

import { useState, useEffect } from "react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, Plus, Loader2 } from "lucide-react"
import { getSentTasks } from "@/lib/api"
import { getStatusColor } from "@/lib/utils/format"
import { useTranslations } from 'next-intl'
import type { SentTask } from "@/types/api"
import { formatDateToUTC7 } from "@/lib/utils/date"

export default function SentTasksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [tasks, setTasks] = useState<SentTask[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const t = useTranslations('dashboard')

  useEffect(() => {
    fetchSentTasks()
  }, [])

  const fetchSentTasks = async () => {
    setIsLoading(true)
    try {
      const response = await getSentTasks()
      setTasks(response)
    } catch (err: any) {
      console.error("Error fetching sent tasks:", err)
      setError(err.response?.data?.error || "Failed to load sent tasks")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.process.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder={t('sentTask.searchTasksPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
        <Button type="button" size="icon" variant="ghost">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t('sentTask.loadingSentTasks')}</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-lg font-medium text-destructive">{t('sentTask.errorLoadingTasks')}</h3>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchSentTasks}>
            {t('sentTask.retry')}
          </Button>
        </div>
      ) : (
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
                {filteredTasks.map((task) => (
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

            {filteredTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-lg font-medium">{t('sentTask.noTasksFound')}</h3>
                <p className="text-muted-foreground mt-2">{t('sentTask.tryAdjustingSearchOrCreateTask')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
