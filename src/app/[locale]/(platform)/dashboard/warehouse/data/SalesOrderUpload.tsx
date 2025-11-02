'use client'

import { useState } from 'react'
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { uploadSalesFile, uploadOrderFile } from '@/lib/api/client/api'

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

interface UploadState {
  status: UploadStatus
  message: string
  data?: any
}

export function SalesFileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploadState, setUploadState] = useState<UploadState>({ status: 'idle', message: '' })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    const fileExtension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'))
    
    if (!['.xlsx', '.xls'].includes(fileExtension)) {
      setUploadState({
        status: 'error',
        message: 'Please select an Excel file (.xlsx or .xls)'
      })
      return
    }

    setFile(selectedFile)
    setUploadState({ status: 'idle', message: '' })
  }

  const handleUpload = async () => {
    if (!file) {
      setUploadState({
        status: 'error',
        message: 'Please select a file first'
      })
      return
    }

    setUploadState({ status: 'uploading', message: 'Uploading...' })

    try {
      const response = await uploadSalesFile(file)
      setUploadState({
        status: 'success',
        message: `File uploaded successfully: ${response.data.filename}`,
        data: response.data
      })
    } catch (error) {
      setUploadState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Upload failed'
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Dữ liệu giao hàng
        </CardTitle>
        <CardDescription>Upload sales transaction Excel file</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="sales-file-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {file ? (
                  <span className="font-medium text-foreground">{file.name}</span>
                ) : (
                  <>
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Excel files only (.xlsx, .xls)
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
            <p>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <p>Type: {file.type || 'application/vnd.ms-excel'}</p>
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
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Sales Data
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
                  <p>File size: {uploadState.data.file_size_mb} MB</p>
                  <p>Uploaded at: {new Date(uploadState.data.uploaded_at).toLocaleString()}</p>
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
  const [file, setFile] = useState<File | null>(null)
  const [uploadState, setUploadState] = useState<UploadState>({ status: 'idle', message: '' })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (!selectedFile) return

    const fileExtension = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'))
    
    if (!['.xlsx', '.xls'].includes(fileExtension)) {
      setUploadState({
        status: 'error',
        message: 'Please select an Excel file (.xlsx or .xls)'
      })
      return
    }

    setFile(selectedFile)
    setUploadState({ status: 'idle', message: '' })
  }

  const handleUpload = async () => {
    if (!file) {
      setUploadState({
        status: 'error',
        message: 'Please select a file first'
      })
      return
    }

    setUploadState({ status: 'uploading', message: 'Uploading...' })

    try {
      const response = await uploadOrderFile(file)
      setUploadState({
        status: 'success',
        message: `File uploaded successfully: ${response.data.filename}`,
        data: response.data
      })
    } catch (error) {
      setUploadState({
        status: 'error',
        message: error instanceof Error ? error.message : 'Upload failed'
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          Dữ liệu Đơn đặt hàng
        </CardTitle>
        <CardDescription>Upload order Excel file</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="order-file-upload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {file ? (
                  <span className="font-medium text-foreground">{file.name}</span>
                ) : (
                  <>
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Excel files only (.xlsx, .xls)
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
            <p>Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <p>Type: {file.type || 'application/vnd.ms-excel'}</p>
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
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Upload Order Data
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
                  <p>File size: {uploadState.data.file_size_mb} MB</p>
                  <p>Uploaded at: {new Date(uploadState.data.uploaded_at).toLocaleString()}</p>
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