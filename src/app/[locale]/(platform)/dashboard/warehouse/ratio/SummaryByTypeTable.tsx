'use client'

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { CSVDownloadButton } from '@/components/ui/CSVDownloadButton'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'

interface Props {
  thinnerDetailData: { [key: string]: unknown }[]
  paintDetailData:   { [key: string]: unknown }[]
  monthColumns:      string[]
  thinnerParams:     string[]  // selected thinner product_types from filter
  paintParams:       string[]  // selected paint product_types from filter
}

export function SummaryByTypeTable({
  thinnerDetailData,
  paintDetailData,
  monthColumns,
  thinnerParams,
  paintParams,
}: Props) {
  const t = useTranslations()

  const rows = useMemo(() => {
    // Collect all factory keys
    const factoryMap = new Map<string, { factory_code: string; factory_name: string }>()

    for (const row of [...thinnerDetailData, ...paintDetailData]) {
      const code = String(row.factory_code ?? '')
      if (!factoryMap.has(code)) {
        factoryMap.set(code, {
          factory_code: code,
          factory_name: String(row.factory_name ?? ''),
        })
      }
    }

    return Array.from(factoryMap.values()).map(({ factory_code, factory_name }) => {
      // Sum each thinner param across all months
      const thinnerSums: Record<string, number> = {}
      for (const param of thinnerParams) {
        thinnerSums[param] = thinnerDetailData
          .filter(r => String(r.factory_code) === factory_code && String(r.product_type) === param)
          .reduce((acc, r) => {
            return acc + monthColumns.reduce((s, m) => s + (Number(r[m]) || 0), 0)
          }, 0)
      }

      // Sum each paint param across all months
      const paintSums: Record<string, number> = {}
      for (const param of paintParams) {
        paintSums[param] = paintDetailData
          .filter(r => String(r.factory_code) === factory_code && String(r.product_type) === param)
          .reduce((acc, r) => {
            return acc + monthColumns.reduce((s, m) => s + (Number(r[m]) || 0), 0)
          }, 0)
      }

      const totalThinner = Object.values(thinnerSums).reduce((a, b) => a + b, 0)
      const totalPaint   = Object.values(paintSums).reduce((a, b) => a + b, 0)

      let ratio = '0'
      if (totalThinner > 0 && totalPaint > 0) {
        ratio = `${(totalThinner / totalPaint).toFixed(1)}:1`
      } else if (totalThinner > 0) {
        ratio = `${totalThinner}:0`
      } else if (totalPaint > 0) {
        ratio = `0:${totalPaint}`
      }

      return { factory_code, factory_name, thinnerSums, paintSums, ratio }
    })
  }, [thinnerDetailData, paintDetailData, monthColumns, thinnerParams, paintParams])

  const csvColumns = [
    { key: 'factory_code', header: t('crm.factories.factoryId') },
    { key: 'factory_name', header: t('crm.factories.factoryName') },
    ...thinnerParams.map(p => ({ key: `thinner__${p}`, header: p })),
    ...paintParams.map(p => ({ key: `paint__${p}`,   header: p })),
    { key: 'ratio', header: t('product.ratio') },
  ]

  const csvData = rows.map(r => ({
    factory_code: r.factory_code,
    factory_name: r.factory_name,
    ...Object.fromEntries(thinnerParams.map(p => [`thinner__${p}`, r.thinnerSums[p] ?? 0])),
    ...Object.fromEntries(paintParams.map(p =>   [`paint__${p}`,   r.paintSums[p]   ?? 0])),
    ratio: r.ratio,
  }))

  return (
    <div className="rounded-md border bg-white shadow-sm w-full overflow-x-auto mb-4">
      <div className="flex items-center justify-between px-4 py-2">
        <h3 className="font-semibold">{t('product.thinner')} / {t('product.paint')} summary</h3>
        <CSVDownloadButton
          data={csvData}
          columns={csvColumns}
          filename="summary-by-type"
          buttonText={t('common.download')}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2}>{t('crm.factories.factoryId')}</TableHead>
            <TableHead rowSpan={2}>{t('crm.factories.factoryName')}</TableHead>
            {thinnerParams.length > 0 && (
              <TableHead colSpan={thinnerParams.length} className="text-center border-l">
                {t('product.thinner')}
              </TableHead>
            )}
            {paintParams.length > 0 && (
              <TableHead colSpan={paintParams.length} className="text-center border-l">
                {t('product.paint')}
              </TableHead>
            )}
            <TableHead rowSpan={2} className="text-center border-l">
              {t('product.ratio')}
            </TableHead>
          </TableRow>
          <TableRow>
            {thinnerParams.map(p => (
              <TableHead key={p} className="text-center border-l text-xs">{p}</TableHead>
            ))}
            {paintParams.map(p => (
              <TableHead key={p} className="text-center border-l text-xs">{p}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow key={idx}>
              <TableCell>{row.factory_code}</TableCell>
              <TableCell>{row.factory_name}</TableCell>
              {thinnerParams.map(p => (
                <TableCell key={p} className="text-right border-l">
                  {(row.thinnerSums[p] ?? 0).toLocaleString()}
                </TableCell>
              ))}
              {paintParams.map(p => (
                <TableCell key={p} className="text-right border-l">
                  {(row.paintSums[p] ?? 0).toLocaleString()}
                </TableCell>
              ))}
              <TableCell className="text-center border-l font-medium">
                {row.ratio}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}