import type { components } from "@/types/openapi";
import { WritableFields } from "./common";

// Auth
export type SetPasswordRetype = components['schemas']['ChangePassword']

// User
export type Department = components['schemas']['Department']
export type Role = components['schemas']['Role']
export type UserList = components['schemas']['UserList']
export type UserDetail = components['schemas']['UserDetail']

// Process
export type ProcessField = components['schemas']['ProcessField']
export type FieldTypeEnum = components['schemas']['FieldTypeEnum']
export type ProcessDetail = components['schemas']['ProcessDetail']
export type ProcessList = components['schemas']['ProcessList']
export type Action = components['schemas']['Action']
export type ActionTypeEnum = components['schemas']['ActionTypeEnum']

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

export type SPRReportRow = components['schemas']['SPRReportRow']

// Finishing sheet
export type FinishingSheet = components['schemas']['FinishingSheet']
export type SheetRow = components['schemas']['SheetRow'] 
export type RowProduct = components['schemas']['RowProduct']
export type PaginatedFinishingSheetList = components['schemas']['PaginatedFinishingSheetList']

export interface GetFinishingSheetsParams {
  created_by?: string;
  search?: string;
  ordering?: 'created_at' | '-created_at' | 'updated_at' | '-updated_at' | 'id' | '-id';
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

export type RowProductWrite = WritableFields<components['schemas']['RowProduct']>

export type SheetRowWrite = WritableFields<components['schemas']['SheetRow']> & {
  products: RowProductWrite[];
}

export type FinishingSheetWrite = WritableFields<components['schemas']['FinishingSheet']> & {
  rows: SheetRowWrite[];
}

// Sheet templates
export type StepTemplate = components['schemas']['StepTemplate']
export type FormularTemplate = components['schemas']['FormularTemplate']


// Pagination
export type PaginatedProcessListList = components['schemas']['PaginatedProcessListList']
export type PaginatedReceivedTaskList = components['schemas']['PaginatedReceivedTaskList']
export type PaginatedSentTaskList = components['schemas']['PaginatedSentTaskList']
export type PaginatedUserList = components['schemas']['PaginatedUserListList']