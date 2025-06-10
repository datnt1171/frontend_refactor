"use client"

import { useState, useEffect } from "react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, Loader2 } from "lucide-react"
import { getReceivedTasks } from "@/lib/api"
import { getStatusColor } from "@/lib/utils/format"
import { formatDateToUTC7 } from "@/lib/utils/date"
import { useTranslations } from 'next-intl'

interface Task {
  id: string
  title: string
  process: string
  state: string
  state_type: string
  created_at: string
  created_by: string
  action?: string
}

export default function ReceivedTasksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const t = useTranslations('dashboard')

  useEffect(() => {
    fetchReceivedTasks()
  }, [])

  const fetchReceivedTasks = async () => {
    setIsLoading(true)
    try {
      const response = await getReceivedTasks()
      setTasks(response.data.results)
    } catch (err: any) {
      console.error("Error fetching received tasks:", err)
      setError(err.response?.data?.error || "Failed to load received tasks")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.process.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.created_by.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('receivedTask.receivedTasks')}</h1>
        <p className="text-muted-foreground mt-2">{t('receivedTask.receivedTasksDescription')}</p>
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder={t('receivedTask.searchTasksPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
        <Button type="submit" size="icon" variant="ghost">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t('receivedTask.loadingReceivedTasks')}</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-lg font-medium text-destructive">{t('receivedTask.errorLoadingTasks')}</h3>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchReceivedTasks}>
            {t('receivedTask.retry')}
          </Button>
        </div>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>{t('receivedTask.yourAssignedTasks')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('receivedTask.id')}</TableHead>
                  <TableHead>{t('receivedTask.from')}</TableHead>
                  <TableHead>{t('receivedTask.formType')}</TableHead>
                  <TableHead>{t('receivedTask.status')}</TableHead>
                  <TableHead>{t('receivedTask.createdAt')}</TableHead>
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
                            <span className="sr-only">{t('receivedTask.openMenu')}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link href={`/task-management/tasks/${task.id}`}>{t('receivedTask.viewDetails')}</Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-lg font-medium">{t('receivedTask.noTasksFound')}</h3>
                <p className="text-muted-foreground mt-2">{t('receivedTask.noAssignedTasks')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
