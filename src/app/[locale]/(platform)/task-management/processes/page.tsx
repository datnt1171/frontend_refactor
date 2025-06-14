"use client"

import { useState, useEffect } from "react"
import { useTranslations } from 'next-intl'
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FileText, Search, Loader2 } from "lucide-react"
import { getProcesses } from "@/lib/api"
import type { ProcessList } from "@/types/api"

export default function FormsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [processes, setProcesses] = useState<ProcessList[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const t = useTranslations('dashboard')

  useEffect(() => {
    fetchProcesses()
  }, [])

  const fetchProcesses = async () => {
    setIsLoading(true)
    try {
      const response = await getProcesses()
      setProcesses(response.data.results)
    } catch (err: any) {
      console.error("Error fetching processes:", err)
      setError(err.response?.data?.error || "Failed to load form templates")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProcesses = processes.filter(
    (process) =>
      process.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (process.description && process.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('process.formTemplates')}</h1>
          <p className="text-muted-foreground mt-2">{t('process.browseTemplatesDescription')}</p>
        </div>
      </div>

      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder={t('process.searchTemplatesPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
        <Button type="submit" size="icon" variant="ghost">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{t('process.loadingFormTemplates')}</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-lg font-medium text-destructive">{t('process.errorLoadingTemplates')}</h3>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchProcesses}>
            {t('process.retry')}
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProcesses.map((process) => (
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
      )}

      {!isLoading && !error && filteredProcesses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">{t('process.noTemplatesFound')}</h3>
          <p className="text-muted-foreground mt-2">{t('process.tryAdjustingSearchOrCreate')}</p>
        </div>
      )}
    </div>
  )
}
