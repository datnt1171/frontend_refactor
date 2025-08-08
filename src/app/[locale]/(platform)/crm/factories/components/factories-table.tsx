// components/factories/factories-table.tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Link } from "@/i18n/navigation"

interface Factory {
  factory_code: string
  factory_name: string
  is_active: boolean
  has_onsite: boolean
}

interface FactoriesTableProps {
  factories: Factory[]
  count: number
  translations: {
    factoryId: string
    factoryName: string
    status: string
    onsite: string
    active: string
    inactive: string
    yes: string
    no: string
    noDataFound: string
  }
}

export function FactoriesTable({ 
  factories, 
  count, 
  translations 
}: FactoriesTableProps) {
  return (
    <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{translations.factoryId}</TableHead>
            <TableHead>{translations.factoryName}</TableHead>
            <TableHead>{translations.status}</TableHead>
            <TableHead>{translations.onsite}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {count === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                {translations.noDataFound}
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
                    {factory.is_active ? translations.active : translations.inactive}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={factory.has_onsite ? "default" : "destructive"}>
                    {factory.has_onsite ? translations.yes : translations.no}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}