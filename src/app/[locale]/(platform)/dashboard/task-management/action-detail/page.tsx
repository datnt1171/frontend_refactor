import { getActionDetail } from "@/lib/api/server/reports"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"


const formatDateTime = (dateTime: string) => {
  return new Date(dateTime).toLocaleString()
}

export default async function TaskActionDetailPage() {
  const data = await getActionDetail()

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Task Action Detail</CardTitle>
          <CardDescription>
            History of all task actions ({data.length} actions)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task Title</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Action By</TableHead>
                  <TableHead>Action Date</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Created By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((action, index) => (
                  <TableRow key={`${action.task_id}-${index}`}>
                    <TableCell className="font-medium">{action.title}</TableCell>
                    <TableCell>{action.action}</TableCell>
                    <TableCell>{action.state}</TableCell>
                    <TableCell>{action.action_created_by}</TableCell>
                    <TableCell>{formatDateTime(action.action_created_at)}</TableCell>
                    <TableCell>
                      {action.duration}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={action.comment}>
                        {action.comment}
                      </div>
                    </TableCell>
                    <TableCell>{action.created_by}</TableCell>
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