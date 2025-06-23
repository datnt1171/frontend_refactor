import { getSPRReport } from "@/lib/api/server"
import { getTranslations } from "next-intl/server"
import SPRReportTable from "@/components/reports/sprTable"

export default async function SPRReportPage() {
  const [data, t] = await Promise.all([
    getSPRReport(),
    getTranslations('dashboard')
  ])

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">{t('sprReport.noData')}</p>
      </div>
    )
  }

  return (
    <div className="py-6 px-2">
      <h1 className="text-2xl font-bold mb-6">{t('sprReport.title')}</h1>
      <SPRReportTable data={data} />
    </div>
  )
}