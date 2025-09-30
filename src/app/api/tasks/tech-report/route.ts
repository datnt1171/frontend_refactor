import { getSessionCookie, unauthorizedResponse, handleError } from "@/lib/utils/api"
import { NextRequest, NextResponse } from "next/server"
import type { PaginatedFactoryList, OnsiteTransferAbsence, Overtime } from "@/types"

const defaultOvertime: Partial<Overtime> = {
  weekday_ot: "-",
  weekday_ot_start: "-",
  weekday_ot_end: "-",
  weekday_ot_num: 0,
  hanging_line_today: "-",
  pallet_line_today: "-",
  others_today: "-",
  hanging_line_tomorrow: "-",
  pallet_line_tomorrow: "-",
  others_tomorrow: "-",
  instock: "-",
  instock_by_code: "-",
  sunday_ot: "-",
  sunday_ot_end: "-",
  sunday_ot_num: 0,
  hanging_line_sunday: "-",
  pallet_line_sunday: "-",
  created_at: "-",
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    // Prepare URLs
    const absenceUrl = new URL(`${process.env.API_URL}/api/tasks/onsite-transfer-absence/`)
    const overtimeUrl = new URL(`${process.env.API_URL}/api/tasks/overtime/`)
    
    request.nextUrl.searchParams.forEach((value, key) => {
      absenceUrl.searchParams.set(key, value)
      overtimeUrl.searchParams.set(key, value)
    })

    const headers = {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
      "Accept-Language": session.locale,
    }

    // Fetch all data in parallel
    const [absenceResponse, overtimeResponse, factoryResponse] = await Promise.all([
      fetch(absenceUrl, { headers }),
      fetch(overtimeUrl, { headers: { ...headers, "Accept-Language": session.locale } }),
      fetch(`${process.env.DW_API_URL}/api/crm/factories?page=1&page_size=999999`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      })
    ])

    const absences: OnsiteTransferAbsence[] = await absenceResponse.json()
    const overtimes: Overtime[] = await overtimeResponse.json()
    const paginatedFactory: PaginatedFactoryList = await factoryResponse.json()

    // Create factory map
    interface FactoryMap {
      [key: string]: string
    }
    const factoryMap: FactoryMap = paginatedFactory.results.reduce((map: FactoryMap, factory) => {
      map[factory.factory_code] = factory.factory_name
      return map
    }, {})

    // Create overtime map for efficient lookup
    const overtimeMap = new Map(
      overtimes.map(ot => [ot.factory_code, ot])
    )

    // Perform left join: absence + overtime + factory_name
    const joinedData = absences.map((absence) => ({
      ...absence,
      factory_name: factoryMap[absence.factory_code] || "",
      overtime: overtimeMap.get(absence.factory_code) || defaultOvertime
    }))
    
    return NextResponse.json(joinedData)
    
  } catch (error: unknown) {
    return handleError(error)
  }
}