import { Building2, CheckCircle, XCircle } from 'lucide-react'
import type { PaginatedFactoryList, Factory } from '@/types'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from '@/i18n/navigation'

interface FactoriesTableProps {
  factories: PaginatedFactoryList
  currentPage: number
  limit: number
  totalPages: number
}

function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge variant={isActive ? "default" : "secondary"} className="gap-1">
      {isActive ? (
        <>
          <CheckCircle className="h-3 w-3" />
          Active
        </>
      ) : (
        <>
          <XCircle className="h-3 w-3" />
          Inactive
        </>
      )}
    </Badge>
  )
}

function OnsiteBadge({ hasOnsite }: { hasOnsite: boolean }) {
  return (
    <Badge variant={hasOnsite ? "outline" : "secondary"} className="gap-1">
      {hasOnsite ? (
        <>
          <CheckCircle className="h-3 w-3" />
          Yes
        </>
      ) : (
        <>
          <XCircle className="h-3 w-3" />
          No
        </>
      )}
    </Badge>
  )
}

export function FactoriesTable({ factories, currentPage, limit }: FactoriesTableProps) {
  const startIndex = (currentPage - 1) * limit + 1
  const endIndex = Math.min(currentPage * limit, factories.count)

  if (!factories.results.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No factories found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableCaption className="py-4">
            Showing {startIndex} to {endIndex} of {factories.count} factories
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Factory Code</TableHead>
              <TableHead>Factory Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Onsite</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {factories.results.map((factory: Factory) => (
              <TableRow key={factory.factory_code}>
                <TableCell className="font-mono text-sm">
                  <Link href={`/crm/factories/${factory.factory_code}`} className="hover:underline">
                    {factory.factory_code}
                  </Link>
                </TableCell>
                <TableCell className="font-medium">
                  {factory.factory_name}
                </TableCell>
                <TableCell>
                  <StatusBadge isActive={factory.is_active} />
                </TableCell>
                <TableCell>
                  <OnsiteBadge hasOnsite={factory.has_onsite} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}