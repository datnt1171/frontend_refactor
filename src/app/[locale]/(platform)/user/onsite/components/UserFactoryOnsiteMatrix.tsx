'use client'

import { useState, useMemo } from 'react'
import { HotTable } from '@handsontable/react-wrapper'
import 'handsontable/dist/handsontable.full.min.css'
import { registerAllModules } from 'handsontable/registry';
import Handsontable from 'handsontable';
import { CreateUpdateOnsite } from '@/lib/api/client/api'
import type { UserDetail, UserFactoryOnsite, MonthEnum, Factory } from '@/types'
import { Button } from '@/components/ui/button';
import { useRouter } from '@/i18n/navigation';

registerAllModules();
const MONTHS: MonthEnum[] = [1,2,3,4,5,6,7,8,9,10,11,12]

interface Props {
  users: UserDetail[]
  onsiteData: UserFactoryOnsite[]
  factories: Factory[]
}

interface Change {
  userId: string
  month: MonthEnum
  factory: string
  originalValue: string
}

export function UserFactoryOnsiteMatrix({ users, onsiteData, factories }: Props) {
  const router = useRouter()
  
  // Create mapping objects for factory code <-> name conversion
  const { factoryCodeToName, factoryNameToCode, dropdownSource } = useMemo(() => {
    const codeToName: Record<string, string> = { '': '' } // Empty option
    const nameToCode: Record<string, string> = { '': '' } // Empty option
    const source = [''] // Start with empty option
    
    factories.forEach(factory => {
      codeToName[factory.factory_code] = factory.factory_name
      nameToCode[factory.factory_name] = factory.factory_code
      source.push(factory.factory_name)
    })
    
    return {
      factoryCodeToName: codeToName,
      factoryNameToCode: nameToCode,
      dropdownSource: source
    }
  }, [factories])

  const { initialData, originalAssignments } = useMemo(() => {
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

    // Convert factory codes to names for display
    const tableData = users.map(u => [
        `${u.last_name} ${u.first_name}`,
        ...MONTHS.map(m => {
          const factoryCode = assignments[u.id]![m] ?? ''
          return factoryCodeToName[factoryCode] ?? ''
        })
    ])

    return {
      initialData: tableData,
      originalAssignments: assignments
    }
  }, [users, onsiteData, factoryCodeToName])

  const [data, setData] = useState(initialData)
  const [changes, setChanges] = useState<Change[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // Custom renderer for highlighting changes from previous month
  const highlightChangeRenderer = (monthIndex: number) => {
    return function(this: any, instance: any, td: HTMLTableCellElement, row: number, col: number, prop: any, value: any, cellProperties: any) {
      // Apply default dropdown renderer first
      Handsontable.renderers.DropdownRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);
      
      // Skip highlighting for first month (no previous month to compare)
      if (monthIndex === 0) return
      
      const currentValue = value || ''
      const prevMonthValue = data[row]?.[monthIndex] || '' // Previous month column
      
      // Highlight if current month is different from previous month and both are not empty
      if (currentValue && prevMonthValue && currentValue !== prevMonthValue) {
        td.style.backgroundColor = '#fef3c7' // Light yellow background
        td.style.borderLeft = '3px solid #f59e0b' // Orange left border
        td.title = `Changed from previous month: ${prevMonthValue} → ${currentValue}`
      } else {
        // Reset styles if no change
        td.style.backgroundColor = ''
        td.style.borderLeft = ''
        td.title = ''
      }
    }
  }

  // Column configuration with dropdown for factory columns
  const columnSettings = [
    { 
      data: 0, 
      readOnly: true,
      type: 'text'
    }, // Username column
    ...MONTHS.map((_, i) => ({
      data: i + 1,
      type: 'dropdown',
      source: dropdownSource,
      strict: true,
      allowInvalid: false,
      trimDropdown: false,
      renderer: highlightChangeRenderer(i)
    }))
  ]

  const handleSaveChanges = async () => {
    if (changes.length === 0) {
      alert('No changes to save')
      return
    }

    setIsSaving(true)
    try {
      // Get current year from search params or default to current year
      const currentYear = new Date().getFullYear()
      
      // Convert changes to API format (factory codes, not names)
      const apiData: UserFactoryOnsite[] = changes.map(change => ({
        id: '', // Temporary empty id for bulk operations
        user: change.userId,
        year: currentYear,
        month: change.month,
        factory: change.factory // This is already the factory code
      }))

      await CreateUpdateOnsite(apiData)
      
      // Clear changes after successful save
      setChanges([])
      alert('Changes saved successfully!')
      router.refresh()
    } catch (error) {
      console.error('Failed to save changes:', error)
      alert('Failed to save changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDiscardChanges = () => {
    if (changes.length === 0) return
    
    if (confirm('Are you sure you want to discard all changes?')) {
      setData(initialData)
      setChanges([])
    }
  }

  return (
    <div className="space-y-4">
      {/* Action buttons */}
      <div className="flex items-center gap-4">
        <Button
          onClick={handleSaveChanges}
          disabled={changes.length === 0 || isSaving}
        >
          {isSaving
            ? "Saving..."
            : `Save Changes ${changes.length > 0 ? `(${changes.length})` : ""}`}
        </Button>

        <Button
          variant="destructive"
          onClick={handleDiscardChanges}
          disabled={changes.length === 0}
        >
          Discard Changes
        </Button>

        {changes.length > 0 && (
          <span className="text-sm text-orange-600 font-medium">
            {changes.length} unsaved change{changes.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Table */}
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
          afterChange={(tableChanges) => {
            if (tableChanges) {
              const newData = [...data]
              const newChanges = [...changes]

              tableChanges.forEach(([row, prop, oldVal, newVal]) => {
                if (oldVal !== newVal) {
                  // Update table data (keeping display names)
                  newData[row]![prop as number] = newVal

                  // Track the change
                  const user = users[row]
                  if (!user) return // Skip if user not found
                  
                  const monthIndex = (prop as number) - 1 // prop is 1-indexed, months array is 0-indexed
                  const month = MONTHS[monthIndex]
                  if (!month) return // Skip if month not found
                  
                  // Convert factory name back to code for comparison and storage
                  const newFactoryCode = factoryNameToCode[newVal] ?? ''
                  const originalFactoryCode = originalAssignments[user.id]?.[month] ?? ''

                  // Remove any existing change for this cell
                  const existingChangeIndex = newChanges.findIndex(
                    change => change.userId === user.id && change.month === month
                  )
                  if (existingChangeIndex !== -1) {
                    newChanges.splice(existingChangeIndex, 1)
                  }

                  // Only track as change if different from original value (comparing codes)
                  if (newFactoryCode !== originalFactoryCode) {
                    newChanges.push({
                      userId: user.id,
                      month: month,
                      factory: newFactoryCode, // Store the factory code
                      originalValue: originalFactoryCode
                    })
                  }
                }
              })

              setData(newData)
              setChanges(newChanges)
              
              // Force re-render to update highlighting after changes
              setTimeout(() => {
                const hotInstance = (document.querySelector('.handsontable') as any)?.__hotInstance
                if (hotInstance) {
                  hotInstance.render()
                }
              }, 0)
            }
          }}
        />
      </div>

      {/* Changes preview (optional - for debugging/transparency) */}
      {changes.length > 0 && process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h3 className="text-sm font-medium mb-2">Pending Changes:</h3>
          <div className="text-xs space-y-1">
            {changes.map((change, index) => {
              const user = users.find(u => u.id === change.userId)
              const originalName = factoryCodeToName[change.originalValue] || change.originalValue
              const newName = factoryCodeToName[change.factory] || change.factory
              return (
                <div key={index} className="flex gap-2">
                  <span className="font-medium">{user?.last_name} {user?.first_name}</span>
                  <span>M{change.month}:</span>
                  <span className="text-red-600">"{originalName}" ({change.originalValue})</span>
                  <span>→</span>
                  <span className="text-green-600">"{newName}" ({change.factory})</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}