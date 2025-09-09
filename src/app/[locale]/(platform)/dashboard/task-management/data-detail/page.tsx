import { getDataDetail } from "@/lib/api/server/reports"
import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskDataDetail } from "@/types"


export default async function TaskDataDetailPage() {
  const data = await getDataDetail()

  // Group and sort data
  const groupedData = data
    .sort((a, b) => {
      if (a.name_of_customer !== b.name_of_customer) {
        return a.name_of_customer.localeCompare(b.name_of_customer)
      }
      return a.sample_type.localeCompare(b.sample_type)
    })
    .reduce((acc: { [key: string]: TaskDataDetail[] }, task) => {
      const groupKey = `${task.name_of_customer}|${task.sample_type}`
      if (!acc[groupKey]) {
        acc[groupKey] = []
      }
      acc[groupKey].push(task)
      return acc
    }, {})

  // Calculate totals for each group
  const groupTotals = Object.entries(groupedData).map(([groupKey, tasks]) => {
    const total = tasks.reduce((sum, task) => {
      const qty = parseInt(task.quantity_requirement) || 0
      return sum + qty
    }, 0)
    return { groupKey, total }
  })

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Task Data Detail</CardTitle>
          <CardDescription>
            Overview of all task details ({data.length} tasks)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Retailer</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Substrate</TableHead>
                  <TableHead>Collection</TableHead>
                  <TableHead>Sample Type</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(groupedData).map(([groupKey, tasks]) => {
                  const groupTotal = groupTotals.find(g => g.groupKey === groupKey)?.total || 0
                  
                  return (
                    <React.Fragment key={groupKey}>
                      {tasks.map((task, index) => (
                        <TableRow key={task.task_id}>
                          <TableCell className="font-medium">{task.title}</TableCell>
                          <TableCell>{task.name_of_customer}</TableCell>
                          <TableCell>{task.state}</TableCell>
                          <TableCell>{new Date(task.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>{task.retailer}</TableCell>
                          <TableCell>{task.customer_color_name}</TableCell>
                          <TableCell>{task.type_of_substrate}</TableCell>
                          <TableCell>{task.collection}</TableCell>
                          <TableCell>{task.sample_type}</TableCell>
                          <TableCell>{task.deadline_request}</TableCell>
                          <TableCell>{task.quantity_requirement}</TableCell>
                        </TableRow>
                      ))}
                      {/* Subtotal row */}
                      {tasks[0] && (
                        <TableRow className="bg-gray-50 font-semibold border-t-2">
                          <TableCell colSpan={10} className="text-right">
                            Tổng ({tasks[0].name_of_customer} - {tasks[0].sample_type}):
                          </TableCell>
                          <TableCell className="font-bold">{groupTotal}</TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}