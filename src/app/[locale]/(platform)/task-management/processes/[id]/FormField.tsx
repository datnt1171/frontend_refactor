"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"
import { useTranslations } from 'next-intl'
import type { ProcessField, UserList, Factory, Retailer, ValueLabel } from "@/types"
import { ACCEPTED_FILE_TYPES } from "@/constants/navigation"
import { compressImage } from "@/lib/utils/imageCompression"
import ReactSelect from 'react-select';
import heic2any from 'heic2any';

interface FormFieldProps {
  field: ProcessField
  users: UserList[]
  factories: Factory[]
  retailers: Retailer[]
  value: any
  onChange: (value: any) => void
  disabled: boolean
}

export function FormField({ 
  field, 
  users, 
  factories,
  retailers,
  value, 
  onChange, 
  disabled
}: FormFieldProps) {
  const t = useTranslations()
  
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      try {
        const fileCount = files.length
        
        // Dynamic compression settings based on file count
        const getCompressionOptions = (count: number) => {
          if (count === 1) {
            // Single image - higher quality for color panels
            return {
              maxWidth: 1440,
              maxHeight: 1920,
              quality: 0.89,
              maxSizeKB: 1024
            }
          } else if (count <= 3) {
            // Few images - medium quality
            return {
              maxWidth: 1080,
              maxHeight: 1440,
              quality: 0.8,
              maxSizeKB: 600
            }
          } else {
            // Multiple images - lower quality for daily reports
            return {
              maxWidth: 800,
              maxHeight: 1200,
              quality: 0.75,
              maxSizeKB: 400
            }
          }
        }
        
        const compressionOptions = getCompressionOptions(fileCount)
        
        const processedFiles = await Promise.all(
          Array.from(files).map(async (file) => {
            let fileToCompress = file;
            
            // Convert HEIC first if needed
            if (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic') {
              try {
                const convertedBlob = await heic2any({
                  blob: file,
                  toType: 'image/jpeg',
                  quality: 0.9
                });
                
                const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                
                if (!blob) {
                  throw new Error('Conversion returned empty blob');
                }
                
                fileToCompress = new File(
                  [blob], 
                  file.name.replace(/\.heic$/i, '.jpg'),
                  { type: 'image/jpeg' }
                );
              } catch (error) {
                console.error('HEIC conversion failed:', file.name, error);
                return file;
              }
            }
            
            return compressImage(fileToCompress, compressionOptions).catch(error => {
              console.error('Compression failed:', fileToCompress.name, error);
              return fileToCompress;
            });
          })
        );
        
        onChange(processedFiles);
      } catch (error) {
        console.error('File processing failed:', error);
      }
    }
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
        <ReactSelect
          options={userOptions}
          value={userOptions.find(option => option.value === value) || null}
          onChange={(selectedOption) => onChange(selectedOption?.value || "")}
          placeholder={t('taskManagement.createTask.selectUser')}
          noOptionsMessage={() => t('common.noDataFound')}
          isDisabled={disabled}
          isSearchable={true}
          isClearable={true}
        />
      );
    
    case "factory":
      const factoryOptions = factories.map(factory => ({
        value: factory.factory_code.toString(),
        label: `${factory.factory_name} (${factory.factory_code})`,
        searchValue: `${factory.factory_name} ${factory.factory_code}`
      }))

      return (
        <ReactSelect
          options={factoryOptions}
          value={factoryOptions.find(option => option.value === value) || null}
          onChange={(selectedOption) => onChange(selectedOption?.value || "")}
          placeholder={t('common.selectFactory')}
          noOptionsMessage={() => t('common.noDataFound')}
          isDisabled={disabled}
          isSearchable={true}
          isClearable={true}
        />
      );

    case "retailer":
      const retailerOptions = retailers.map(retailer => ({
        value: retailer.id.toString(),
        label: `${retailer.name}`,
        searchValue: `${retailer.name}`
      }))

      return (
        <ReactSelect
          options={retailerOptions}
          value={retailerOptions.find(option => option.value === value) || null}
          onChange={(selectedOption) => onChange(selectedOption?.value || "")}
          placeholder={t('common.selectRetailer')}
          noOptionsMessage={() => t('common.noDataFound')}
          isDisabled={disabled}
          isSearchable={true}
          isClearable={true}
        />
      );

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

    case "time":
      return (
        <Input
          id={`field-${field.id}`}
          type="time"
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

    case "multiselect":
      const multiSelectOptions = Array.isArray(field.options)
        ? field.options as ValueLabel[]
        : []
      
      return (
        <MultiSelect
          options={multiSelectOptions}
          onValueChange={onChange}
          defaultValue={value || []}
          disabled={disabled}
          responsive={true}
          modalPopover={true}
          closeOnSelect={false}
        />
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

    case "multifile":
      return (
        <Input
          id={`field-${field.id}`}
          type="file"
          multiple={true}
          onChange={handleFileChange}
          required={field.required}
          disabled={disabled}
        />
      )

    default:
      return null
  }
}