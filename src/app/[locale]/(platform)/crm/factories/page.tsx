import { getFactories } from '@/lib/api/server/factories'
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { getTranslations } from "next-intl/server"


export default async function FactoriesPage() {
  const t = await getTranslations()
  const response = await getFactories({
    is_active: true,
    has_onsite: false,
    limit: 25
  })
  const factories = response.results


  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('crm.factories.factories')}</h1>
        <Button>
          {t('crm.factories.addFactory')}
        </Button>
      </div>

      <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('crm.factories.factoryId')}</TableHead>
              <TableHead>{t('crm.factories.factoryName')}</TableHead>
              <TableHead>{t('crm.factories.status')}</TableHead>
              <TableHead>{t('crm.factories.onsite')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {response.count === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  {t('common.noDataFound')}
                </TableCell>
              </TableRow>
            ) : (
              factories.map((factory) => (
                <TableRow key={factory.factory_code}>
                  <TableCell className="font-medium">
                    {factory.factory_code}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/crm/factories/${factory.factory_code}`}
                      className="text-blue-600 hover:underline"
                    >
                      {factory.factory_name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={factory.is_active ? "default" : "destructive"}>
                      {factory.is_active ? t('common.active') : t('common.inactive')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={factory.has_onsite ? "default" : "destructive"}>
                      {factory.has_onsite ? t('common.yes') : t('common.no')}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}