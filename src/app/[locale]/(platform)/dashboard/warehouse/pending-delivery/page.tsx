import ExcelDashboard from "./components/ExcelUpload"
import { getTranslations } from "next-intl/server"

export default async function Page() {
  const t = await getTranslations()
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {t('dashboard.sideBar.pendingDelivery')}
      </h1>
      <ExcelDashboard />
    </div>
  )
}