export interface ValidationError {
  [key: string]: string[]
}

export interface DetailError {
  detail: string
}

export interface GenericError {
  [key: string]: any
}

export type DjangoErrorResponse = ValidationError | DetailError | GenericError

export interface ApiErrorResponse {
  success: false
  error: string
  validationErrors?: ValidationError
}

export interface ApiSuccessResponse<T = any> {
  success: true
  data: T
}

export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse