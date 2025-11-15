'use client'

import { useState } from 'react'
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { uploadSalesFile, uploadOrderFile } from '@/lib/api/client/api'
import { useTranslations } from 'next-intl'

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

interface UploadState {
  status: UploadStatus
  message: string
  data?: any
}

export function SalesFileUpload() {
  const t = useTranslations()

  const [file, setFile] = useState<File | null>(null)
  const [uploadState, setUploadState] = useState<UploadState>({ status: 'idle', message: '' })
  const [isDragging, setIsDragging] = useState(false)

  const validateAndSetFile = (selectedFile: File | null) => {
    if (!selectedFile) return

    const fileExtension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'))
    
    if (!['.xlsx', '.xls'].includes(fileExtension)) {
      setUploadState({
        status: 'error',
        message: t('common.invalidFile')
      })
      return
    }

    setFile(selectedFile)
    setUploadState({ status: 'idle', message: '' })
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    validateAndSetFile(selectedFile || null)
  }

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
    
    const droppedFile = event.dataTransfer.files?.[0]
    validateAndSetFile(droppedFile || null)
  }

  const handleUpload = async () => {
    if (!file) {
      setUploadState({
        status: 'error',
        message: t('common.noFileProvided')
      })
      return
    }

    setUploadState({ status: 'uploading', message: t('common.processing') })

    try {
      const response = await uploadSalesFile(file)
      setUploadState({
        status: 'success',
        message: t('common.UploadSuccessfully', { filename: response.data.filename }),
        data: response.data
      })
    } catch (error) {
      setUploadState({
        status: 'error',
        message: error instanceof Error ? error.message : t('common.UploadFailed')
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          {t('dashboard.sales.salesData')}
        </CardTitle>
        <CardDescription>{t('dashboard.sales.salesDataUploadDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="sales-file-upload"
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              isDragging 
                ? 'bg-muted border-primary' 
                : 'hover:bg-muted/50'
            }`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {file ? (
                  <span className="font-medium text-foreground">{file.name}</span>
                ) : (
                  <>
                    <span className="font-semibold">{t('common.clickToUpload')}
                    </span> {t('common.or')} {t('common.dragAndDrop')}
                  </>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Excel (.xlsx, .xls)
              </p>
            </div>
            <input
              id="sales-file-upload"
              type="file"
              className="hidden"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              disabled={uploadState.status === 'uploading'}
            />
          </label>
        </div>

        {file && (
          <div className="text-sm text-muted-foreground space-y-1">
            <p>{t('common.fileSize')}: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <p>{t('common.type')}: {file.type || 'application/vnd.ms-excel'}</p>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || uploadState.status === 'uploading'}
          className="w-full"
        >
          {uploadState.status === 'uploading' ? (
            <>
              <div className="h-4 w-4 mr-2 border-2 border-background border-t-transparent rounded-full animate-spin" />
              {t('common.processing')}
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              {t('dashboard.sales.salesDataUpload')}
            </>
          )}
        </Button>

        {uploadState.status === 'success' && (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              {uploadState.message}
              {uploadState.data && (
                <div className="mt-2 text-xs space-y-1">
                  <p>{t('common.type')}: {uploadState.data.file_size_mb} MB</p>
                  <p>{t('common.createdAt')}: {new Date(uploadState.data.uploaded_at).toLocaleString()}</p>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {uploadState.status === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{uploadState.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

export function OrderFileUpload() {
  const t = useTranslations()

  const [file, setFile] = useState<File | null>(null)
  const [uploadState, setUploadState] = useState<UploadState>({ status: 'idle', message: '' })
  const [isDragging, setIsDragging] = useState(false)

  const validateAndSetFile = (selectedFile: File | null) => {
    if (!selectedFile) return

    const fileExtension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'))
    
    if (!['.xlsx', '.xls'].includes(fileExtension)) {
      setUploadState({
        status: 'error',
        message: t('common.invalidFile')
      })
      return
    }

    setFile(selectedFile)
    setUploadState({ status: 'idle', message: '' })
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    validateAndSetFile(selectedFile || null)
  }

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)
    
    const droppedFile = event.dataTransfer.files?.[0]
    validateAndSetFile(droppedFile || null)
  }

  const handleUpload = async () => {
    if (!file) {
      setUploadState({
        status: 'error',
        message: t('common.noFileProvided')
      })
      return
    }

    setUploadState({ status: 'uploading', message: t('common.processing') })

    try {
      const response = await uploadOrderFile(file)
      setUploadState({
        status: 'success',
        message: t('common.UploadSuccessfully', { filename: response.data.filename }),
        data: response.data
      })
    } catch (error) {
      setUploadState({
        status: 'error',
        message: error instanceof Error ? error.message : t('common.UploadFailed')
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          {t('dashboard.order.orderData')}
        </CardTitle>
        <CardDescription>{t('dashboard.order.orderDataUploadDescription')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="order-file-upload"
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              isDragging 
                ? 'bg-muted border-primary' 
                : 'hover:bg-muted/50'
            }`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {file ? (
                  <span className="font-medium text-foreground">{file.name}</span>
                ) : (
                  <>
                    <span className="font-semibold">{t('common.clickToUpload')}
                    </span> {t('common.or')} {t('common.dragAndDrop')}
                  </>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Excel (.xlsx, .xls)
              </p>
            </div>
            <input
              id="order-file-upload"
              type="file"
              className="hidden"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              disabled={uploadState.status === 'uploading'}
            />
          </label>
        </div>

        {file && (
          <div className="text-sm text-muted-foreground space-y-1">
            <p>{t('common.fileSize')}: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <p>{t('common.type')}: {file.type || 'application/vnd.ms-excel'}</p>
          </div>
        )}

        <Button
          onClick={handleUpload}
          disabled={!file || uploadState.status === 'uploading'}
          className="w-full"
        >
          {uploadState.status === 'uploading' ? (
            <>
              <div className="h-4 w-4 mr-2 border-2 border-background border-t-transparent rounded-full animate-spin" />
              {t('common.processing')}
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              {t('dashboard.order.orderDataUpload')}
            </>
          )}
        </Button>

        {uploadState.status === 'success' && (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              {uploadState.message}
              {uploadState.data && (
                <div className="mt-2 text-xs space-y-1">
                  <p>{t('common.type')}: {uploadState.data.file_size_mb} MB</p>
                  <p>{t('common.createdAt')}: {new Date(uploadState.data.uploaded_at).toLocaleString()}</p>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {uploadState.status === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{uploadState.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}