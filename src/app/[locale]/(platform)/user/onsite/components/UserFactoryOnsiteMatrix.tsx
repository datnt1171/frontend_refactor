'use client'

import { useState, useMemo } from 'react'
import { HotTable } from '@handsontable/react'
import 'handsontable/dist/handsontable.full.min.css'
import { registerAllModules } from 'handsontable/registry';
import type { UserDetail, UserFactoryOnsite, MonthEnum } from '@/types'
registerAllModules();
const MONTHS: MonthEnum[] = [1,2,3,4,5,6,7,8,9,10,11,12]

// Hardcoded factories (first option = empty string)
const FACTORIES = ['', '30127', '30895.4', '30150.1', '30301', '30567.1']

interface Props {
  users: UserDetail[]
  onsiteData: UserFactoryOnsite[]
}

export function UserFactoryOnsiteMatrix({ users, onsiteData }: Props) {
  // Build initial matrix: [ [username, jan, feb, ..., dec], ... ]
  const initialData = useMemo(() => {
    const assignments: Record<string, Record<MonthEnum, string>> = {}
    users.forEach(u => {
      assignments[u.id] = {
        1:'',2:'',3:'',4:'',5:'',6:'',
        7:'',8:'',9:'',10:'',11:'',12:''
      }
    })
    onsiteData.forEach(o => {
        if (assignments[o.user]) {
            assignments[o.user]![o.month] = o.factory
        }
    })

    return users.map(u => [
        u.username,
        ...MONTHS.map(m => assignments[u.id]![m] ?? '')
    ])
}, [users, onsiteData])

  const [data, setData] = useState(initialData)

  // Column configuration
  const columnSettings = [
    { data: 0, readOnly: true }, // Username column
    ...MONTHS.map((_, i) => ({
      data: i + 1,
    }))
  ]

  return (
    <div className="overflow-x-auto">
      <HotTable
        data={data}
        colHeaders={['Username', ...MONTHS.map(m => `M${m}`)]}
        columns={columnSettings}
        rowHeaders={true}
        width="100%"
        height="auto"
        licenseKey="non-commercial-and-evaluation"
        copyPaste={true}
        dropdownMenu={true}
        contextMenu={true}
        filters={true}
        manualColumnResize={true}
        manualRowResize={true}
        // beforePaste={(data, coords) => {
        //   // Validate pasted data against dropdown options
        //   return data.map(row => 
        //     row.map((cell, colIndex) => {
        //       // Skip validation for username column (index 0)
        //       if (colIndex === 0) return cell;
              
        //       // For dropdown columns, ensure value is in FACTORIES array
        //       if (typeof cell === 'string' && FACTORIES.includes(cell)) {
        //         return cell;
        //       }
              
        //       // If invalid, set to empty string (first factory option)
        //       return '';
        //     })
        //   );
        // }}
        afterChange={(changes) => {
          if (changes) {
            const newData = [...data]
            changes.forEach(([row, prop, oldVal, newVal]) => {
              if (oldVal !== newVal) {
                // Update state
                newData[row]![prop as number] = newVal
              }
            })
            setData(newData)
          }
        }}
      />
    </div>
  )
}