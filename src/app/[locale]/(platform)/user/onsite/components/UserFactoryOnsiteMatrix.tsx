'use client'

import { useState, useMemo } from 'react'
import { HotTable } from '@handsontable/react'
import 'handsontable/dist/handsontable.full.min.css'
import { registerAllModules } from 'handsontable/registry';
import { CreateUpdateOnsite } from '@/lib/api/client/api'
import type { UserDetail, UserFactoryOnsite, MonthEnum } from '@/types'
registerAllModules();
const MONTHS: MonthEnum[] = [1,2,3,4,5,6,7,8,9,10,11,12]

// Hardcoded factories (first option = empty string)
const FACTORIES = ['', '30127', '30895.4', '30150.1', '30301', '30567.1']

interface Props {
  users: UserDetail[]
  onsiteData: UserFactoryOnsite[]
}

interface Change {
  userId: string
  month: MonthEnum
  factory: string
  originalValue: string
}

export function UserFactoryOnsiteMatrix({ users, onsiteData }: Props) {
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

    const tableData = users.map(u => [
        u.username,
        ...MONTHS.map(m => assignments[u.id]![m] ?? '')
    ])

    return {
      initialData: tableData,
      originalAssignments: assignments
    }
  }, [users, onsiteData])

  const [data, setData] = useState(initialData)
  const [changes, setChanges] = useState<Change[]>([])
  const [isSaving, setIsSaving] = useState(false)

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
      source: FACTORIES,
      strict: true,
      allowInvalid: false,
      trimDropdown: false
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
      
      // Convert changes to API format
      const apiData: UserFactoryOnsite[] = changes.map(change => ({
        id: '', // Temporary empty id for bulk operations
        user: change.userId,
        year: currentYear,
        month: change.month,
        factory: change.factory
      }))

      await CreateUpdateOnsite(apiData)
      
      // Clear changes after successful save
      setChanges([])
      alert('Changes saved successfully!')
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
        <button
          onClick={handleSaveChanges}
          disabled={changes.length === 0 || isSaving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : `Save Changes ${changes.length > 0 ? `(${changes.length})` : ''}`}
        </button>
        
        <button
          onClick={handleDiscardChanges}
          disabled={changes.length === 0}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Discard Changes
        </button>

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
                  // Update table data
                  newData[row]![prop as number] = newVal

                  // Track the change
                  const user = users[row]
                  if (!user) return // Skip if user not found
                  
                  const monthIndex = (prop as number) - 1 // prop is 1-indexed, months array is 0-indexed
                  const month = MONTHS[monthIndex]
                  if (!month) return // Skip if month not found
                  
                  const originalValue = originalAssignments[user.id]?.[month] ?? ''

                  // Remove any existing change for this cell
                  const existingChangeIndex = newChanges.findIndex(
                    change => change.userId === user.id && change.month === month
                  )
                  if (existingChangeIndex !== -1) {
                    newChanges.splice(existingChangeIndex, 1)
                  }

                  // Only track as change if different from original value
                  if (newVal !== originalValue) {
                    newChanges.push({
                      userId: user.id,
                      month: month,
                      factory: newVal || '',
                      originalValue: originalValue
                    })
                  }
                }
              })

              setData(newData)
              setChanges(newChanges)
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
              return (
                <div key={index} className="flex gap-2">
                  <span className="font-medium">{user?.username}</span>
                  <span>M{change.month}:</span>
                  <span className="text-red-600">"{change.originalValue}"</span>
                  <span>→</span>
                  <span className="text-green-600">"{change.factory}"</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}