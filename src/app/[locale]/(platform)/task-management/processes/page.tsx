import { getTranslations, getLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"
import { getProcesses } from "@/lib/api/server"
import { DataPagination } from "@/components/dashboard/Pagination"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SidebarRightMobileTrigger } from '@/components/dashboard/SidebarRightMobileTrigger';
import { SidebarRight } from "@/components/dashboard/RightSidebar"
import type { PageFilterConfig } from "@/types"
import { redirectWithDefaults } from "@/lib/utils/filter"


interface ProcessPageProps {
  searchParams: Promise<{
    search?: string,
    page?: string
    page_size?: string
  }>
}


export default async function ProcessPage({searchParams}: ProcessPageProps) {

  const params = await searchParams
  const locale = await getLocale()
  const t = await getTranslations('taskManagement.process')

  const defaultParams = {
    page_size: '15',
    page: '1'
  }

  redirectWithDefaults({
    currentParams: params,
    defaultParams,
    pathname: '/task-management/processes',
    locale
  });

  const FilterConfig: PageFilterConfig = {
    showResetButton: true,
    isPaginated: true,

    filters: [
      {
        id: 'search',
        type: 'search',
        label: 'Search Process',
        placeholder: 'Search by process name'
      }
    ]
  }

  const response = await getProcesses(params)
  const processes = response.results

  return (
    <SidebarProvider>
      <SidebarInset className="flex flex-col min-w-0">
        <SidebarRightMobileTrigger />

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t('formTemplates')}</h1>
              <p className="text-muted-foreground mt-2">{t('browseTemplatesDescription')}</p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {processes.map((process) => (
              <Card key={process.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
                    {process.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {process.description || t('formDescriptionFallback', { name: process.name })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('version') + ': ' + process.version}
                  </p>
                </CardContent>
                <CardFooter className="bg-muted/50 pt-3">
                  <Link href={`/task-management/processes/${process.id}`} className="w-full">
                    <Button className="w-full">
                      {t('useForm')}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          {processes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">{t('noFormFound')}</h3>
              <p className="text-muted-foreground mt-2">{t('tryAdjustingSearchOrCreate')}</p>
            </div>
          )}
        </div>
        <DataPagination
          totalCount={response.count}
        />
      </SidebarInset>
      
      <SidebarRight filterConfig={FilterConfig} />
    </SidebarProvider>
  )
}
