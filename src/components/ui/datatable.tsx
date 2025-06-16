"use client"

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Filter } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import type { ColumnDef as TanstackColumnDef } from "@tanstack/react-table";

export type BetterColumnDef<TData, TValue> = TanstackColumnDef<TData, TValue> & {
  header: string; // always string for filter button
  headerRenderer?: TanstackColumnDef<TData, TValue>["header"];
};


interface DataTableProps<TData, TValue> {
  columns: BetterColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageSize = 10,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  })
function getHeaderRenderer<TData, TValue>(
  columnDef: ColumnDef<TData, TValue>
): BetterColumnDef<TData, TValue> {
  return columnDef as BetterColumnDef<TData, TValue>;
}
  return (
    <div className="w-full space-y-4">
      {/* Filter Controls */}
      <div className="flex items-center space-x-2">
        {table.getAllColumns()
          .filter((column) => column.getCanFilter())
          .map((column) => {
            const uniqueValues = Array.from(
              new Set(
                table.getPreFilteredRowModel().rows.map((row) => {
                  const value = row.getValue(column.id)
                  return value !== null && value !== undefined && value !== '' ? String(value) : null
                })
              )
            ).filter(Boolean).sort()

            if (uniqueValues.length === 0) return null

            const filterValue = (column.getFilterValue() as string[]) ?? []

            return (
              <DropdownMenu key={column.id}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <Filter className="mr-2 h-4 w-4" />
                    {column.columnDef.header as string}
                    {filterValue.length > 0 && (
                      <span className="ml-1 rounded bg-primary px-1 py-0.5 text-xs text-primary-foreground">
                        {filterValue.length}
                      </span>
                    )}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48 max-h-64 overflow-y-auto">
                  <div className="p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-full justify-start text-xs"
                      onClick={() => column.setFilterValue([])}
                    >
                      Clear Filter
                    </Button>
                  </div>
                  {uniqueValues.map((value) => {
                    const isChecked = filterValue.includes(value as string)
                    return (
                      <DropdownMenuCheckboxItem
                        key={value as string}
                        className="capitalize"
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            column.setFilterValue([...filterValue, value])
                          } else {
                            column.setFilterValue(
                              filterValue.filter((v) => v !== value)
                            )
                          }
                        }}
                      >
                        {value as string}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )
          })}
      </div>

      {/* Table */}
      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-50">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-semibold text-gray-700">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            getHeaderRenderer(header.column.columnDef).headerRenderer 
                            ?? header.column.columnDef.header,
                            header.getContext()
                            )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-gray-700">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          of {table.getFilteredRowModel().rows.length} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: table.getPageCount() }, (_, i) => i)
              .filter(page => 
                page === 0 || 
                page === table.getPageCount() - 1 ||
                (page >= table.getState().pagination.pageIndex - 1 && 
                 page <= table.getState().pagination.pageIndex + 1)
              )
              .map((page, idx, array) => (
                <div key={page}>
                  {idx > 0 && array[idx - 1] !== page - 1 && (
                    <span className="px-2 text-muted-foreground">...</span>
                  )}
                  <Button
                    variant={table.getState().pagination.pageIndex === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => table.setPageIndex(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page + 1}
                  </Button>
                </div>
              ))
            }
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

// Helper function to create sortable header
export function createSortableHeader(title: string) {
  return ({ column }: { column: any }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
      >
        {title}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    )
  }
}