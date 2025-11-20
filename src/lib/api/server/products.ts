import { api } from '@/lib/api/server/api'
import type {
    PaginatedProductList,
    PaginatedMaterialList,
    PaginatedFormularList,
} from '@/types'

export const getProducts = async (searchParams?: Record<string, string>): Promise<PaginatedProductList> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/crm/products?${queryString}` : '/crm/products'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`)
  return res.json()
}

export const getMaterials = async (searchParams?: Record<string, string>): Promise<PaginatedMaterialList> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/crm/materials?${queryString}` : '/crm/materials'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch materials: ${res.status}`)
  return res.json()
}

export const getFormulars = async (searchParams?: Record<string, string>): Promise<PaginatedFormularList> => {
  const queryParams = new URLSearchParams()
  
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        queryParams.append(key, value)
      }
    })
  }
  
  const queryString = queryParams.toString()
  const endpoint = queryString ? `/crm/formulars?${queryString}` : '/crm/formulars'
  
  const res = await api(endpoint)
  if (!res.ok) throw new Error(`Failed to fetch formulars: ${res.status}`)
  return res.json()
}