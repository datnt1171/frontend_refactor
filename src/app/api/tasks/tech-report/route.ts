import { getSessionCookie, unauthorizedResponse, handleError } from "@/lib/utils/api"
import { NextRequest, NextResponse } from "next/server"
import type { PaginatedFactoryList, OnsiteTransferAbsence, Overtime, SampleByFactory } from "@/types"

const defaultOnsiteTransferAbsence: Partial<OnsiteTransferAbsence> = {
  factory_code: "-",
  ktw_onsite: 0,
  ktc_onsite: 0,
  kvn_onsite: 0,
  tt_onsite: 0,
  ktw_in: 0,
  ktc_in: 0,
  kvn_in: 0,
  tt_in: 0,
  ktw_out: 0,
  ktc_out: 0,
  kvn_out: 0,
  tt_out: 0,
  ktw_absence: 0,
  ktc_absence: 0,
  kvn_absence: 0,
  tt_absence: 0,
}

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
  num_of_ppl: 0,
  name_of_ppl: "-",
  files: [],
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

    // Extract search params from frontend
    const allowedStates = ["working", "pending_approve", "start", "analyze"]
    sampleByFactoryUrl.searchParams.set("state_type__in", allowedStates.join(","))

    const date = request.nextUrl.searchParams.get("date")
    if (date) {
      // absenceUrl keeps using "date"
      absenceUrl.searchParams.set("date", date)

      // overtimeUrl expects date__gte and date__lte
      overtimeUrl.searchParams.set("date__gte", date)
      overtimeUrl.searchParams.set("date__lte", date)
    }

    console.log("absenceUrl:", absenceUrl.href)
    console.log("overtimeUrl:", overtimeUrl.href)
    console.log("sampleByFactoryUrl:", sampleByFactoryUrl.href)

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
        salesman: factory.salesman || ""
      }
      return map
    }, {})

    // Create absence maps for efficient lookup
    const absenceMap = new Map(
      absences.map(absence => [absence.factory_code, absence])
    )

    // Create overtime map for efficient lookup
    const overtimeMap = new Map(
      overtimes.map(ot => [ot.factory_code, ot])
    )
    
    const sampleMap = new Map(
      samples.map(sample => [sample.factory_code, sample])
    )

    // Get all unique factory codes from both absences and overtimes
    const allFactoryCodes = new Set([
      ...absences.map(a => a.factory_code),
      ...overtimes.map(o => o.factory_code)
    ])

    // Perform full outer join: combine all factory codes with their respective data
    const joinedData = Array.from(allFactoryCodes).map((factoryCode) => {
      const absence = absenceMap.get(factoryCode) || { 
        ...defaultOnsiteTransferAbsence, 
        factory_code: factoryCode 
      }
      const overtime = overtimeMap.get(factoryCode) || { 
        ...defaultOvertime, 
        factory_code: factoryCode 
      }
      const sample = sampleMap.get(factoryCode) || { 
        ...defaultSampleByFactory, 
        factory_code: factoryCode 
      }

      return {
        ...absence,
        factory_name: factoryMap[factoryCode]?.factory_name || "",
        salesman: factoryMap[factoryCode]?.salesman || "",
        overtime,
        sample_by_factory: sample
      }
    })

    const sortedData = joinedData.sort((a, b) => {
      const targetSalesman = "陳國勇"
      
      // If a is 陳國勇, push to end
      if (a.salesman === targetSalesman) return 1
      
      // If b is 陳國勇, push to end
      if (b.salesman === targetSalesman) return -1
      
      // Otherwise, sort normally
      return a.salesman.localeCompare(b.salesman)
    })
    
    return NextResponse.json(sortedData)
    
  } catch (error: unknown) {
    return handleError(error)
  }
}