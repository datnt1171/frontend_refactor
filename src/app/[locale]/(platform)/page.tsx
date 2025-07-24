import { externalApps } from "@/constants/navigation"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"

export default async function PlatformHome() {
  const t = await getTranslations()
  
  return (
    <main className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {t('home.title')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t('home.subtitle')}
        </p>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {externalApps.map((app) => {
          const Icon = app.icon
          return (
            <Link key={app.href} href={app.href} className="block group">
              <Card className="hover:shadow-lg transition-all duration-200 group-hover:scale-105 h-full">
                <CardHeader className="flex flex-col items-center space-y-4 text-center p-6">
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-lg font-semibold">
                      {t(app.nameKey)}
                    </CardTitle>
                    {app.descriptionKey && (
                      <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                        {t(app.descriptionKey)}
                      </CardDescription>
                    )}
                  </div>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>
    </main>
  )
}