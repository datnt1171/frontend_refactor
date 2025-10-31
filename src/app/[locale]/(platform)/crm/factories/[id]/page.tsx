import { getFactory } from '@/lib/api/server/factories'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTranslations } from "next-intl/server"
import BackButton from "@/components/ui/BackButton"
import { FactoryEditForm } from './FactoryEditForm'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/navigation'

interface FactoryDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function FactoryDetailPage({ params }: FactoryDetailPageProps) {
  const { id } = await params
  const t = await getTranslations()
  const factory = await getFactory(id)

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <BackButton />
        <div>
          <h1 className="text-2xl font-bold">{factory.factory_name}</h1>
          <p className="text-muted-foreground">{t('crm.factories.factoryId')}: {factory.factory_code}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('crm.factories.factories')}</CardTitle>
          </CardHeader>
          <CardContent>
            <FactoryEditForm factory={factory} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t('common.viewDetails')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={`/crm/factories/${id}/blueprints`}>{t('blueprint.blueprint')}</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              {/* <Link href="/view-b">View B</Link> */}
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              {/* <Link href="/view-c">View C</Link> */}
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              {/* <Link href="/view-d">View D</Link> */}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}