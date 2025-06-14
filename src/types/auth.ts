import type { ApiSuccessResponse, ApiErrorResponse} from '@/types/common'

export interface LoginRequest {
    username: string
    password: string
}

export type LoginResponse = ApiSuccessResponse | ApiErrorResponse

export interface TokenResponse {
    access: string
    refresh: string
}

export interface RefreshRequest {
    refresh: string
}

export interface RefreshResponse {
    access: string
    refresh: string
}