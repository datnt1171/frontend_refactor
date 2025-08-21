import { getFactory } from '@/lib/api/server/factories'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTranslations } from "next-intl/server"
import BackButton from "@/components/ui/BackButton"
import { FactoryEditForm } from './factory-edit-form'
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
      <div className="flex items-center justify-between mb-6">
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
            <FactoryEditForm 
              factory={factory}
              translations={{
                factoryId: t('crm.factories.factoryId'),
                factoryName: t('crm.factories.factoryName'),
                status: t('crm.factories.status'),
                onsite: t('crm.factories.onsite'),
                active: t('common.active'),
                inactive: t('common.inactive'),
                yes: t('common.yes'),
                no: t('common.no'),
                edit: t('common.edit'),
                save: t('common.save'),
                cancel: t('common.cancel'),
                processing: t('common.processing')
              }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Action</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={`/crm/factories/${id}/blueprints`}>Blueprint</Link>
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

      <div className="mt-6">
        <BackButton />
      </div>
    </div>
  )
}