import { api } from '@/lib/api/server/api'
import type { Blueprint } from '@/types'

export const getBlueprints = async (factory?: string): Promise<Blueprint[]> => {
  const params = factory ? `?factory=${factory}` : ''
  const res = await api(`/crm/blueprints${params}`)
  if (!res.ok) throw new Error(`Failed to fetch blueprints: ${res.status}`)
  return res.json()
}

export const getBlueprint = async (id: string): Promise<Blueprint> => {
  const res = await api(`/crm/blueprints/${id}`)
  if (!res.ok) throw new Error(`Failed to fetch blueprint: ${res.status}`)
  return res.json()
}