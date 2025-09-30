import { getSessionCookie, unauthorizedResponse, handleError } from "@/lib/utils/api"
import { NextRequest, NextResponse } from "next/server"
import type { PaginatedFactoryList, OnsiteTransferAbsence, Overtime, SampleByFactory } from "@/types"

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

const defaultSampleByFactory: Partial<SampleByFactory> = {
  factory_code: "-",
  quantity_requirement: 0,
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionCookie()
    if (!session.access_token) return unauthorizedResponse()
    
    // Prepare URLs
    const absenceUrl = new URL(`${process.env.API_URL}/api/tasks/onsite-transfer-absence/`)
    const overtimeUrl = new URL(`${process.env.API_URL}/api/tasks/overtime/`)
    const sampleByFactoryUrl = new URL(`${process.env.API_URL}/api/tasks/sample-by-factory/`)
    
    request.nextUrl.searchParams.forEach((value, key) => {
      absenceUrl.searchParams.set(key, value)
      overtimeUrl.searchParams.set(key, value)
      sampleByFactoryUrl.searchParams.set(key, value)
    })

    const headers = {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
      "Accept-Language": session.locale,
    }

    // Fetch all data in parallel
    const [absenceResponse, overtimeResponse, sampleResponse, factoryResponse] = await Promise.all([
      fetch(absenceUrl, { headers }),
      fetch(overtimeUrl, { headers }),
      fetch(sampleByFactoryUrl, { headers }),
      fetch(`${process.env.DW_API_URL}/api/crm/factories?page=1&page_size=999999`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      })
    ])

    const absences: OnsiteTransferAbsence[] = await absenceResponse.json()
    const overtimes: Overtime[] = await overtimeResponse.json()
    const samples: SampleByFactory[] = await sampleResponse.json()
    const paginatedFactory: PaginatedFactoryList = await factoryResponse.json()

    // Create factory map
    interface FactoryMap {
      [key: string]: {
        factory_name: string;
        salesman: string;
      }
    }
    const factoryMap: FactoryMap = paginatedFactory.results.reduce((map: FactoryMap, factory) => {
      map[factory.factory_code] = {
        factory_name: factory.factory_name,
        salesman: factory.salesman || "" // adjust property name as needed
      }
      return map
    }, {})

    // Create overtime map for efficient lookup
    const overtimeMap = new Map(
      overtimes.map(ot => [ot.factory_code, ot])
    )
    
    const sampleMap = new Map(
      samples.map(sample => [sample.factory_code, sample])
    )

    // Perform left join: absence + overtime + sample + factory_name
    const joinedData = absences.map((absence) => ({
      ...absence,
      factory_name: factoryMap[absence.factory_code]?.factory_name || "",
      salesman: factoryMap[absence.factory_code]?.salesman || "",
      overtime: overtimeMap.get(absence.factory_code) || defaultOvertime,
      sample_by_factory: sampleMap.get(absence.factory_code) || defaultSampleByFactory
    }))

    const sortedData = joinedData.sort((a, b) => {
      return a.salesman.localeCompare(b.salesman)
    })
    
    return NextResponse.json(sortedData)
    
  } catch (error: unknown) {
    return handleError(error)
  }
}