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
  const commonT = useTranslations('common')
  const userT = useTranslations('user')
  const t = useTranslations('dashboard.sprReport')

  // Define columns for TanStack Table
  const columns: BetterColumnDef<SPRReportRow, unknown>[] = [
    {
      accessorKey: "title",
      header: commonT('id'),
      headerRenderer: createSortableHeader(commonT('id')),
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => (
        <Link 
          href={`/task-management/tasks/${row.original.task_id}`} 
          className="hover:underline font-medium text-black-600 hover:text-black-800"
          title={commonT('viewDetails')}
        >
          {row.getValue("title")}
        </Link>
      ),
    },
    {
      accessorKey: "customer_name",
      header: t('customerName'),
      headerRenderer: createSortableHeader(t('customerName')),
      enableSorting: false,
      enableColumnFilter: true,
      filterFn: (row, id, value) => {
        if (!value?.length) return true
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "finishing_code",
      header: t('finishingCode'),
      headerRenderer: createSortableHeader(t('finishingCode')),
      enableSorting: false,
      enableColumnFilter: true,
      filterFn: (row, id, value) => {
        if (!value?.length) return true
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "customer_color_name",
      header: t('customerColorName'),
      headerRenderer: createSortableHeader(t('customerColorName')),
      enableSorting: false,
      enableColumnFilter: true,
      filterFn: (row, id, value) => {
        if (!value?.length) return true
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "collection",
      header: t('collection'),
      headerRenderer: createSortableHeader(t('collection')),
      enableSorting: false,
      enableColumnFilter: true,
      filterFn: (row, id, value) => {
        if (!value?.length) return true
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "quantity",
      header: t('quantity'),
      headerRenderer: createSortableHeader(t('quantity')),
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
      header: commonT('createdAt'),
      headerRenderer: createSortableHeader(commonT('createdAt')),
      enableSorting: true,
      enableColumnFilter: false,
      cell: ({ row }) => formatDateToUTC7(row.getValue("created_at")),
    },
    {
      accessorKey: "deadline",
      header: t('deadline'),
      headerRenderer: createSortableHeader(t('deadline')),
      enableSorting: true,
      enableColumnFilter: false,
    },
    {
      accessorKey: "created_by",
      header: userT('username'),
      headerRenderer: createSortableHeader(userT('username')),
      enableSorting: false,
      enableColumnFilter: true,
      filterFn: (row, id, value) => {
        if (!value?.length) return true
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "state_type",
      header: t('state'),
      headerRenderer: createSortableHeader(t('state')),
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