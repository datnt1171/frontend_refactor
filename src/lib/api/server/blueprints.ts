import { api } from '@/lib/api/server/api'
import type { Blueprint } from '@/types'

export const getBlueprints = async (factory_id: string): Promise<Blueprint[]> => {
  const res = await api(`/crm/factories/${factory_id}/blueprints`)
  if (!res.ok) throw new Error(`Failed to fetch blueprints: ${res.status}`)
  return res.json()
}

export const getBlueprint = async (factory_id: string, blueprint_id : string): Promise<Blueprint> => {
  const res = await api(`/crm/factories/${factory_id}/blueprints/${blueprint_id}`)
  if (!res.ok) throw new Error(`Failed to fetch blueprint: ${res.status}`)
  return res.json()
}