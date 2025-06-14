import type { components } from "@/types/openapi";

// Auth
export type SetPasswordRetype = components['schemas']['SetPasswordRetype']

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