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
import { ArrowUpDown, ChevronDown, Filter, X } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
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

  // Get active filters for display
  const activeFilters = table.getAllColumns()
    .filter((column) => column.getCanFilter() && column.getFilterValue())
    .map((column) => ({
      id: column.id,
      label: column.columnDef.header as string,
      values: column.getFilterValue() as string[],
      column,
    }))

  return (
    <div className="w-full space-y-4">
      {/* Filter Controls - Responsive Layout */}
      <div className="space-y-3">
        {/* Filter Buttons - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:flex xl:flex-wrap gap-2">
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
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-9 justify-start text-left w-full xl:w-auto min-w-0"
                    >
                      <Filter className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="truncate">
                        {column.columnDef.header as string}
                      </span>
                      {filterValue.length > 0 && (
                        <span className="ml-1 rounded bg-primary px-1.5 py-0.5 text-xs text-primary-foreground flex-shrink-0">
                          {filterValue.length}
                        </span>
                      )}
                      <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 max-h-64 overflow-y-auto">
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
                          <span className="truncate">{value as string}</span>
                        </DropdownMenuCheckboxItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            })}
        </div>

        {/* Active Filters Display */}
        {activeFilters.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Active Filters:</div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <div key={filter.id} className="space-y-1">
                  {filter.values.map((value) => (
                    <div
                      key={`${filter.id}-${value}`}
                      className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800"
                    >
                      <span className="max-w-24 truncate">
                        {filter.label}: {value}
                      </span>
                      <button
                        onClick={() => {
                          const currentValues = filter.column.getFilterValue() as string[]
                          filter.column.setFilterValue(
                            currentValues.filter((v) => v !== value)
                          )
                        }}
                        className="ml-1 rounded-full hover:bg-blue-200 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ))}
              {activeFilters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => table.resetColumnFilters()}
                  className="h-6 px-2 text-xs text-gray-600 hover:text-gray-900"
                >
                  Clear All
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Table - Responsive with horizontal scroll */}
      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-gray-50">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="font-semibold text-gray-700 whitespace-nowrap">
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
                      <TableCell key={cell.id} className="text-gray-700 whitespace-nowrap">
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
      </div>

      {/* Pagination - Responsive */}
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2 py-4">
        <div className="text-sm text-muted-foreground order-2 sm:order-1">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          of {table.getFilteredRowModel().rows.length} results
        </div>
        <div className="flex items-center space-x-2 order-1 sm:order-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="hidden sm:inline-flex"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="sm:hidden"
          >
            Prev
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
                    <span className="px-2 text-muted-foreground hidden sm:inline">...</span>
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