import { getFactory } from '@/lib/api/server/factories'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getTranslations } from "next-intl/server"
import BackButton from "@/components/ui/BackButton";
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
        <div className="flex space-x-2">
          <Button>
            {t('common.edit')}
          </Button>
          <Button>
            Blueprint
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('crm.factories.factories')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t('crm.factories.factoryId')}</label>
              <p className="mt-1">{factory.factory_code}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t('crm.factories.factoryName')}</label>
              <p className="mt-1">{factory.factory_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t('crm.factories.status')}</label>
              <div className="mt-1">
                <Badge variant={factory.is_active ? "default" : "destructive"}>
                  {factory.is_active ? t('common.active') : t('common.inactive')}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">{t('crm.factories.onsite')}</label>
              <div className="mt-1">
                <Badge variant={factory.has_onsite ? "secondary" : "outline"}>
                  {factory.has_onsite ? t('common.yes') : t('common.no')}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <BackButton />
      </div>
    </div>
  )
}