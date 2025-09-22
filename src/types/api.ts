import type { components } from "@/types/openapi";

// CONST
export type MonthEnum = components['schemas']['MonthEnum']
// Auth
export type SetPasswordRetype = components['schemas']['ChangePassword']

// User
export type Department = components['schemas']['Department']
export type Role = components['schemas']['Role']
export type UserList = components['schemas']['User']
export type UserDetail = components['schemas']['UserDetail']

// Onsite - Transfer - Absence
export type UserFactoryOnsite = components['schemas']['UserFactoryOnsite']

// Process
export type ProcessField = components['schemas']['ProcessField']
export type FieldTypeEnum = components['schemas']['FieldTypeEnum']
export type ProcessDetail = components['schemas']['ProcessDetail']
export type ProcessList = components['schemas']['Process']
export type Action = components['schemas']['Action']
export type ActionTypeEnum = components['schemas']['ActionTypeEnum']
export type ValueLabel = {
  value: string;
  label: string;
};

export type FieldCondition = components['schemas']['FieldCondition']

// Workflow_engine
export type State = components['schemas']['State']
export type StateTypeEnum = components['schemas']['StateTypeEnum']

// Task
export type ReceivedTask = components['schemas']['ReceivedTask']
export type SentTask = components['schemas']['SentTask']
export type TaskDataInput = components['schemas']['TaskDataInput']
export type TaskCreate = components['schemas']['TaskCreate']
export type TaskAction = components['schemas']['TaskAction']

export type TaskFileData = components['schemas']['TaskFileData']
export type TaskData = components['schemas']['TaskData']
export type TaskActionLog = components['schemas']['TaskActionLog']
export type TaskDetail = components['schemas']['TaskDetail']

export type TaskDataDetail = components['schemas']['TaskDataDetail']
export type TaskActionDetail = components['schemas']['TaskActionDetail']

// Finishing sheet
export type FinishingSheet = components['schemas']['FinishingSheet']
export type SheetRow = components['schemas']['SheetRow'] 
export type RowProduct = components['schemas']['RowProduct']
export type PaginatedFinishingSheetList = components['schemas']['PaginatedFinishingSheetList']
export type SheetBlueprint = components['schemas']['SheetBlueprint']
export type PaginatedSheetBlueprintList = components['schemas']['PaginatedSheetBlueprintList']


// Sheet templates
export type StepTemplate = components['schemas']['StepTemplate']
export type FormularTemplate = components['schemas']['FormularTemplate']


// Pagination
export type PaginatedProcessListList = components['schemas']['PaginatedProcessList']
export type PaginatedReceivedTaskList = components['schemas']['PaginatedReceivedTaskList']
export type PaginatedSentTaskList = components['schemas']['PaginatedSentTaskList']
export type PaginatedUserList = components['schemas']['PaginatedUserDetailList']