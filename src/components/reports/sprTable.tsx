"use client"

import type { BetterColumnDef } from "@/components/ui/datatable"
import { Link } from "@/i18n/navigation"
import { Badge } from "@/components/ui/badge"
import { getStatusColor } from "@/lib/utils/format"
import { useTranslations } from "next-intl"
import type { SPRReportRow } from "@/types/api"
import { formatDateToUTC7 } from "@/lib/utils/date"
import { DataTable, createSortableHeader } from "@/components/ui/datatable"

interface SPRReportTableProps {
  data: SPRReportRow[]
}

export default function SPRReportTable({ data }: SPRReportTableProps) {
  const t = useTranslations('dashboard')

  // Define columns for TanStack Table
  const columns: BetterColumnDef<SPRReportRow, unknown>[] = [
    {
      accessorKey: "title",
      header: t('sprReport.title'),
      headerRenderer: createSortableHeader(t('sprReport.title')),
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => (
        <Link 
          href={`/task-management/tasks/${row.original.task_id}`} 
          className="hover:underline font-medium text-black-600 hover:text-black-800"
          title={t('sprReport.viewTask')}
        >
          {row.getValue("title")}
        </Link>
      ),
    },
    {
      accessorKey: "customer_name",
      header: t('sprReport.customerName'),
      headerRenderer: createSortableHeader(t('sprReport.customerName')),
      enableSorting: false,
      enableColumnFilter: true,
      filterFn: (row, id, value) => {
        if (!value?.length) return true
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "finishing_code",
      header: t('sprReport.finishingCode'),
      headerRenderer: createSortableHeader(t('sprReport.finishingCode')),
      enableSorting: false,
      enableColumnFilter: true,
      filterFn: (row, id, value) => {
        if (!value?.length) return true
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "customer_color_name",
      header: t('sprReport.customerColorName'),
      headerRenderer: createSortableHeader(t('sprReport.customerColorName')),
      enableSorting: false,
      enableColumnFilter: true,
      filterFn: (row, id, value) => {
        if (!value?.length) return true
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "collection",
      header: t('sprReport.collection'),
      headerRenderer: createSortableHeader(t('sprReport.collection')),
      enableSorting: false,
      enableColumnFilter: true,
      filterFn: (row, id, value) => {
        if (!value?.length) return true
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "quantity",
      header: t('sprReport.quantity'),
      headerRenderer: createSortableHeader(t('sprReport.quantity')),
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => (
        <div className="text-center">
          {row.getValue("quantity")}
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: t('sprReport.createdAt'),
      headerRenderer: createSortableHeader(t('sprReport.createdAt')),
      enableSorting: true,
      enableColumnFilter: false,
      cell: ({ row }) => formatDateToUTC7(row.getValue("created_at")),
    },
    {
      accessorKey: "deadline",
      header: t('sprReport.deadline'),
      headerRenderer: createSortableHeader(t('sprReport.deadline')),
      enableSorting: true,
      enableColumnFilter: false,
    },
    {
      accessorKey: "created_by",
      header: t('sprReport.username'),
      headerRenderer: createSortableHeader(t('sprReport.username')),
      enableSorting: false,
      enableColumnFilter: true,
      filterFn: (row, id, value) => {
        if (!value?.length) return true
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "state_type",
      header: t('sprReport.state'),
      headerRenderer: createSortableHeader(t('sprReport.state')),
      enableSorting: false,
      enableColumnFilter: true,
      cell: ({ row }) => {
        const status = row.getValue("state_type") as string
        return (
          <Badge variant="outline" className={getStatusColor(status)}>
            {status}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        if (!value?.length) return true
        return value.includes(row.getValue(id))
      },
    },
  ]

  return <DataTable columns={columns} data={data} pageSize={20} />
}