"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Combobox } from "@/components/ui/combobox"
import { useTranslations } from 'next-intl'
import type { ProcessField, UserList } from "@/types/api"
import { ACCEPTED_FILE_TYPES } from "@/constants/navigation"

interface FormFieldProps {
  field: ProcessField
  users: UserList[]
  value: any
  onChange: (value: any) => void
  disabled: boolean
}

// const ALLOWED_FILE_TYPES = [
//   "image/jpeg", "image/png", "application/pdf",
//   "application/msword",
//   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   "application/vnd.ms-excel",
//   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
// ]

export function FormField({ 
  field, 
  users, 
  value, 
  onChange, 
  disabled 
}: FormFieldProps) {
  const t = useTranslations('taskManagement.createTask')
  const commonT = useTranslations('common')
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      //   alert(commonT('invalidFile'))
      //   e.target.value = ""
      //   onChange(undefined)
      //   return
      // }
      console.log('File selected:', {
      name: file.name,
      type: file.type,
      size: file.size
    })
    }
    onChange(file)
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (val === "" || (Number.isInteger(Number(val)) && Number(val) > 0)) {
      onChange(val)
    }
  }

  switch (field.field_type) {
    case "assignee":
      const userOptions = users.map(user => ({
        value: user.id.toString(),
        label: `${user.last_name} ${user.first_name} (${user.username})`,
        searchValue: `${user.last_name} ${user.first_name} ${user.username}`
      }))

      return (
        <Combobox
          options={userOptions}
          value={value || ""}
          onValueChange={onChange}
          placeholder={t('selectUser')}
          searchPlaceholder={t('searchUsers')}
          emptyMessage={commonT('noDataFound')}
          disabled={disabled}
        />
      )

    case "text":
      return (
        <Input
          id={`field-${field.id}`}
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          disabled={disabled}
        />
      )

    case "number":
      return (
        <Input
          id={`field-${field.id}`}
          type="number"
          min="1"
          step="1"
          value={value || ""}
          onChange={handleNumberChange}
          required={field.required}
          disabled={disabled}
        />
      )

    case "date":
      return (
        <Input
          id={`field-${field.id}`}
          type="date"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          disabled={disabled}
        />
      )

    case "select":
      const optionsArray: string[] = Array.isArray(field.options)
        ? field.options as string[]
        : []
      
      return (
        <Select
          value={value || ""}
          onValueChange={onChange}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {optionsArray.map(option => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )

    case "file":
      return (
        <Input
          id={`field-${field.id}`}
          type="file"
          // accept={ACCEPTED_FILE_TYPES}
          onChange={handleFileChange}
          required={field.required}
          disabled={disabled}
        />
      )

    default:
      return null
  }
}