import { getDataDetail } from "@/lib/api/server/reports"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function TaskDataDetailPage() {
  const data = await getDataDetail()

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
                  <TableHead>Requester</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((task) => (
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
                    <TableCell>{task.requester_name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}