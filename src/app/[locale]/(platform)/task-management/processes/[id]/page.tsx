"use client"

import React, { useState, useEffect, use } from "react"
import { useRouter, Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Send, Loader2, Eye } from "lucide-react"
import { getProcessById, getUsers, createTask } from "@/lib/api"
import { useTranslations } from 'next-intl'
import type { ProcessDetail, UserList, ProcessField } from "@/types/api"

export default function FormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [process, setProcess] = useState<ProcessDetail | null>(null)
  const [users, setUsers] = useState<UserList[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formValues, setFormValues] = useState<Record<string, any>>({})
  const [showReview, setShowReview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const t = useTranslations('dashboard')

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const [processResponse, usersResponse] = await Promise.all([getProcessById(id), getUsers()])
        setProcess(processResponse)
        setUsers(usersResponse.results);
      } catch (err: any) {
        console.error("Error fetching data:", err)
        setError(err.response?.data?.error || "Failed to load form data")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleInputChange = (fieldId: string, value: any) => {
    setFormValues({
      ...formValues,
      [fieldId]: value,
    })
  }

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault()
    const missingFields = process?.fields
      .filter(field => field.required && !formValues[field.id])
      .map(field => field.name)
    if (missingFields?.length) {
      alert(t('createTask.pleaseFillRequiredFields', { fields: missingFields.join(", ") }))
      return
    }
    setShowReview(true)
  }

  const handleSubmit = async () => {
  setIsSubmitting(true);

  try {
    const formData = new FormData();
    formData.append("process", String(process?.id));

    process?.fields.forEach((field, index) => {
      // Always append the field_id
      formData.append(`fields[${index}][field_id]`, String(field.id));

      const value = formValues[field.id];
      if (field.field_type === "file" && value instanceof File) {
        // For a file field, append under fields[index][file]
        formData.append(`fields[${index}][file]`, value);
      } else {
        // Otherwise, append under fields[index][value]
        formData.append(`fields[${index}][value]`, value ?? "");
      }
    });

    await createTask(formData);
    alert(t("createTask.taskCreatedSuccessfully"));
    router.push("/task-management/tasks/sent");
  } catch (err: any) {
    console.error("Error creating task:", err.response?.data || err.message);
    alert(err.response?.data?.error || t("createTask.failedToCreateTask"));
  } finally {
    setIsSubmitting(false);
  }
};

  const renderField = (field: ProcessField) => {
    switch (field.field_type) {
      case "assignee":
        return (
          <Select
            value={formValues[field.id] || ""}
            onValueChange={(value) => handleInputChange(field.id, value)}
            disabled={showReview}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('createTask.selectUser')} />
            </SelectTrigger>
            <SelectContent>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.first_name} {user.last_name} ({user.username})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "text":
        return (
          <Input
            id={`field-${field.id}`}
            type="text"
            value={formValues[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            disabled={showReview}
          />
        )

      case "number":
        return (
          <Input
            id={`field-${field.id}`}
            type="number"
            min="1"
            step="1"
            value={formValues[field.id] || ""}
            onChange={(e) => {
              const value = e.target.value;
              // Only allow positive integers
              if (value === "" || (Number.isInteger(Number(value)) && Number(value) > 0)) {
                handleInputChange(field.id, value);
              }
            }}
            required={field.required}
            disabled={showReview}
          />
        )

      case "date":
        return (
          <Input
            id={`field-${field.id}`}
            type="date"
            value={formValues[field.id] || ""}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            required={field.required}
            disabled={showReview}
          />
        )
      // case "textarea":
      //   return (
      //     <Textarea
      //       id={`field-${field.id}`}
      //       value={formValues[field.id] || ""}
      //       onChange={(e) => handleInputChange(field.id, e.target.value)}
      //       required={field.required}
      //       disabled={showReview}
      //     />
      //   )
      case "select":
        // Ensure options is an array of strings
        const optionsArray: string[] = Array.isArray(field.options)
          ? field.options as string[]
          : [];
        return (
          <Select
            value={formValues[field.id] || ""}
            onValueChange={(value) => handleInputChange(field.id, value)}
            disabled={showReview}
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
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                const allowedTypes = [
                  "image/jpeg", "image/png", "application/pdf",
                  "application/msword", // .doc
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
                  "application/vnd.ms-excel", // .xls
                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" // .xlsx
                ];
                if (!allowedTypes.includes(file.type)) {
                  alert("Invalid file type. Please select a valid file.");
                  e.target.value = "";
                  handleInputChange(field.id, undefined);
                  return;
                }
              }
              handleInputChange(field.id, file);
            }}
            required={field.required}
            disabled={showReview}
          />
        )
      default:
        return null
    }
  }

  const displayFieldValue = (field: ProcessField) => {
    if (!formValues[field.id]) {
      return <span className="text-muted-foreground italic">{t('createTask.noValueProvided')}</span>
    }
    if (field.field_type === "assignee") {
      const user = users.find(u => u.id.toString() === formValues[field.id])
      return user ? `${user.first_name} ${user.last_name} (${user.username})` : formValues[field.id]
    }
    if (field.field_type === "file" && formValues[field.id] instanceof File) {
      return formValues[field.id].name
    }
    return formValues[field.id]
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
        <p className="text-muted-foreground">{t('createTask.loadingFormTemplate')}</p>
      </div>
    )
  }

  if (error || !process) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">{t('createTask.templateNotFound')}</h3>
        <p className="text-muted-foreground mt-2">{error || t('createTask.requestedFormTemplateNotExist')}</p>
        <Link href="/task-management/processes">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('createTask.backToTemplates')}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/task-management/processes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">{process.name}</h1>
        </div>
      </div>

      {showReview ? (
        <Card>
          <CardHeader>
            <CardTitle>{t('createTask.reviewTask')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {process.fields.map(field => (
              <div key={field.id} className="space-y-2">
                <Label>
                  {field.name}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <div className="p-3 bg-muted rounded-md">{displayFieldValue(field)}</div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowReview(false)} disabled={isSubmitting}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('createTask.backToEdit')}
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('createTask.submitting')}
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {t('createTask.submitTask')}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t('createTask.createTask')}</CardTitle>
          </CardHeader>
          <form onSubmit={handleReview}>
            <CardContent className="space-y-4">
              {process.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={`field-${field.id}`}>
                    {field.name}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  {renderField(field)}
                </div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="submit">
                <Eye className="mr-2 h-4 w-4" />
                {t('createTask.review')}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  )
}