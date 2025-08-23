import { getFinishingSheets } from '@/lib/api/server'
import { Link } from '@/i18n/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText } from 'lucide-react'

export default async function BlueprintsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const response = await getFinishingSheets(id)
  const sheets = response.results
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Sheets</h1>
        </div>
      </div>

      {sheets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Sheet found</h3>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sheets.map((sheet) => (
            <Card key={sheet.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{sheet.finishing_code}</CardTitle>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex justify-between">
                    <span>Created by:</span>
                    <span className="font-medium">{sheet.created_by}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created at:</span>
                    <span className="font-medium">{sheet.created_at}</span>
                  </div>
                </div>
                <div className="flex">
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`/task-management/task/${id}/sheets/${sheet.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}