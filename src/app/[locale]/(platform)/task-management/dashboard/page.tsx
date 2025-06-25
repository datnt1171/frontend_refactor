"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { FileText, Send, Inbox, Clock } from "lucide-react"
import { getProcesses, getSentTasks, getReceivedTasks } from "@/lib/api/"
import type { ProcessList, ReceivedTask, SentTask } from "@/types/api"
import { useTranslations } from "next-intl"

export default function Dashboard() {

  // Separate states for each data type
  const [processes, setProcesses] = useState<ProcessList[]>([])
  const [sentTasks, setSentTasks] = useState<SentTask[]>([])
  const [receivedTasks, setReceivedTasks] = useState<ReceivedTask[]>([])

  useEffect(() => {
    async function fetchDashboardData() {
        const [processesRes, sentTasksRes, receivedTasksRes] = await Promise.all([
          getProcesses(),
          getSentTasks(),
          getReceivedTasks(),
        ]);
        setProcesses(processesRes.results)
        setSentTasks(sentTasksRes)
        setReceivedTasks(receivedTasksRes)
    }

    fetchDashboardData()
  }, [])

  // Compute dashboard counts from state
  const processCount = processes.length
  const sentTasksCount = sentTasks.length
  const receivedTasksCount = receivedTasks.length
  const sentTasksDoneCount = sentTasks.filter(task => task.state_type === "closed").length
  const sentTaskT = useTranslations('taskManagement.sentTask')
  const receivedTaskT = useTranslations('taskManagement.receivedTask')
  const t = useTranslations('taskManagement.dashboard')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground mt-2">{t('welcome')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex items-center justify-between pb-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">{t('formTemplate')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="text-2xl font-bold">{processCount}</div>
            <p className="text-xs text-muted-foreground">{t('availableTemplates')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-4">
            <div className="flex items-center space-x-2">
              <Send className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">{sentTaskT('title')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="text-2xl font-bold">{sentTasksCount}</div>
            <p className="text-xs text-muted-foreground">{sentTaskT('description')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-4">
            <div className="flex items-center space-x-2">
              <Inbox className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">{receivedTaskT('title')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="text-2xl font-bold">{receivedTasksCount}</div>
            <p className="text-xs text-muted-foreground">{receivedTaskT('description')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between pb-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-sm font-medium">{t('completedTask')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="text-2xl font-bold">{sentTasksDoneCount}</div>
            <p className="text-xs text-muted-foreground">{t('completedTaskDescription')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/task-management/processes">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Browse Form Templates
              </Button>
            </Link>
            <Link href="/task-management/tasks/sent">
              <Button className="w-full justify-start" variant="outline">
                <Send className="mr-2 h-4 w-4" />
                View Sent Tasks
              </Button>
            </Link>
            <Link href="/task-management/tasks/received">
              <Button className="w-full justify-start" variant="outline">
                <Inbox className="mr-2 h-4 w-4" />
                View Received Tasks
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest task interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Project Update Form submitted</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New task received: Weekly Report</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-orange-500"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Expense Report needs revision</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

