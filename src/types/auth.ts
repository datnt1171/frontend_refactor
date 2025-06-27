import type { ApiSuccessResponse, ApiErrorResponse} from '@/types/common'

export interface LoginRequest {
    username: string
    password: string
}

export interface LoginSuccessResponse {
  success: true;
  requiresPasswordChange: boolean;
}

export interface LoginErrorResponse {
  success: false;
  error: string;
}

export type LoginResponse = LoginSuccessResponse | LoginErrorResponse

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