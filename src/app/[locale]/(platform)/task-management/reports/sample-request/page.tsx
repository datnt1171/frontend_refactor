"use client"

import { useEffect, useState } from "react"
import { getSPRReport } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getStatusColor } from "@/lib/utils/format"
import { useTranslations } from "next-intl"
import type { SPRReportRow } from "@/types/api"

export default function SPRReportPage() {
  const [data, setData] = useState<SPRReportRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const t = useTranslations('dashboard')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const rows = await getSPRReport()
        setData(rows)
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch report")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">{t('sprReport.loading')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">{t('sprReport.failedToLoad')}</h3>
        <p className="text-muted-foreground mt-2">{error}</p>
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">{t('sprReport.noData')}</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto py-6 px-2">
      <Table className="border rounded-lg shadow-sm bg-white">
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-700">{t('sprReport.title')}</TableHead>
            <TableHead className="font-semibold text-gray-700">{t('sprReport.createdAt')}</TableHead>
            <TableHead className="font-semibold text-gray-700">{t('sprReport.username')}</TableHead>
            <TableHead className="font-semibold text-gray-700">{t('sprReport.state')}</TableHead>
            <TableHead className="font-semibold text-gray-700">{t('sprReport.customerName')}</TableHead>
            <TableHead className="font-semibold text-gray-700">{t('sprReport.finishingCode')}</TableHead>
            <TableHead className="font-semibold text-gray-700">{t('sprReport.customerColorName')}</TableHead>
            <TableHead className="font-semibold text-gray-700">{t('sprReport.collection')}</TableHead>
            <TableHead className="font-semibold text-gray-700">{t('sprReport.quantity')}</TableHead>
            <TableHead className="font-semibold text-gray-700">{t('sprReport.deadline')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow
              key={row.task_id}
              className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
            >
              <TableCell
                className="text-blue-600 underline cursor-pointer font-medium"
                onClick={() => router.push(`/task-management/tasks/${row.task_id}`)}
                title={t('sprReport.viewTask')}
              >
                {row.title}
              </TableCell>
              <TableCell className="text-gray-700">
                {new Date(row.created_at).toLocaleString()}
              </TableCell>
              <TableCell className="text-gray-700">{row.created_by}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(row.state_type)}>
                  {row.state_type}
                </Badge>
              </TableCell>
              <TableCell className="text-gray-700">{row.customer_name}</TableCell>
              <TableCell className="text-gray-700">{row.finishing_code}</TableCell>
              <TableCell className="text-gray-700">{row.customer_color_name}</TableCell>
              <TableCell className="text-gray-700">{row.collection}</TableCell>
              <TableCell className="text-gray-700 text-center">{row.quantity}</TableCell>
              <TableCell className="text-gray-700">{row.deadline}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
