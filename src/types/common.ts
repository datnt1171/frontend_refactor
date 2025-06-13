export interface ApiSuccessResponse {
  success: true
}

export interface ApiErrorResponse {
  success: false
  error: string
}