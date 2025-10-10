import type { components } from "@/types/openapi_dw";

// Factory
export type Factory = components['schemas']['Factory']
export type FactoryDetail = components['schemas']['FactoryDetail']
export type PaginatedFactoryList = components['schemas']['PaginatedFactoryList']
export type FactoryUpdate = components['schemas']['FactoryUpdate']

// Retailer
export type Retailer = components['schemas']['Retailer']
export type RetailerDetail = components['schemas']['RetailerDetail']
export type PaginatedRetailerList = components['schemas']['PaginatedRetailerList'] 

// Blueprint
export type Blueprint = components['schemas']['Blueprint']
export type BlueprintCreate = components['schemas']['BlueprintCreate']
export type BlueprintUpdate = components['schemas']['BlueprintUpdate']
export type ProductionLineType = components['schemas']['ProductionLineType']

// Warehouse report
export type Overall = components['schemas']['Overall']