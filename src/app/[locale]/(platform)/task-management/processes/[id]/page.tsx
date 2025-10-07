import { getProcess, getUsers, getFactories, getRetailers, getCurrentUser } from "@/lib/api/server"
import { ProcessFormClient } from "./ProcessForm"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function FormPage({ params }: PageProps) {
  const { id } = await params
  
  const process = await getProcess(id)

  // Check if need to fetch user or not
  const needsUsers = process.fields.some(field => field.field_type === "assignee")

  // Get Techicians only
  const users = needsUsers ? (await getUsers({
    'department__name__in': 'KTC,KTW,KVN,TT',
    'role__name__in': 'technician',
    'page_size': '999999',
    'page': '1'
  })).results : []

  // Check if need to fetch factory or not
  const needsFactories = process.fields.some(field => field.field_type === "factory")
  const factories = needsFactories ? (await getFactories(
    {
      'is_active': 'true', 
      'has_onsite': 'true',
      'page_size': '999999',
      'page': '1'
    }
  )).results : []

  // Check if need to fetch retailer or not
  const needsRetailers = process.fields.some(field => field.field_type === "retailer")
  const retailers = needsRetailers 
  ? (await getRetailers(
    { 
      'page_size': '999999',
      'page': '1' 
    }
    
  )).results : []

  const currentUser = await getCurrentUser()

  return (
    <ProcessFormClient 
      process={process}
      users={users}
      factories={factories}
      retailers={retailers}
      currentUser={currentUser}
    />
  )
}