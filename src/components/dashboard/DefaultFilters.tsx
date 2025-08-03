"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarSeparator } from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronRight, RotateCcw } from "lucide-react"

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 5 }, (_, i) => currentYear - i)
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export function DashboardFilters() {
  const [selectedYears, setSelectedYears] = React.useState<number[]>([currentYear])
  const [selectedMonths, setSelectedMonths] = React.useState<string[]>([])
  const [dayRangeStart, setDayRangeStart] = React.useState<string>("1")
  const [dayRangeEnd, setDayRangeEnd] = React.useState<string>("31")
  const [groupBy, setGroupBy] = React.useState<string>("month")

  const handleYearChange = (year: number, checked: boolean) => {
    if (checked) {
      setSelectedYears([...selectedYears, year])
    } else {
      setSelectedYears(selectedYears.filter((y) => y !== year))
    }
  }

  const handleMonthChange = (month: string, checked: boolean) => {
    if (checked) {
      setSelectedMonths([...selectedMonths, month])
    } else {
      setSelectedMonths(selectedMonths.filter((m) => m !== month))
    }
  }

  const handleDayRangeChange = (value: string, type: "start" | "end") => {
    const numValue = Number.parseInt(value)
    if (isNaN(numValue) || numValue < 1 || numValue > 31) return

    if (type === "start") {
      setDayRangeStart(value)
    } else {
      setDayRangeEnd(value)
    }
  }

  const resetFilters = () => {
    setSelectedYears([currentYear])
    setSelectedMonths([])
    setDayRangeStart("1")
    setDayRangeEnd("31")
    setGroupBy("month")
  }

  return (
    <>
      {/* Filter Header */}
      <SidebarGroup>
        <SidebarGroupLabel className="flex items-center justify-between">
          <span>Dashboard Filters</span>
          <Button variant="ghost" size="sm" onClick={resetFilters} className="h-6 w-6 p-0">
            <RotateCcw className="h-3 w-3" />
          </Button>
        </SidebarGroupLabel>
      </SidebarGroup>

      <SidebarSeparator className="mx-0" />

      {/* Year Selection */}
      <SidebarGroup>
        <Collapsible defaultOpen>
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full text-sm">
              Select Years
              <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarGroupContent className="space-y-2">
              {years.map((year) => (
                <div key={year} className="flex items-center space-x-2">
                  <Checkbox
                    id={`year-${year}`}
                    checked={selectedYears.includes(year)}
                    onCheckedChange={(checked) => handleYearChange(year, checked as boolean)}
                  />
                  <Label htmlFor={`year-${year}`} className="text-sm font-normal">
                    {year}
                  </Label>
                </div>
              ))}
            </SidebarGroupContent>
          </CollapsibleContent>
        </Collapsible>
      </SidebarGroup>

      <SidebarSeparator className="mx-0" />

      {/* Month Selection */}
      <SidebarGroup>
        <Collapsible>
          <SidebarGroupLabel asChild>
            <CollapsibleTrigger className="group/label text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full text-sm">
              Select Months
              <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
            </CollapsibleTrigger>
          </SidebarGroupLabel>
          <CollapsibleContent>
            <SidebarGroupContent className="space-y-2">
              {months.map((month) => (
                <div key={month} className="flex items-center space-x-2">
                  <Checkbox
                    id={`month-${month}`}
                    checked={selectedMonths.includes(month)}
                    onCheckedChange={(checked) => handleMonthChange(month, checked as boolean)}
                  />
                  <Label htmlFor={`month-${month}`} className="text-sm font-normal">
                    {month}
                  </Label>
                </div>
              ))}
            </SidebarGroupContent>
          </CollapsibleContent>
        </Collapsible>
      </SidebarGroup>

      <SidebarSeparator className="mx-0" />

      {/* Day Range */}
      <SidebarGroup>
        <SidebarGroupLabel>Day Range</SidebarGroupLabel>
        <SidebarGroupContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="day-start" className="text-xs text-muted-foreground">
              From Day
            </Label>
            <Input
              id="day-start"
              type="number"
              min="1"
              max="31"
              value={dayRangeStart}
              onChange={(e) => handleDayRangeChange(e.target.value, "start")}
              className="h-8"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="day-end" className="text-xs text-muted-foreground">
              To Day
            </Label>
            <Input
              id="day-end"
              type="number"
              min="1"
              max="31"
              value={dayRangeEnd}
              onChange={(e) => handleDayRangeChange(e.target.value, "end")}
              className="h-8"
            />
          </div>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarSeparator className="mx-0" />

      {/* Group By */}
      <SidebarGroup>
        <SidebarGroupLabel>Group By</SidebarGroupLabel>
        <SidebarGroupContent>
          <Select value={groupBy} onValueChange={setGroupBy}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select grouping" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="year">Year</SelectItem>
              <SelectItem value="quarter">Quarter</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="day">Day</SelectItem>
            </SelectContent>
          </Select>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarSeparator className="mx-0" />

      {/* Apply Filters Button */}
      <SidebarGroup>
        <SidebarGroupContent>
          <Button className="w-full" size="sm">
            Apply Filters
          </Button>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}
