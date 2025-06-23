import { getTranslations } from 'next-intl/server'
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { getProcesses } from "@/lib/api/server"
import type { ProcessList } from "@/types/api"

export default async function FormsPage() {
  const t = await getTranslations('dashboard')
  const response = await getProcesses()
  const processes: ProcessList[] = response.results

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('process.formTemplates')}</h1>
          <p className="text-muted-foreground mt-2">{t('process.browseTemplatesDescription')}</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {processes.map((process) => (
          <Card key={process.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                {process.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {process.description || t('formTemplateFor', { name: process.name })}
              </p>
            </CardContent>
            <CardFooter className="bg-muted/50 pt-3">
              <Link href={`/task-management/processes/${process.id}`} className="w-full">
                <Button className="w-full">
                  {t('process.useTemplate')}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {processes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">{t('process.noTemplatesFound')}</h3>
          <p className="text-muted-foreground mt-2">{t('process.tryAdjustingSearchOrCreate')}</p>
        </div>
      )}
    </div>
  )
}
